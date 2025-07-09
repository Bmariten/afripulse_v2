# AfriPulse Flask Backend

This is the Flask backend for the AfriPulse marketplace application, converted from the original Node.js/Express implementation.

## Features

- User authentication (registration, login, email verification, password reset)
- User profiles (customer, seller, affiliate)
- Product management
- Shopping cart functionality
- Order processing
- Affiliate marketing system
- Admin dashboard
- Search functionality

## Tech Stack

- **Framework**: Flask
- **Database**: MySQL with SQLAlchemy ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Email**: SMTP with HTML templates
- **File Upload**: Werkzeug with PIL for validation
- **Rate Limiting**: Flask-Limiter
- **CORS**: Flask-CORS

## Project Structure

```
server/
├── app.py                 # Main application entry point
├── config.py              # Configuration settings
├── requirements.txt       # Python dependencies
├── .env.flask             # Environment variables (rename to .env)
├── models/                # Database models
│   ├── __init__.py
│   ├── user.py
│   ├── profile.py
│   └── ...
├── routes/                # API routes
│   ├── auth_routes.py
│   ├── user_routes.py
│   └── ...
├── utils/                 # Utility functions
│   ├── auth_helpers.py
│   ├── email_service.py
│   └── ...
├── scripts/               # Helper scripts
│   └── init_db.py
└── static/                # Static files (uploads, etc.)
    └── uploads/
```

## Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/afripulse.git
cd afripulse/server
```

2. **Set up a virtual environment**

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**

```bash
pip install -r requirements.txt
```

4. **Configure environment variables**

```bash
cp .env.flask .env
# Edit .env with your configuration
```

5. **Initialize the database**

```bash
python scripts/init_db.py
```

6. **Run the application**

```bash
flask run
```

The API will be available at http://localhost:5000.

## API Documentation

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/verify-email/:token` - Verify email address
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `POST /api/auth/refresh-token` - Refresh JWT token

### Users

- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update current user profile
- `GET /api/users/:id` - Get user by ID (admin only)
- `PUT /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product (seller only)
- `PUT /api/products/:id` - Update product (seller only)
- `DELETE /api/products/:id` - Delete product (seller only)
- `POST /api/products/:id/images` - Upload product images

### Cart

- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove/:itemId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear cart

### Orders

- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create new order from cart
- `PUT /api/orders/:id/cancel` - Cancel order
- `PUT /api/orders/:id/status` - Update order status (admin/seller)

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:category/subcategories` - Get subcategories
- `GET /api/categories/featured` - Get featured categories
- `GET /api/categories/:category/products` - Get products by category

### Search

- `GET /api/search/products` - Search products
- `GET /api/search/sellers` - Search sellers

### Admin

- `GET /api/admin/dashboard` - Get admin dashboard stats
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/products` - Get all products (admin only)
- `GET /api/admin/orders` - Get all orders (admin only)
- `GET /api/admin/flagged-activities` - Get flagged activities

## License

MIT
