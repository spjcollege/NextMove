from app.db import SessionLocal, User, Product

db = SessionLocal()
users_with_null_points = db.query(User).filter(User.loyalty_points == None).count()
products_with_null_points = db.query(Product).filter(Product.loyalty_points == None).count()
products_with_null_stock = db.query(Product).filter(Product.stock == None).count()

print(f"Users with NULL loyalty_points: {users_with_null_points}")
print(f"Products with NULL loyalty_points: {products_with_null_points}")
print(f"Products with NULL stock: {products_with_null_stock}")

# Also check for empty cart items
products_count = db.query(Product).count()
print(f"Total products: {products_count}")
if products_count > 0:
    p = db.query(Product).first()
    print(f"Sample product: {p.name}, stock: {p.stock}, points: {p.loyalty_points}")

db.close()
