def register_routes(app):
    """Register all routes (Blueprints)"""

    from app.routes.user import user_router

    app.register_api(user_router)
