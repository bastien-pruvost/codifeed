import os

from app import create_app

if __name__ == "__main__":
    # Set development environment variables
    os.environ["FLASK_ENV"] = "development"
    os.environ["FLASK_DEBUG"] = "1"

    app = create_app()
    app.run(host="0.0.0.0", port=8000, debug=True)
