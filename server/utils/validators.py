import re
from email_validator import validate_email as validate_email_lib, EmailNotValidError

def validate_email(email):
    """Validate email format"""
    try:
        validate_email_lib(email)
        return True
    except EmailNotValidError:
        return False
        
def validate_password(password):
    """Validate password strength"""
    if not password or len(password) < 8:
        return False
    return True

def validate_registration(data):
    """Validate user registration data"""
    errors = {}
    
    # Email validation
    if not data.get('email'):
        errors['email'] = 'Email is required'
    else:
        try:
            validate_email(data['email'])
        except EmailNotValidError:
            errors['email'] = 'Invalid email format'
    
    # Password validation
    if not data.get('password'):
        errors['password'] = 'Password is required'
    elif len(data['password']) < 8:
        errors['password'] = 'Password must be at least 8 characters'
    
    # Role validation
    valid_roles = ['customer', 'seller', 'affiliate']
    if data.get('role') and data['role'] not in valid_roles:
        errors['role'] = f'Role must be one of: {", ".join(valid_roles)}'
    
    return errors

def validate_login(data):
    """Validate user login data"""
    errors = {}
    
    # Email validation
    if not data.get('email'):
        errors['email'] = 'Email is required'
    
    # Password validation
    if not data.get('password'):
        errors['password'] = 'Password is required'
    
    return errors

def validate_profile(data):
    """Validate user profile data"""
    errors = {}
    
    # Name validation
    if data.get('name') and len(data['name']) < 2:
        errors['name'] = 'Name must be at least 2 characters'
    
    # Phone validation
    if data.get('phone') and not re.match(r'^\+?[0-9]{10,15}$', data['phone']):
        errors['phone'] = 'Invalid phone number format'
    
    # Bio validation
    if data.get('bio') and len(data['bio']) > 500:
        errors['bio'] = 'Bio must be less than 500 characters'
    
    return errors

def validate_seller_profile(data):
    """Validate seller profile data"""
    errors = {}
    
    # Business name validation
    if not data.get('business_name'):
        errors['business_name'] = 'Business name is required'
    elif len(data['business_name']) < 2:
        errors['business_name'] = 'Business name must be at least 2 characters'
    
    # Business email validation
    if data.get('business_email'):
        try:
            validate_email(data['business_email'])
        except EmailNotValidError:
            errors['business_email'] = 'Invalid email format'
    
    # Business phone validation
    if data.get('business_phone') and not re.match(r'^\+?[0-9]{10,15}$', data['business_phone']):
        errors['business_phone'] = 'Invalid phone number format'
    
    return errors

def validate_product(data):
    """Validate product data"""
    errors = {}
    
    # Name validation
    if not data.get('name'):
        errors['name'] = 'Product name is required'
    elif len(data['name']) < 3:
        errors['name'] = 'Product name must be at least 3 characters'
    
    # Description validation
    if not data.get('description'):
        errors['description'] = 'Product description is required'
    elif len(data['description']) < 10:
        errors['description'] = 'Product description must be at least 10 characters'
    
    # Price validation
    if not data.get('price'):
        errors['price'] = 'Price is required'
    else:
        try:
            price = float(data['price'])
            if price <= 0:
                errors['price'] = 'Price must be greater than zero'
        except (ValueError, TypeError):
            errors['price'] = 'Price must be a valid number'
    
    # Stock validation
    if data.get('stock_quantity') is not None:
        try:
            stock = int(data['stock_quantity'])
            if stock < 0:
                errors['stock_quantity'] = 'Stock quantity cannot be negative'
        except (ValueError, TypeError):
            errors['stock_quantity'] = 'Stock quantity must be a valid number'
    
    # Category validation
    if not data.get('category'):
        errors['category'] = 'Category is required'
    
    return errors

def validate_order(data):
    """Validate order data"""
    errors = {}
    
    # Shipping address validation
    if not data.get('shipping_address'):
        errors['shipping_address'] = 'Shipping address is required'
    
    # Payment method validation
    valid_payment_methods = ['credit_card', 'paypal', 'bank_transfer', 'mobile_money']
    if not data.get('payment_method'):
        errors['payment_method'] = 'Payment method is required'
    elif data['payment_method'] not in valid_payment_methods:
        errors['payment_method'] = f'Payment method must be one of: {", ".join(valid_payment_methods)}'
    
    return errors
