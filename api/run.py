from dotenv import load_dotenv

from app import create_app

if __name__ == "__main__":
    load_dotenv(".env.local")

    app = create_app("development")
    app.run(host="0.0.0.0", port=8000, debug=True)
