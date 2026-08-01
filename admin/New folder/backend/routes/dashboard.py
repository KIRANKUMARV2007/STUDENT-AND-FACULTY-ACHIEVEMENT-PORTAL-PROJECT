from flask import Blueprint, jsonify
from utils.db import execute_query, execute_one
from utils.decorators import admin_required

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/stats', methods=['GET'])
@admin_required()
def get_stats():
    """Aggregates and returns overall system statistics for the dashboard."""
    try:
        # Total Students
        students_count = execute_one("SELECT COUNT(*) AS count FROM students")['count']
        
        # Total Faculty
        faculty_count = execute_one("SELECT COUNT(*) AS count FROM faculty")['count']
        
        # Total Achievements
        ach_count = execute_one("SELECT COUNT(*) AS count FROM achievements")['count']
        
        # Pending Achievements
        pending_count = execute_one("SELECT COUNT(*) AS count FROM achievements WHERE status = 'Pending'")['count']
        
        # Approved Achievements
        approved_count = execute_one("SELECT COUNT(*) AS count FROM achievements WHERE status = 'Approved'")['count']
        
        # Rejected Achievements
        rejected_count = execute_one("SELECT COUNT(*) AS count FROM achievements WHERE status = 'Rejected'")['count']
        
        # Total Reward Points Awarded
        points_issued = execute_one("SELECT SUM(reward_points_awarded) AS total FROM achievements WHERE status = 'Approved'")['total'] or 0

        # Department Distribution
        dept_stats = execute_query("""
            SELECT 
                d.id AS department_id,
                d.name AS department_name, 
                d.code AS department_code, 
                COUNT(DISTINCT s.id) AS students_count,
                COUNT(a.id) AS achievements_count,
                COALESCE(SUM(CASE WHEN a.status = 'Approved' THEN a.reward_points_awarded ELSE 0 END), 0) AS total_points
            FROM departments d
            LEFT JOIN students s ON s.department_id = d.id
            LEFT JOIN achievements a ON a.student_id = s.id
            GROUP BY d.id
        """)

        # Monthly Submissions Trend (Last 6 Months)
        monthly_trend = execute_query("""
            SELECT 
                DATE_FORMAT(created_at, '%%b') AS month_name,
                COUNT(*) AS count
            FROM achievements
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
            GROUP BY YEAR(created_at), MONTH(created_at), DATE_FORMAT(created_at, '%%b')
            ORDER BY YEAR(created_at) ASC, MONTH(created_at) ASC
        """)

        # Recent activities (recent 10 achievements submissions/verifications)
        recent_activities = execute_query("""
            SELECT 
                a.id AS achievement_id,
                a.title,
                a.status,
                DATE_FORMAT(a.created_at, '%%Y-%%m-%%d %%H:%%i:%%s') AS created_at,
                s.name AS student_name,
                c.name AS category_name
            FROM achievements a
            JOIN students s ON a.student_id = s.id
            JOIN achievement_categories c ON a.category_id = c.id
            ORDER BY a.created_at DESC
            LIMIT 10
        """)

        return jsonify({
            "stats": {
                "total_students": students_count,
                "total_faculty": faculty_count,
                "total_achievements": ach_count,
                "pending_approvals": pending_count,
                "approved_achievements": approved_count,
                "rejected_achievements": rejected_count,
                "total_reward_points": int(points_issued),
                "departments_count": len(dept_stats)
            },
            "department_statistics": dept_stats,
            "monthly_submissions_trend": monthly_trend,
            "recent_activities": recent_activities
        }), 200
        
    except Exception as e:
        return jsonify({"error": "Failed to fetch dashboard metrics.", "details": str(e)}), 500
