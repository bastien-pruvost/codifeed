def register_routes(app):
    """Register all routes (Blueprints)"""

    from app.routes.auth import auth_router
    from app.routes.user import user_router

    app.register_api(auth_router)
    app.register_api(user_router)
