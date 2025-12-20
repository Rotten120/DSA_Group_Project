from flask import Blueprint, render_template, send_from_directory

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    return render_template('index.html')

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

# Temporary route for everything.
@main_bp.route('/data/<path:filename>')
def serve_data(filename):
    return send_from_directory('data', filename)
