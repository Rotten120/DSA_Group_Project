from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/projects')
def projects():
    return render_template('project.html')

@app.route('/profiles_menu')
def profiles_menu():
    return render_template('general-profile.html')

if __name__ == "__main__":
    app.run(debug=True)
