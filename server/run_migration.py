"""
Script to run the migration to add user_id and earnings columns to affiliate_links table.
"""
from flask import Flask
from flask_migrate import Migrate
from models import db
import os
import sys

# Add the current directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

# Create a minimal Flask app
app = Flask(__name__)

# Configure the database
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'mysql+pymysql://root:@localhost/afripulse')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database
db.init_app(app)

# Initialize Flask-Migrate
migrate = Migrate(app, db)

if __name__ == '__main__':
    with app.app_context():
        # Import the migration script
        from migrations.add_user_id_earnings_to_affiliate_links import upgrade
        
        # Run the migration
        print("Running migration to add user_id and earnings columns to affiliate_links table...")
        upgrade()
        print("Migration completed successfully!")
