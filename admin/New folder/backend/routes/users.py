from flask import Blueprint, request, jsonify
import bcrypt
from utils.db import execute_query, execute_one, execute_update
from utils.decorators import admin_required
from utils.validators import validate_email, validate_required_fields

users_bp = Blueprint('users', __name__)

# Helper to hash password
def get_hashed_password(plain_text_password):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(plain_text_password.encode('utf-8'), salt).decode('utf-8')

# --- STUDENTS CRUD ---

@users_bp.route('/students', methods=['GET'])
@admin_required()
def get_students():
    """Gets list of students with optional search query, department, and academic year filters."""
    search = request.args.get('search', '').strip()
    department_id = request.args.get('department_id')
    academic_year = request.args.get('academic_year')
    
    query = """
        SELECT s.id, s.student_id, s.name, s.email, s.roll_number, s.academic_year, s.reward_points, s.created_at,
               d.name AS department_name, d.code AS department_code
        FROM students s
        JOIN departments d ON s.department_id = d.id
        WHERE 1=1
    """
    params = []
    
    if search:
        query += " AND (s.name LIKE %s OR s.student_id LIKE %s OR s.roll_number LIKE %s OR s.email LIKE %s)"
        search_param = f"%{search}%"
        params.extend([search_param, search_param, search_param, search_param])
        
    if department_id:
        query += " AND s.department_id = %s"
        params.append(department_id)
        
    if academic_year:
        query += " AND s.academic_year = %s"
        params.append(academic_year)
        
    query += " ORDER BY s.name ASC"
    
    students = execute_query(query, params)
    for s in students:
        s['created_at'] = str(s['created_at'])
    return jsonify({"students": students}), 200

@users_bp.route('/students', methods=['POST'])
@admin_required()
def add_student():
    """Creates a new student user."""
    data = request.get_json()
    required = ['student_id', 'name', 'email', 'password', 'department_id', 'roll_number', 'academic_year']
    
    is_valid, msg = validate_required_fields(data, required)
    if not is_valid:
        return jsonify({"error": msg}), 400
        
    student_id = data['student_id'].strip()
    name = data['name'].strip()
    email = data['email'].strip()
    password = data['password']
    department_id = data['department_id']
    roll_number = data['roll_number'].strip()
    academic_year = data['academic_year'].strip()
    
    if not validate_email(email):
        return jsonify({"error": "Invalid email address format."}), 400
        
    # Check duplicates
    if execute_one("SELECT id FROM students WHERE student_id = %s", (student_id,)):
        return jsonify({"error": "Student ID already exists."}), 400
    if execute_one("SELECT id FROM students WHERE email = %s", (email,)):
        return jsonify({"error": "Email address already exists."}), 400
    if execute_one("SELECT id FROM students WHERE roll_number = %s", (roll_number,)):
        return jsonify({"error": "Roll number already exists."}), 400
    if not execute_one("SELECT id FROM departments WHERE id = %s", (department_id,)):
        return jsonify({"error": "Department not found."}), 400
        
    hashed_pw = get_hashed_password(password)
    
    try:
        insert_query = """
            INSERT INTO students (student_id, name, email, password_hash, department_id, roll_number, academic_year)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        student_db_id = execute_update(insert_query, (student_id, name, email, hashed_pw, department_id, roll_number, academic_year), return_id=True)
        return jsonify({
            "message": "Student created successfully.",
            "student_id": student_db_id
        }), 201
    except Exception as e:
        return jsonify({"error": "Failed to create student.", "details": str(e)}), 500

@users_bp.route('/students/<int:id>', methods=['PUT'])
@admin_required()
def edit_student(id):
    """Updates student details."""
    data = request.get_json()
    student = execute_one("SELECT id FROM students WHERE id = %s", (id,))
    if not student:
        return jsonify({"error": "Student not found."}), 404
        
    required = ['name', 'email', 'department_id', 'roll_number', 'academic_year']
    is_valid, msg = validate_required_fields(data, required)
    if not is_valid:
        return jsonify({"error": msg}), 400
        
    name = data['name'].strip()
    email = data['email'].strip()
    department_id = data['department_id']
    roll_number = data['roll_number'].strip()
    academic_year = data['academic_year'].strip()
    password = data.get('password') # Optional update password
    
    if not validate_email(email):
        return jsonify({"error": "Invalid email address format."}), 400
        
    # Check duplicates for others
    dup_email = execute_one("SELECT id FROM students WHERE email = %s AND id != %s", (email, id))
    if dup_email:
        return jsonify({"error": "Email is already taken by another student."}), 400
        
    dup_roll = execute_one("SELECT id FROM students WHERE roll_number = %s AND id != %s", (roll_number, id))
    if dup_roll:
        return jsonify({"error": "Roll number is already taken by another student."}), 400
        
    if not execute_one("SELECT id FROM departments WHERE id = %s", (department_id,)):
        return jsonify({"error": "Department not found."}), 400

    try:
        if password:
            hashed_pw = get_hashed_password(password)
            update_query = """
                UPDATE students 
                SET name = %s, email = %s, password_hash = %s, department_id = %s, roll_number = %s, academic_year = %s
                WHERE id = %s
            """
            execute_update(update_query, (name, email, hashed_pw, department_id, roll_number, academic_year, id))
        else:
            update_query = """
                UPDATE students 
                SET name = %s, email = %s, department_id = %s, roll_number = %s, academic_year = %s
                WHERE id = %s
            """
            execute_update(update_query, (name, email, department_id, roll_number, academic_year, id))
            
        return jsonify({"message": "Student details updated successfully."}), 200
    except Exception as e:
        return jsonify({"error": "Failed to update student.", "details": str(e)}), 500

@users_bp.route('/students/<int:id>', methods=['DELETE'])
@admin_required()
def delete_student(id):
    """Deletes student account."""
    student = execute_one("SELECT id FROM students WHERE id = %s", (id,))
    if not student:
        return jsonify({"error": "Student not found."}), 404
        
    try:
        execute_update("DELETE FROM students WHERE id = %s", (id,))
        return jsonify({"message": "Student account deleted successfully."}), 200
    except Exception as e:
        return jsonify({"error": "Failed to delete student.", "details": str(e)}), 500


# --- FACULTY CRUD ---

@users_bp.route('/faculty', methods=['GET'])
@admin_required()
def get_faculty():
    """Gets list of faculty with optional search and department filters."""
    search = request.args.get('search', '').strip()
    department_id = request.args.get('department_id')
    
    query = """
        SELECT f.id, f.faculty_id, f.name, f.email, f.designation, f.created_at,
               d.name AS department_name, d.code AS department_code
        FROM faculty f
        JOIN departments d ON f.department_id = d.id
        WHERE 1=1
    """
    params = []
    
    if search:
        query += " AND (f.name LIKE %s OR f.faculty_id LIKE %s OR f.email LIKE %s OR f.designation LIKE %s)"
        search_param = f"%{search}%"
        params.extend([search_param, search_param, search_param, search_param])
        
    if department_id:
        query += " AND f.department_id = %s"
        params.append(department_id)
        
    query += " ORDER BY f.name ASC"
    
    faculty_list = execute_query(query, params)
    for f in faculty_list:
        f['created_at'] = str(f['created_at'])
    return jsonify({"faculty": faculty_list}), 200

@users_bp.route('/faculty', methods=['POST'])
@admin_required()
def add_faculty():
    """Creates a new faculty user."""
    data = request.get_json()
    required = ['faculty_id', 'name', 'email', 'password', 'department_id', 'designation']
    
    is_valid, msg = validate_required_fields(data, required)
    if not is_valid:
        return jsonify({"error": msg}), 400
        
    faculty_id = data['faculty_id'].strip()
    name = data['name'].strip()
    email = data['email'].strip()
    password = data['password']
    department_id = data['department_id']
    designation = data['designation'].strip()
    
    if not validate_email(email):
        return jsonify({"error": "Invalid email address format."}), 400
        
    # Check duplicates
    if execute_one("SELECT id FROM faculty WHERE faculty_id = %s", (faculty_id,)):
        return jsonify({"error": "Faculty ID already exists."}), 400
    if execute_one("SELECT id FROM faculty WHERE email = %s", (email,)):
        return jsonify({"error": "Email address already exists."}), 400
    if not execute_one("SELECT id FROM departments WHERE id = %s", (department_id,)):
        return jsonify({"error": "Department not found."}), 400
        
    hashed_pw = get_hashed_password(password)
    
    try:
        insert_query = """
            INSERT INTO faculty (faculty_id, name, email, password_hash, department_id, designation)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        fac_db_id = execute_update(insert_query, (faculty_id, name, email, hashed_pw, department_id, designation), return_id=True)
        return jsonify({
            "message": "Faculty created successfully.",
            "faculty_id": fac_db_id
        }), 201
    except Exception as e:
        return jsonify({"error": "Failed to create faculty member.", "details": str(e)}), 500

@users_bp.route('/faculty/<int:id>', methods=['PUT'])
@admin_required()
def edit_faculty(id):
    """Updates faculty details."""
    data = request.get_json()
    faculty = execute_one("SELECT id FROM faculty WHERE id = %s", (id,))
    if not faculty:
        return jsonify({"error": "Faculty not found."}), 404
        
    required = ['name', 'email', 'department_id', 'designation']
    is_valid, msg = validate_required_fields(data, required)
    if not is_valid:
        return jsonify({"error": msg}), 400
        
    name = data['name'].strip()
    email = data['email'].strip()
    department_id = data['department_id']
    designation = data['designation'].strip()
    password = data.get('password') # Optional update password
    
    if not validate_email(email):
        return jsonify({"error": "Invalid email address format."}), 400
        
    # Check duplicates for others
    dup_email = execute_one("SELECT id FROM faculty WHERE email = %s AND id != %s", (email, id))
    if dup_email:
        return jsonify({"error": "Email is already taken by another faculty member."}), 400
        
    if not execute_one("SELECT id FROM departments WHERE id = %s", (department_id,)):
        return jsonify({"error": "Department not found."}), 400

    try:
        if password:
            hashed_pw = get_hashed_password(password)
            update_query = """
                UPDATE faculty 
                SET name = %s, email = %s, password_hash = %s, department_id = %s, designation = %s
                WHERE id = %s
            """
            execute_update(update_query, (name, email, hashed_pw, department_id, designation, id))
        else:
            update_query = """
                UPDATE faculty 
                SET name = %s, email = %s, department_id = %s, designation = %s
                WHERE id = %s
            """
            execute_update(update_query, (name, email, department_id, designation, id))
            
        return jsonify({"message": "Faculty details updated successfully."}), 200
    except Exception as e:
        return jsonify({"error": "Failed to update faculty member.", "details": str(e)}), 500

@users_bp.route('/faculty/<int:id>', methods=['DELETE'])
@admin_required()
def delete_faculty(id):
    """Deletes faculty account."""
    faculty = execute_one("SELECT id FROM faculty WHERE id = %s", (id,))
    if not faculty:
        return jsonify({"error": "Faculty not found."}), 404
        
    try:
        execute_update("DELETE FROM faculty WHERE id = %s", (id,))
        return jsonify({"message": "Faculty account deleted successfully."}), 200
    except Exception as e:
        return jsonify({"error": "Failed to delete faculty member.", "details": str(e)}), 500
