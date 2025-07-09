import os
import uuid
from werkzeug.utils import secure_filename
from PIL import Image
from flask import current_app

from utils.logger import setup_logger

# Setup logger
logger = setup_logger()

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

# Max file size (5MB)
MAX_FILE_SIZE = 5 * 1024 * 1024

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def validate_image(file):
    """Validate image file"""
    # Check if file exists
    if not file:
        return False, "No file provided"
    
    # Check file size
    if len(file.read()) > MAX_FILE_SIZE:
        file.seek(0)  # Reset file pointer
        return False, "File size exceeds maximum limit (5MB)"
    
    # Reset file pointer
    file.seek(0)
    
    # Check file extension
    if not allowed_file(file.filename):
        return False, "File type not allowed. Allowed types: png, jpg, jpeg, gif, webp"
    
    # Try to open the image to verify it's valid
    try:
        img = Image.open(file)
        img.verify()
        file.seek(0)  # Reset file pointer
        return True, "File is valid"
    except Exception as e:
        logger.error(f"Invalid image file: {str(e)}")
        return False, "Invalid image file"

def save_image(file, folder='uploads'):
    """Save image file to disk and return the path"""
    try:
        # Validate file
        is_valid, message = validate_image(file)
        if not is_valid:
            return None, message
        
        # Create upload directory if it doesn't exist
        upload_dir = os.path.join(current_app.static_folder, folder)
        os.makedirs(upload_dir, exist_ok=True)
        
        # Generate unique filename
        filename = secure_filename(file.filename)
        name, ext = os.path.splitext(filename)
        unique_filename = f"{name}_{uuid.uuid4().hex}{ext}"
        
        # Save file
        file_path = os.path.join(upload_dir, unique_filename)
        file.save(file_path)
        
        # Return relative path for database storage
        relative_path = os.path.join(folder, unique_filename)
        return relative_path, "File uploaded successfully"
        
    except Exception as e:
        logger.error(f"Error saving file: {str(e)}")
        return None, f"Error saving file: {str(e)}"

def delete_image(file_path):
    """Delete image file from disk"""
    try:
        # Get absolute path
        absolute_path = os.path.join(current_app.static_folder, file_path)
        
        # Check if file exists
        if os.path.exists(absolute_path):
            os.remove(absolute_path)
            return True, "File deleted successfully"
        else:
            return False, "File not found"
            
    except Exception as e:
        logger.error(f"Error deleting file: {str(e)}")
        return False, f"Error deleting file: {str(e)}"
