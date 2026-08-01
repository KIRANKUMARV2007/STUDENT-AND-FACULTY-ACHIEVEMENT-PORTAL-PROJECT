from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import bcrypt
from utils.db import execute_one
from utils.validators import validate_required_fields

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    """Authenticates admin and returns a JWT access token."""
    data = request.get_json()
    
    is_valid, msg = validate_required_fields(data, ['admin_id', 'password'])
    if not is_valid:
        return jsonify({"error": msg}), 400
        
    admin_id = data.get('admin_id').strip()
    password = data.get('password')
    
    # Query admin record from DB (allow login with admin_id or email)
    if '@' in admin_id:
        query = "SELECT id, admin_id, name, email, password_hash FROM admins WHERE email = %s"
    else:
        query = "SELECT id, admin_id, name, email, password_hash FROM admins WHERE admin_id = %s"
    admin = execute_one(query, (admin_id,))
    
    if not admin:
        return jsonify({
            "success": False,
            "message": "Invalid email or password"
        }), 401
        
    # Check password hash
    if not bcrypt.checkpw(password.encode('utf-8'), admin['password_hash'].encode('utf-8')):
        return jsonify({
            "success": False,
            "message": "Invalid email or password"
        }), 401
        
    # Generate JWT
    identity = {
        "id": admin['id'],
        "admin_id": admin['admin_id'],
        "role": "admin",
        "email": admin['email'],
        "name": admin['name']
    }
    access_token = create_access_token(identity=identity)
    
    return jsonify({
        "success": True,
        "message": "Login successful",
        "role": "admin",
        "access_token": access_token,
        "admin": {
            "id": admin['id'],
            "admin_id": admin['admin_id'],
            "name": admin['name'],
            "email": admin['email']
        }
    }), 200

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Handles logout. Tokens are stateless but we return a success response."""
    return jsonify({"message": "Successfully logged out. Please remove token from local storage."}), 200

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    """Gets currently logged-in administrator profile details."""
    identity = get_jwt_identity()
    if identity.get('role') != 'admin':
        return jsonify({"error": "Admin privileges required."}), 403
        
    query = "SELECT id, admin_id, name, email, created_at FROM admins WHERE id = %s"
    admin = execute_one(query, (identity['id'],))
    
    if not admin:
        return jsonify({"error": "Admin account not found."}), 404
        
    return jsonify({
        "admin": {
            "id": admin['id'],
            "admin_id": admin['admin_id'],
            "name": admin['name'],
            "email": admin['email'],
            "created_at": str(admin['created_at'])
        }
    }), 200
