from flask import Blueprint, request, jsonify, Response
from utils.db import execute_query, execute_one, execute_update
from utils.decorators import admin_required, role_required
from flask_jwt_extended import get_jwt_identity
import csv
import io
from datetime import datetime

achievements_bp = Blueprint('achievements', __name__)

@achievements_bp.route('', methods=['GET'])
@admin_required()
def get_achievements():
    """Gets list of achievements with optional searches and filters."""
    search = request.args.get('search', '').strip()
    category_id = request.args.get('category_id')
    department_id = request.args.get('department_id')
    status = request.args.get('status')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')

    query = """
        SELECT a.id, a.title, a.description, a.date_of_achievement, a.certificate_path, a.status, 
               a.reward_points_awarded, a.verification_date, a.rejection_reason, a.created_at,
               s.name AS student_name, s.student_id AS student_username, s.roll_number,
               d.name AS department_name, d.code AS department_code,
               c.name AS category_name,
               f.name AS verifier_name
        FROM achievements a
        JOIN students s ON a.student_id = s.id
        JOIN departments d ON s.department_id = d.id
        JOIN achievement_categories c ON a.category_id = c.id
        LEFT JOIN faculty f ON a.faculty_id = f.id
        WHERE 1=1
    """
    params = []

    if search:
        query += " AND (a.title LIKE %s OR s.name LIKE %s OR s.roll_number LIKE %s)"
        search_param = f"%{search}%"
        params.extend([search_param, search_param, search_param])

    if category_id:
        query += " AND a.category_id = %s"
        params.append(category_id)

    if department_id:
        query += " AND s.department_id = %s"
        params.append(department_id)

    if status:
        query += " AND a.status = %s"
        params.append(status)

    if start_date:
        query += " AND a.date_of_achievement >= %s"
        params.append(start_date)

    if end_date:
        query += " AND a.date_of_achievement <= %s"
        params.append(end_date)

    query += " ORDER BY a.created_at DESC"

    achievements = execute_query(query, params)
    for ach in achievements:
        ach['date_of_achievement'] = str(ach['date_of_achievement'])
        ach['created_at'] = str(ach['created_at'])
        if ach['verification_date']:
            ach['verification_date'] = str(ach['verification_date'])
            
    return jsonify({"achievements": achievements}), 200

@achievements_bp.route('/<int:id>', methods=['GET'])
@admin_required()
def get_achievement_by_id(id):
    """Retrieves detailed information for a single achievement."""
    query = """
        SELECT a.*, 
               s.name AS student_name, s.email AS student_email, s.roll_number, s.academic_year,
               d.name AS department_name, d.code AS department_code,
               c.name AS category_name,
               f.name AS verifier_name, f.email AS verifier_email
        FROM achievements a
        JOIN students s ON a.student_id = s.id
        JOIN departments d ON s.department_id = d.id
        JOIN achievement_categories c ON a.category_id = c.id
        LEFT JOIN faculty f ON a.faculty_id = f.id
        WHERE a.id = %s
    """
    ach = execute_one(query, (id,))
    if not ach:
        return jsonify({"error": "Achievement not found."}), 404

    ach['date_of_achievement'] = str(ach['date_of_achievement'])
    ach['created_at'] = str(ach['created_at'])
    if ach['verification_date']:
        ach['verification_date'] = str(ach['verification_date'])

    return jsonify({"achievement": ach}), 200

@achievements_bp.route('/<int:id>/status', methods=['PATCH'])
@role_required(['admin', 'faculty'])
def update_achievement_status(id):
    """Approves or rejects an achievement. Adjusts student reward points score accordingly."""
    data = request.get_json()
    if not data or 'status' not in data:
        return jsonify({"error": "Missing 'status' in request body."}), 400

    new_status = data['status']
    if new_status not in ['Approved', 'Rejected', 'Pending']:
        return jsonify({"error": "Invalid status. Must be 'Approved', 'Rejected', or 'Pending'."}), 400

    rejection_reason = data.get('rejection_reason', None)
    custom_points = data.get('reward_points_awarded', None)

    # Get active verifier information
    identity = get_jwt_identity()
    verifier_role = identity.get('role')
    
    # Verify achievement exists
    ach = execute_one("SELECT id, student_id, category_id, status, reward_points_awarded FROM achievements WHERE id = %s", (id,))
    if not ach:
        return jsonify({"error": "Achievement not found."}), 404

    old_status = ach['status']
    old_points = ach['reward_points_awarded']
    student_id = ach['student_id']
    category_id = ach['category_id']

    # Determine points to award
    if new_status == 'Approved':
        if custom_points is not None:
            points_to_award = int(custom_points)
        else:
            # Fetch default points for category
            cat = execute_one("SELECT default_points FROM achievement_categories WHERE id = %s", (category_id,))
            points_to_award = cat['default_points'] if cat else 0
    else:
        points_to_award = 0

    # Retrieve verifier's faculty ID from DB if verifier is faculty
    faculty_db_id = None
    if verifier_role == 'faculty':
        fac = execute_one("SELECT id FROM faculty WHERE faculty_id = %s", (identity.get('faculty_id'),))
        if fac:
            faculty_db_id = fac['id']

    try:
        # Update Achievement Status
        now_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        update_query = """
            UPDATE achievements 
            SET status = %s, reward_points_awarded = %s, faculty_id = %s, verification_date = %s, rejection_reason = %s
            WHERE id = %s
        """
        execute_update(update_query, (new_status, points_to_award, faculty_db_id, now_str if new_status != 'Pending' else None, rejection_reason, id))

        # Adjust Student Points Accumulation
        points_diff = 0
        if old_status == 'Approved' and new_status == 'Approved':
            points_diff = points_to_award - old_points
        elif old_status != 'Approved' and new_status == 'Approved':
            points_diff = points_to_award
        elif old_status == 'Approved' and new_status != 'Approved':
            points_diff = -old_points

        if points_diff != 0:
            execute_update(
                "UPDATE students SET reward_points = reward_points + %s WHERE id = %s",
                (points_diff, student_id)
            )

        return jsonify({
            "message": f"Achievement status updated to '{new_status}' successfully.",
            "reward_points_awarded": points_to_award,
            "points_diff_applied": points_diff
        }), 200

    except Exception as e:
        return jsonify({"error": "Failed to update achievement status.", "details": str(e)}), 500

@achievements_bp.route('/<int:id>', methods=['DELETE'])
@admin_required()
def delete_achievement(id):
    """Deletes achievement and decrements student's points if previously approved."""
    ach = execute_one("SELECT id, student_id, status, reward_points_awarded FROM achievements WHERE id = %s", (id,))
    if not ach:
        return jsonify({"error": "Achievement not found."}), 404

    try:
        # If approved, subtract points first
        if ach['status'] == 'Approved' and ach['reward_points_awarded'] > 0:
            execute_update(
                "UPDATE students SET reward_points = GREATEST(0, reward_points - %s) WHERE id = %s",
                (ach['reward_points_awarded'], ach['student_id'])
            )

        execute_update("DELETE FROM achievements WHERE id = %s", (id,))
        return jsonify({"message": "Achievement deleted successfully."}), 200
    except Exception as e:
        return jsonify({"error": "Failed to delete achievement.", "details": str(e)}), 500

@achievements_bp.route('/export', methods=['GET'])
@admin_required()
def export_achievements():
    """Exports achievement records in CSV format."""
    query = """
        SELECT a.id, a.title, c.name AS category, s.name AS student_name, s.roll_number,
               d.code AS department, a.date_of_achievement, a.status, a.reward_points_awarded,
               f.name AS verifier_name, a.verification_date
        FROM achievements a
        JOIN students s ON a.student_id = s.id
        JOIN departments d ON s.department_id = d.id
        JOIN achievement_categories c ON a.category_id = c.id
        LEFT JOIN faculty f ON a.faculty_id = f.id
        ORDER BY a.created_at DESC
    """
    records = execute_query(query)

    output = io.StringIO()
    writer = csv.writer(output)
    
    # Headers
    writer.writerow([
        "Achievement ID", "Title", "Category", "Student Name", "Roll Number", 
        "Department", "Achievement Date", "Status", "Points Awarded", 
        "Verifier", "Verification Date"
    ])
    
    for r in records:
        writer.writerow([
            r['id'], r['title'], r['category'], r['student_name'], r['roll_number'],
            r['department'], str(r['date_of_achievement']), r['status'], r['reward_points_awarded'],
            r['verifier_name'] or "N/A", str(r['verification_date']) if r['verification_date'] else "N/A"
        ])
        
    output.seek(0)
    return Response(
        output.getvalue(),
        mimetype="text/csv",
        headers={"Content-disposition": "attachment; filename=achievements_export.csv"}
    )
