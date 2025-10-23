#!/usr/bin/env python3
"""
Production runner that explicitly disables fake data seeding.
Use this if you want to run in production without any fake data.
"""

import os

from app import create_app

if __name__ == "__main__":
    # Explicitly disable seeding for production
    os.environ["SEED_FAKE_DATA"] = "false"

    app = create_app()
    # In production, you'd typically use gunicorn instead of app.run()
    # This is just for demonstration
    app.run(host="0.0.0.0", port=8000, debug=False)
