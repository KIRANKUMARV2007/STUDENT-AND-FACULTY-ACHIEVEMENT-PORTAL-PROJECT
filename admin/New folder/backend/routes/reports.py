from flask import Blueprint, jsonify
from utils.db import execute_query
from utils.decorators import admin_required

reports_bp = Blueprint('reports', __name__)

@reports_bp.route('/departments', methods=['GET'])
@admin_required()
def get_dept_reports():
    """Generates department-wise achievement totals, approved ratio, and points summary."""
    query = """
        SELECT 
            d.name AS department_name,
            d.code AS department_code,
            COUNT(a.id) AS total_submissions,
            SUM(CASE WHEN a.status = 'Approved' THEN 1 ELSE 0 END) AS approved_count,
            SUM(CASE WHEN a.status = 'Rejected' THEN 1 ELSE 0 END) AS rejected_count,
            SUM(CASE WHEN a.status = 'Pending' THEN 1 ELSE 0 END) AS pending_count,
            COALESCE(SUM(a.reward_points_awarded), 0) AS total_points_issued
        FROM departments d
        LEFT JOIN students s ON s.department_id = d.id
        LEFT JOIN achievements a ON a.student_id = s.id
        GROUP BY d.id
        ORDER BY total_points_issued DESC
    """
    data = execute_query(query)
    return jsonify({"department_reports": data}), 200

@reports_bp.route('/monthly', methods=['GET'])
@admin_required()
def get_monthly_reports():
    """Generates monthly stats of achievement submissions and approval rates."""
    query = """
        SELECT 
            DATE_FORMAT(created_at, '%Y-%m') AS month,
            COUNT(*) AS total_submissions,
            SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) AS approved_count,
            SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) AS rejected_count
        FROM achievements
        GROUP BY DATE_FORMAT(created_at, '%Y-%m')
        ORDER BY month DESC
    """
    data = execute_query(query)
    return jsonify({"monthly_reports": data}), 200

@reports_bp.route('/faculty', methods=['GET'])
@admin_required()
def get_faculty_reports():
    """Tracks verifications count processed by each faculty verifier."""
    query = """
        SELECT 
            f.faculty_id,
            f.name AS faculty_name,
            d.code AS department_code,
            f.designation,
            COUNT(a.id) AS verified_count,
            SUM(CASE WHEN a.status = 'Approved' THEN 1 ELSE 0 END) AS approved_count,
            SUM(CASE WHEN a.status = 'Rejected' THEN 1 ELSE 0 END) AS rejected_count
        FROM faculty f
        JOIN departments d ON f.department_id = d.id
        LEFT JOIN achievements a ON a.faculty_id = f.id
        GROUP BY f.id
        ORDER BY verified_count DESC
    """
    data = execute_query(query)
    return jsonify({"faculty_reports": data}), 200

@reports_bp.route('/students', methods=['GET'])
@admin_required()
def get_student_reports():
    """Compiles ranking of top students based on accumulated points."""
    query = """
        SELECT 
            s.student_id,
            s.name AS student_name,
            s.roll_number,
            d.code AS department_code,
            s.academic_year,
            s.reward_points,
            COUNT(a.id) AS total_achievements
        FROM students s
        JOIN departments d ON s.department_id = d.id
        LEFT JOIN achievements a ON a.student_id = s.id AND a.status = 'Approved'
        GROUP BY s.id
        ORDER BY s.reward_points DESC, total_achievements DESC
    """
    data = execute_query(query)
    return jsonify({"student_performance_reports": data}), 200
