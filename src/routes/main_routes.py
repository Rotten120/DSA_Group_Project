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
