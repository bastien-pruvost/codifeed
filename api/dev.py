import sys

from app import create_app

if __name__ == "__main__":
    # Check if --seed flag is passed
    if "--seed" in sys.argv:
        from scripts.seed_users import main as seed_users

        print("Seeding users...")
        seed_users()

    app = create_app()
    app.run(host="0.0.0.0", port=8000, debug=True)
