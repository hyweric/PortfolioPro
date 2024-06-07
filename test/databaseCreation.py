# ADD THIS TO APP.PY AFTER USER CLASS 
try:
    with app.app_context():
        db.create_all()
    print("Tables created")
except Exception as e:
    print(f"Failed to create tables: {e}")
    # Print out the tables
    
print(db.metadata.tables.keys())