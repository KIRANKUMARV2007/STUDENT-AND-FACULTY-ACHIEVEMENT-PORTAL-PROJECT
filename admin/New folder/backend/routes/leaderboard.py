from flask import Blueprint, request, jsonify
from utils.db import execute_query, execute_one
from utils.decorators import admin_required

leaderboard_bp = Blueprint('leaderboard', __name__)

@leaderboard_bp.route('/college', methods=['GET'])
@admin_required()
def get_college_leaderboard():
    """Gets the top students across the entire college based on reward points."""
    limit = request.args.get('limit', default=50, type=int)
    
    query = """
        SELECT 
            s.id, s.student_id, s.name, s.roll_number, s.academic_year, s.reward_points,
            d.name AS department_name, d.code AS department_code
        FROM students s
        JOIN departments d ON s.department_id = d.id
        ORDER BY s.reward_points DESC, s.name ASC
        LIMIT %s
    """
    leaderboard = execute_query(query, (limit,))
    return jsonify({"leaderboard": leaderboard}), 200

@leaderboard_bp.route('/department/<int:dept_id>', methods=['GET'])
@admin_required()
def get_dept_leaderboard(dept_id):
    """Gets top students within a specific department based on reward points."""
    # Check if department exists
    dept = execute_one("SELECT id, name FROM departments WHERE id = %s", (dept_id,))
    if not dept:
        return jsonify({"error": "Department not found."}), 404

    limit = request.args.get('limit', default=50, type=int)

    query = """
        SELECT 
            s.id, s.student_id, s.name, s.roll_number, s.academic_year, s.reward_points,
            d.name AS department_name, d.code AS department_code
        FROM students s
        JOIN departments d ON s.department_id = d.id
        WHERE s.department_id = %s
        ORDER BY s.reward_points DESC, s.name ASC
        LIMIT %s
    """
    leaderboard = execute_query(query, (dept_id, limit))
    return jsonify({
        "department": dept,
        "leaderboard": leaderboard
    }), 200
