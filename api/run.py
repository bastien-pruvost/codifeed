from app import create_app

if __name__ == "__main__":
    app = create_app("development")
    app.run(host="localhost", port=8000, debug=True)
