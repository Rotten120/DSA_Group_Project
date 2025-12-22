from flask import Blueprint, render_template

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    return render_template('index.html')

@main_bp.route('/projects')
def projects():
    return render_template('project.html')

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

@main_bp.route("/train")
def train():
    return render_template("train.html")

@main_bp.route("/directions/main-railway")
def directions():
    return render_template("components/directions/main-railway.html")
