from flask import Blueprint, request, jsonify
from utils.db import execute_query, execute_one, execute_update
from utils.decorators import admin_required
from utils.validators import validate_required_fields
import json
import os

settings_bp = Blueprint('settings', __name__)

SETTINGS_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'settings.json')

def load_system_settings():
    if not os.path.exists(SETTINGS_FILE):
        default_settings = {
            "modules": {
                "student_self_registration": True,
                "certificate_uploads": True,
                "faculty_approvals": True
            },
            "academic_years": ["2022-2026", "2023-2027", "2024-2028"]
        }
        with open(SETTINGS_FILE, 'w') as f:
            json.dump(default_settings, f, indent=4)
        return default_settings
        
    with open(SETTINGS_FILE, 'r') as f:
        return json.load(f)

def save_system_settings(settings):
    with open(SETTINGS_FILE, 'w') as f:
        json.dump(settings, f, indent=4)

# --- CATEGORIES ---

@settings_bp.route('/categories', methods=['GET'])
@admin_required()
def get_categories():
    """Gets all achievement categories."""
    categories = execute_query("SELECT * FROM achievement_categories ORDER BY name ASC")
    return jsonify({"categories": categories}), 200

@settings_bp.route('/categories', methods=['POST'])
@admin_required()
def add_category():
    """Adds a new achievement category."""
    data = request.get_json()
    is_valid, msg = validate_required_fields(data, ['name', 'default_points'])
    if not is_valid:
        return jsonify({"error": msg}), 400

    name = data['name'].strip()
    default_points = int(data['default_points'])
    description = data.get('description', '').strip()

    if execute_one("SELECT id FROM achievement_categories WHERE name = %s", (name,)):
        return jsonify({"error": "Achievement category name already exists."}), 400

    try:
        cat_id = execute_update(
            "INSERT INTO achievement_categories (name, default_points, description) VALUES (%s, %s, %s)",
            (name, default_points, description),
            return_id=True
        )
        return jsonify({"message": "Category added successfully.", "category_id": cat_id}), 201
    except Exception as e:
        return jsonify({"error": "Failed to create category.", "details": str(e)}), 500

@settings_bp.route('/categories/<int:id>', methods=['PUT'])
@admin_required()
def edit_category(id):
    """Edits achievement category details or toggles is_active status."""
    data = request.get_json()
    cat = execute_one("SELECT id FROM achievement_categories WHERE id = %s", (id,))
    if not cat:
        return jsonify({"error": "Category not found."}), 404

    name = data.get('name', '').strip()
    default_points = data.get('default_points')
    description = data.get('description')
    is_active = data.get('is_active')

    # Build updates dynamically
    updates = []
    params = []

    if name:
        dup = execute_one("SELECT id FROM achievement_categories WHERE name = %s AND id != %s", (name, id))
        if dup:
            return jsonify({"error": "Category name already exists."}), 400
        updates.append("name = %s")
        params.append(name)

    if default_points is not None:
        updates.append("default_points = %s")
        params.append(int(default_points))

    if description is not None:
        updates.append("description = %s")
        params.append(description.strip())

    if is_active is not None:
        updates.append("is_active = %s")
        params.append(1 if is_active else 0)

    if not updates:
        return jsonify({"error": "No fields to update."}), 400

    params.append(id)
    query = f"UPDATE achievement_categories SET {', '.join(updates)} WHERE id = %s"

    try:
        execute_update(query, params)
        return jsonify({"message": "Category updated successfully."}), 200
    except Exception as e:
        return jsonify({"error": "Failed to update category.", "details": str(e)}), 500

# --- DEPARTMENTS ---

@settings_bp.route('/departments', methods=['GET'])
@admin_required()
def get_departments():
    """Gets all departments."""
    depts = execute_query("SELECT * FROM departments ORDER BY code ASC")
    return jsonify({"departments": depts}), 200

@settings_bp.route('/departments', methods=['POST'])
@admin_required()
def add_department():
    """Adds a new department."""
    data = request.get_json()
    is_valid, msg = validate_required_fields(data, ['name', 'code'])
    if not is_valid:
        return jsonify({"error": msg}), 400

    name = data['name'].strip()
    code = data['code'].strip().upper()

    if execute_one("SELECT id FROM departments WHERE code = %s", (code,)):
        return jsonify({"error": "Department code already exists."}), 400

    try:
        dept_id = execute_update(
            "INSERT INTO departments (name, code) VALUES (%s, %s)",
            (name, code),
            return_id=True
        )
        return jsonify({"message": "Department added successfully.", "department_id": dept_id}), 201
    except Exception as e:
        return jsonify({"error": "Failed to create department.", "details": str(e)}), 500

@settings_bp.route('/departments/<int:id>', methods=['PUT'])
@admin_required()
def edit_department(id):
    """Edits department details."""
    data = request.get_json()
    dept = execute_one("SELECT id FROM departments WHERE id = %s", (id,))
    if not dept:
        return jsonify({"error": "Department not found."}), 404

    name = data.get('name', '').strip()
    code = data.get('code', '').strip().upper()

    updates = []
    params = []

    if name:
        updates.append("name = %s")
        params.append(name)
        
    if code:
        dup = execute_one("SELECT id FROM departments WHERE code = %s AND id != %s", (code, id))
        if dup:
            return jsonify({"error": "Department code already exists."}), 400
        updates.append("code = %s")
        params.append(code)

    if not updates:
        return jsonify({"error": "No fields to update."}), 400

    params.append(id)
    query = f"UPDATE departments SET {', '.join(updates)} WHERE id = %s"

    try:
        execute_update(query, params)
        return jsonify({"message": "Department updated successfully."}), 200
    except Exception as e:
        return jsonify({"error": "Failed to update department.", "details": str(e)}), 500

@settings_bp.route('/departments/<int:id>', methods=['DELETE'])
@admin_required()
def delete_department(id):
    """Deletes a department if no students or faculty belong to it."""
    # Check references
    if execute_one("SELECT id FROM students WHERE department_id = %s", (id,)):
        return jsonify({"error": "Cannot delete department: students are assigned to it."}), 400
    if execute_one("SELECT id FROM faculty WHERE department_id = %s", (id,)):
        return jsonify({"error": "Cannot delete department: faculty members are assigned to it."}), 400

    try:
        execute_update("DELETE FROM departments WHERE id = %s", (id,))
        return jsonify({"message": "Department deleted successfully."}), 200
    except Exception as e:
        return jsonify({"error": "Failed to delete department.", "details": str(e)}), 500

# --- PORTAL TOGGLES / SYSTEM CONFIGURATION ---

@settings_bp.route('/portal-config', methods=['GET'])
@admin_required()
def get_portal_config():
    """Gets global system configurations (academic years list, toggled modules)."""
    return jsonify(load_system_settings()), 200

@settings_bp.route('/portal-config/toggle-module', methods=['PATCH'])
@admin_required()
def toggle_portal_module():
    """Enables or disables system modules."""
    data = request.get_json()
    if not data or 'module_name' not in data or 'enabled' not in data:
        return jsonify({"error": "Missing 'module_name' or 'enabled' parameter."}), 400

    module_name = data['module_name']
    enabled = bool(data['enabled'])

    settings = load_system_settings()
    if module_name not in settings['modules']:
        return jsonify({"error": f"Module '{module_name}' does not exist."}), 400

    settings['modules'][module_name] = enabled
    save_system_settings(settings)

    return jsonify({"message": f"Module '{module_name}' updated successfully.", "settings": settings}), 200

@settings_bp.route('/portal-config/academic-years', methods=['POST'])
@admin_required()
def add_academic_year():
    """Adds a new academic year format to the system."""
    data = request.get_json()
    if not data or 'academic_year' not in data:
        return jsonify({"error": "Missing 'academic_year'."}), 400

    academic_year = data['academic_year'].strip()
    settings = load_system_settings()

    if academic_year in settings['academic_years']:
        return jsonify({"error": "Academic year already exists."}), 400

    settings['academic_years'].append(academic_year)
    settings['academic_years'].sort()
    save_system_settings(settings)

    return jsonify({"message": "Academic year added successfully.", "settings": settings}), 200
