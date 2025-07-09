import os
import logging
from logging.handlers import RotatingFileHandler

def setup_logger():
    """Configure and return a logger instance"""
    # Create logs directory if it doesn't exist
    log_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'logs')
    os.makedirs(log_dir, exist_ok=True)
    
    # Get environment
    env = os.environ.get('FLASK_ENV', 'development')
    
    # Set log level based on environment
    log_level = logging.DEBUG if env == 'development' else logging.INFO
    
    # Create logger
    logger = logging.getLogger('afripulse')
    logger.setLevel(log_level)
    
    # Clear existing handlers if any
    if logger.handlers:
        logger.handlers.clear()
    
    # Create formatter
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Create console handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(log_level)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)
    
    # Create file handler
    file_handler = RotatingFileHandler(
        os.path.join(log_dir, f'app_{env}.log'),
        maxBytes=10485760,  # 10MB
        backupCount=10
    )
    file_handler.setLevel(log_level)
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)
    
    return logger
