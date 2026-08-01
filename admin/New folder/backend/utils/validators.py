import re

def validate_email(email: str) -> bool:
    """Validates that a string is a correctly formatted email address."""
    if not email:
        return False
    # Standard email validation regex
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return bool(re.match(pattern, email))

def validate_password_strength(password: str) -> tuple[bool, str]:
    """Validates password strength (at least 6 characters, contains letters and numbers)."""
    if not password or len(password) < 6:
        return False, "Password must be at least 6 characters long."
    if not any(char.isdigit() for char in password):
        return False, "Password must contain at least one digit."
    if not any(char.isalpha() for char in password):
        return False, "Password must contain at least one letter."
    return True, ""

def validate_required_fields(data: dict, required_fields: list) -> tuple[bool, str]:
    """Checks if all required fields are present in the dictionary and not empty/whitespace-only."""
    if not data:
        return False, "Request body is empty or invalid JSON."
        
    for field in required_fields:
        if field not in data:
            return False, f"Missing required field: '{field}'"
        val = data[field]
        if val is None or (isinstance(val, str) and not val.strip()):
            return False, f"Field '{field}' cannot be empty."
            
    return True, ""
