from flask import Blueprint, request, jsonify, send_from_directory
from utils.decorators import admin_required, role_required
from utils.db import execute_update, execute_one
from config import Config
import os
from werkzeug.utils import secure_filename
import uuid

files_bp = Blueprint('files', __name__)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in Config.ALLOWED_EXTENSIONS

@files_bp.route('/certificates/<filename>', methods=['GET'])
@role_required(['admin', 'faculty', 'student'])
def download_file(filename):
    """Serves the certificate file for viewing/downloading."""
    directory = Config.UPLOAD_FOLDER
    # Safe path traversal protection: secure_filename cleans up parent path components
    safe_name = secure_filename(filename)
    
    if not os.path.exists(os.path.join(directory, safe_name)):
        return jsonify({"error": "Certificate file not found."}), 404
        
    return send_from_directory(
        directory=directory, 
        path=safe_name,
        as_attachment=request.args.get('download', 'false').lower() == 'true'
    )

@files_bp.route('/certificates', methods=['POST'])
@role_required(['admin', 'faculty', 'student'])
def upload_file():
    """Uploads a certificate file and returns its unique saved name."""
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request."}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file."}), 400
        
    if file and allowed_file(file.filename):
        # Create UPLOAD_FOLDER if not exists
        os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
        
        orig_name = secure_filename(file.filename)
        extension = orig_name.rsplit('.', 1)[1].lower()
        # Generate unique filename to avoid collisions
        unique_name = f"{uuid.uuid4().hex}.{extension}"
        
        file_path = os.path.join(Config.UPLOAD_FOLDER, unique_name)
        file.save(file_path)
        
        return jsonify({
            "message": "File uploaded successfully.",
            "filename": unique_name,
            "url": f"/api/files/certificates/{unique_name}"
        }), 201
        
    return jsonify({"error": "Allowed file types: PDF, PNG, JPG, JPEG."}), 400

@files_bp.route('/certificates/<filename>', methods=['DELETE'])
@admin_required()
def delete_file(filename):
    """Deletes certificate file from disk and clears its references in the database."""
    safe_name = secure_filename(filename)
    file_path = os.path.join(Config.UPLOAD_FOLDER, safe_name)
    
    # Remove file from disk
    file_existed = False
    if os.path.exists(file_path):
        os.remove(file_path)
        file_existed = True
        
    # Clear references in database
    relative_path = f"/api/files/certificates/{safe_name}"
    affected = execute_update(
        "UPDATE achievements SET certificate_path = NULL WHERE certificate_path = %s OR certificate_path LIKE %s",
        (relative_path, f"%{safe_name}")
    )
    
    if not file_existed and affected == 0:
        return jsonify({"error": "File and database reference not found."}), 404
        
    return jsonify({
        "message": "File and its database references deleted successfully.",
        "file_deleted": file_existed,
        "db_records_updated": affected
    }), 200
