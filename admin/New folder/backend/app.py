from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
import os

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for frontend integration
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # Initialize JWT Manager
    jwt = JWTManager(app)

    # Ensure upload folder exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # Register Blueprints
    from routes import (
        auth_bp, dashboard_bp, users_bp, achievements_bp,
        rewards_bp, reports_bp, notifications_bp, leaderboard_bp,
        settings_bp, files_bp
    )
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(achievements_bp, url_prefix='/api/achievements')
    app.register_blueprint(rewards_bp, url_prefix='/api/rewards')
    app.register_blueprint(reports_bp, url_prefix='/api/reports')
    app.register_blueprint(notifications_bp, url_prefix='/api/notifications')
    app.register_blueprint(leaderboard_bp, url_prefix='/api/leaderboard')
    app.register_blueprint(settings_bp, url_prefix='/api/settings')
    app.register_blueprint(files_bp, url_prefix='/api/files')

    # Default root status check
    @app.route('/')
    def status():
        return jsonify({
            "status": "online",
            "message": "Faculty & Student Achievement Portal Admin API is running.",
            "version": "1.0.0"
        }), 200

    # Global Error Handlers
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({"error": "Bad Request", "message": str(error)}), 400

    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify({"error": "Unauthorized", "message": "Missing or invalid token credentials."}), 401

    @app.errorhandler(403)
    def forbidden(error):
        return jsonify({"error": "Forbidden", "message": "You do not have access permission."}), 403

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Resource Not Found", "message": "The requested API endpoint was not found."}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({"error": "Internal Server Error", "message": "An unexpected error occurred.", "details": str(error)}), 500

    # JWT Error handlers customization
    @jwt.unauthorized_loader
    def custom_unauthorized_response(callback):
        return jsonify({"error": "Unauthorized", "message": "Missing Authorization Header or Token."}), 401

    @jwt.expired_token_loader
    def custom_expired_token_response(jwt_header, jwt_payload):
        return jsonify({"error": "Token Expired", "message": "Your session has expired. Please login again."}), 401

    @jwt.invalid_token_loader
    def custom_invalid_token_response(callback):
        return jsonify({"error": "Invalid Token", "message": "The access token provided is invalid or malformed."}), 401

    return app

if __name__ == '__main__':
    app = create_app()
    # Read port from config, fallback to 5000
    app.run(host='0.0.0.0', port=5000, debug=True)
