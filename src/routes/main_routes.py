from flask import Blueprint, render_template, send_from_directory

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    return render_template('new-index.html')

@main_bp.route('/profiles_menu')
def profiles_menu():
    return render_template('general-profile.html')

# Temporary route for binary tree.
@main_bp.route('/binary-tree')
def binary_tree():
    return render_template('binary-tree.html')

# Temporary route for binary tree.
@main_bp.route('/binary-search-tree')
def binary_search_tree():
    return render_template('binary-search-tree.html')

@main_bp.route("/graph")
def train():
    return render_template("train.html")

@main_bp.route("/directions/main-railway")
def directions():
    return render_template("components/directions/main-railway.html")

@main_bp.route("/sorting")
def sorting_algorithm():
    return render_template('sorting.html')

# Temporary route for everything.
@main_bp.route('/data/<path:filename>')
def serve_data(filename):
    return send_from_directory('data', filename)
