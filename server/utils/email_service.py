import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

from utils.logger import setup_logger

# Load environment variables
load_dotenv()

# Setup logger
logger = setup_logger()

# Email configuration
SMTP_HOST = os.environ.get('SMTP_HOST', 'smtp.gmail.com')
SMTP_PORT = int(os.environ.get('SMTP_PORT', 587))
SMTP_USER = os.environ.get('SMTP_USER', '')
SMTP_PASSWORD = os.environ.get('SMTP_PASSWORD', '')
FROM_EMAIL = os.environ.get('FROM_EMAIL', 'noreply@afripulse.com')
# TODO: Investigate why .env changes are not being picked up
# Temporarily hardcoding the URL to unblock email verification.
BASE_URL = os.environ.get('FRONTEND_URL', 'http://localhost:8080')
def send_email(to_email, subject, html_content):
    if not SMTP_USER or not SMTP_PASSWORD:
        print("ERROR: SMTP credentials (SMTP_USER, SMTP_PASSWORD) are not set in the environment. Email not sent.")
        return

    """Send an email using SMTP"""
    try:
        # Create message
        message = MIMEMultipart('alternative')
        message['Subject'] = subject
        message['From'] = FROM_EMAIL
        message['To'] = to_email
        
        # Attach HTML content
        html_part = MIMEText(html_content, 'html')
        message.attach(html_part)
        
        # Send email
        if SMTP_USER and SMTP_PASSWORD:
            with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
                server.starttls()
                server.login(SMTP_USER, SMTP_PASSWORD)
                server.sendmail(FROM_EMAIL, to_email, message.as_string())
            
            logger.info(f"Email sent to {to_email}")
            return True
        else:
            logger.warning("Email not sent: SMTP credentials not configured")
            logger.info(f"Would have sent email to {to_email} with subject: {subject}")
            logger.debug(f"Email content: {html_content}")
            return False
    
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        return False

def send_verification_email(to_email, token):
    """Send email verification link"""
    verification_url = f"{BASE_URL}/auth/verify-email?token={token}"
    subject = "Verify Your Email - AfriPulse"
    
    html_content = f"""
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background-color: #4CAF50; color: white; padding: 10px; text-align: center; }}
            .content {{ padding: 20px; }}
            .button {{ background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Welcome to AfriPulse!</h1>
            </div>
            <div class="content">
                <p>Thank you for registering with AfriPulse. Please verify your email address to complete your registration.</p>
                <p><a href="{verification_url}" class="button">Verify Email</a></p>
                <p>If the button above doesn't work, copy and paste the following URL into your browser:</p>
                <p>{verification_url}</p>
                <p>This link will expire in 24 hours.</p>
                <p>If you did not create an account, please ignore this email.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    return send_email(to_email, subject, html_content)

def send_password_reset_email(to_email, token):
    """Send password reset link"""
    reset_url = f"{BASE_URL}/reset-password?token={token}"
    subject = "Reset Your Password - AfriPulse"
    
    html_content = f"""
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background-color: #2196F3; color: white; padding: 10px; text-align: center; }}
            .content {{ padding: 20px; }}
            .button {{ background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Password Reset</h1>
            </div>
            <div class="content">
                <p>You requested a password reset for your AfriPulse account. Click the button below to reset your password:</p>
                <p><a href="{reset_url}" class="button">Reset Password</a></p>
                <p>If the button above doesn't work, copy and paste the following URL into your browser:</p>
                <p>{reset_url}</p>
                <p>This link will expire in 24 hours.</p>
                <p>If you did not request a password reset, please ignore this email.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    return send_email(to_email, subject, html_content)

def send_order_confirmation_email(to_email, order):
    """Send order confirmation email"""
    subject = f"Order Confirmation #{order.id} - AfriPulse"
    
    # Generate HTML for order items
    items_html = ""
    for item in order.items:
        items_html += f"""
        <tr>
            <td>{item.product.name}</td>
            <td>{item.quantity}</td>
            <td>${item.price:.2f}</td>
            <td>${(item.price * item.quantity):.2f}</td>
        </tr>
        """
    
    html_content = f"""
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background-color: #FF9800; color: white; padding: 10px; text-align: center; }}
            .content {{ padding: 20px; }}
            table {{ width: 100%; border-collapse: collapse; }}
            th, td {{ padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }}
            .total {{ font-weight: bold; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Order Confirmation</h1>
            </div>
            <div class="content">
                <p>Thank you for your order!</p>
                <p>Order ID: <strong>{order.id}</strong></p>
                <p>Date: <strong>{order.created_at.strftime('%Y-%m-%d %H:%M')}</strong></p>
                
                <h3>Order Summary</h3>
                <table>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Subtotal</th>
                    </tr>
                    {items_html}
                    <tr class="total">
                        <td colspan="3">Total</td>
                        <td>${order.total_amount:.2f}</td>
                    </tr>
                </table>
                
                <h3>Shipping Information</h3>
                <p>{order.shipping_address}</p>
                
                <p>We'll notify you when your order ships.</p>
                <p>If you have any questions, please contact our customer support.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    return send_email(to_email, subject, html_content)
