import uuid
from app import app, db
from models import Category

# Define the definitive list of categories from the ProductForm.tsx component
CATEGORIES = [
    {'name': 'Apparel & Accessories', 'description': 'Clothing and accessories.', 'image_url': 'https://example.com/apparel.jpg'},
    {'name': 'Electronics', 'description': 'Gadgets and consumer electronics.', 'image_url': 'https://example.com/electronics.jpg'},
    {'name': 'Home & Garden', 'description': 'Products for your home and garden.', 'image_url': 'https://example.com/home-garden.jpg'},
    {'name': 'Health & Beauty', 'description': 'Health and beauty products.', 'image_url': 'https://example.com/health-beauty.jpg'},
    {'name': 'Sports & Outdoors', 'description': 'Gear for sports and outdoor activities.', 'image_url': 'https://example.com/sports.jpg'},
    {'name': 'Toys & Hobbies', 'description': 'Toys and hobbies for all ages.', 'image_url': 'https://example.com/toys-hobbies.jpg'},
    {'name': 'Books & Media', 'description': 'Books, music, and movies.', 'image_url': 'https://example.com/books-media.jpg'},
    {'name': 'Automotive', 'description': 'Vehicle parts and accessories.', 'image_url': 'https://example.com/automotive.jpg'},
    {'name': 'Grocery', 'description': 'Groceries and food items.', 'image_url': 'https://example.com/grocery.jpg'},
    {'name': 'Pet Supplies', 'description': 'Supplies for your pets.', 'image_url': 'https://example.com/pet-supplies.jpg'},
    {'name': 'Real Estate', 'description': 'Resources for property investment.', 'image_url': 'https://example.com/real-estate.jpg'},
    {'name': 'Technology', 'description': 'Tech gadgets and software.', 'image_url': 'https://example.com/technology.jpg'},
    {'name': 'Handmade', 'description': 'Handmade and artisan products.', 'image_url': 'https://example.com/handmade.jpg'},
    {'name': 'Vintage', 'description': 'Vintage and antique items.', 'image_url': 'https://example.com/vintage.jpg'}
]

def seed_categories():
    """Seeds the database with the default categories."""
    with app.app_context():
        print("Checking for existing categories...")
        existing_slugs = [cat.slug for cat in Category.query.all()]
        
        categories_to_add = []
        for cat_data in CATEGORIES:
            # Use the exact slug generation logic from the frontend form
            slug = cat_data['name'].lower().replace(' & ', '-').replace(' ', '-')
            
            if slug not in existing_slugs:
                new_category = Category(
                    id=str(uuid.uuid4()),
                    name=cat_data['name'],
                    slug=slug,
                    description=cat_data['description'],
                    image_url=cat_data['image_url']
                )
                categories_to_add.append(new_category)
                print(f"Staging category: {cat_data['name']}")
            else:
                print(f"Skipping existing category: {cat_data['name']}")

        if categories_to_add:
            print(f"Adding {len(categories_to_add)} new categories to the database...")
            db.session.bulk_save_objects(categories_to_add)
            db.session.commit()
            print("Categories added successfully.")
        else:
            print("No new categories to add. Database is up to date.")

if __name__ == '__main__':
    seed_categories()
