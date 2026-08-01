from flask import Blueprint, request, jsonify
from utils.db import execute_query, execute_one, execute_update
from utils.decorators import admin_required
from flask_jwt_extended import get_jwt_identity
from utils.validators import validate_required_fields

rewards_bp = Blueprint('rewards', __name__)

@rewards_bp.route('/rules', methods=['GET'])
@admin_required()
def get_reward_rules():
    """Gets list of achievement categories and their points configuration."""
    query = """
        SELECT id, name, default_points, description, is_active 
        FROM achievement_categories
        ORDER BY default_points DESC
    """
    rules = execute_query(query)
    return jsonify({"rules": rules}), 200

@rewards_bp.route('/rules/<int:category_id>', methods=['PUT'])
@admin_required()
def update_reward_rule(category_id):
    """Updates points for an achievement category and adds a history log entry."""
    data = request.get_json()
    is_valid, msg = validate_required_fields(data, ['points'])
    if not is_valid:
        return jsonify({"error": msg}), 400

    new_points = int(data['points'])
    if new_points < 0:
        return jsonify({"error": "Reward points cannot be negative."}), 400

    # Verify category exists
    cat = execute_one("SELECT id, name FROM achievement_categories WHERE id = %s", (category_id,))
    if not cat:
        return jsonify({"error": "Achievement category not found."}), 404

    identity = get_jwt_identity()
    admin_id = identity['id']

    try:
        # Update category default points
        execute_update(
            "UPDATE achievement_categories SET default_points = %s WHERE id = %s",
            (new_points, category_id)
        )
        
        # Log this update to history
        execute_update(
            "INSERT INTO reward_point_rules (category_id, points, updated_by_admin_id) VALUES (%s, %s, %s)",
            (category_id, new_points, admin_id)
        )

        return jsonify({
            "message": f"Reward point rule for '{cat['name']}' updated to {new_points} successfully."
        }), 200

    except Exception as e:
        return jsonify({"error": "Failed to update reward rule.", "details": str(e)}), 500

@rewards_bp.route('/history', methods=['GET'])
@admin_required()
def get_rules_log():
    """Gets the administrative log history of reward points configuration adjustments."""
    query = """
        SELECT r.id, r.points, r.updated_at,
               c.name AS category_name,
               a.name AS admin_name
        FROM reward_point_rules r
        JOIN achievement_categories c ON r.category_id = c.id
        JOIN admins a ON r.updated_by_admin_id = a.id
        ORDER BY r.updated_at DESC
    """
    logs = execute_query(query)
    for log in logs:
        log['updated_at'] = str(log['updated_at'])
    return jsonify({"history": logs}), 200
