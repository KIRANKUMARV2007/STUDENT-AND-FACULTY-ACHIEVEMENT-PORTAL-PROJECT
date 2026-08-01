from flask import Blueprint, request, jsonify
from utils.db import execute_query, execute_update, execute_one
from utils.decorators import admin_required
from utils.validators import validate_required_fields
from flask_jwt_extended import get_jwt_identity

notifications_bp = Blueprint('notifications', __name__)

@notifications_bp.route('', methods=['GET'])
@admin_required()
def get_notifications():
    """Gets list of sent notifications and announcements."""
    query = """
        SELECT n.id, n.title, n.message, n.target_role, n.created_at,
               a.name AS sender_name
        FROM notifications n
        JOIN admins a ON n.created_by_admin_id = a.id
        ORDER BY n.created_at DESC
    """
    notifications = execute_query(query)
    for n in notifications:
        n['created_at'] = str(n['created_at'])
    return jsonify({"notifications": notifications}), 200

@notifications_bp.route('', methods=['POST'])
@admin_required()
def send_announcement():
    """Creates/broadcasts an announcement to selected target roles (All, Student, Faculty)."""
    data = request.get_json()
    is_valid, msg = validate_required_fields(data, ['title', 'message', 'target_role'])
    if not is_valid:
        return jsonify({"error": msg}), 400

    title = data['title'].strip()
    message = data['message'].strip()
    target_role = data['target_role'].strip()

    if target_role not in ['All', 'Student', 'Faculty']:
        return jsonify({"error": "Invalid target role. Must be 'All', 'Student', or 'Faculty'."}), 400

    identity = get_jwt_identity()
    admin_id = identity['id']

    try:
        insert_query = """
            INSERT INTO notifications (title, message, target_role, created_by_admin_id)
            VALUES (%s, %s, %s, %s)
        """
        notification_id = execute_update(insert_query, (title, message, target_role, admin_id), return_id=True)
        return jsonify({
            "message": "Announcement broadcasted successfully.",
            "notification_id": notification_id
        }), 201
    except Exception as e:
        return jsonify({"error": "Failed to post announcement.", "details": str(e)}), 500
