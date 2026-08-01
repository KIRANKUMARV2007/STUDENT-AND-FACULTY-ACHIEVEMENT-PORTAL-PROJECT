from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity

def role_required(allowed_roles):
    """Decorator to enforce JWT authentication and check for allowed roles.
    
    allowed_roles can be a string or a list of strings (e.g., 'admin', ['admin', 'faculty']).
    """
    if isinstance(allowed_roles, str):
        allowed_roles = [allowed_roles]
        
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            try:
                verify_jwt_in_request()
                identity = get_jwt_identity()
                
                # Check identity structure and verify role
                if not identity or 'role' not in identity:
                    return jsonify({"error": "Unauthorized. Invalid token structure."}), 403
                    
                user_role = identity['role']
                if user_role not in allowed_roles:
                    return jsonify({
                        "error": "Forbidden. You do not have permissions to access this resource."
                    }), 403
                    
            except Exception as e:
                return jsonify({
                    "error": "Authentication required. Missing, expired, or invalid token."
                }), 401
                
            return fn(*args, **kwargs)
        return wrapper
    return decorator

def admin_required():
    """Short-hand decorator for admin-only endpoints."""
    return role_required('admin')
