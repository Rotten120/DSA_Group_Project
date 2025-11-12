from .main_routes import main_bp 
from .profile_route import profile_bp 
from .deque_routes import deque_bp 
from .queue_routes import queue_bp 

def register_routes(app):
    app.register_blueprint(main_bp)
    app.register_blueprint(profile_bp, url_prefix="/profile")
    app.register_blueprint(deque_bp, url_prefix="/deque")
    app.register_blueprint(queue_bp, url_prefix="/queue")
