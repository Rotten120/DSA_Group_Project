from flask import Flask, render_template, request, url_for
from src.backend.dataqueue import Queue
from src.backend.datadeque import DeQue
import json

app = Flask(__name__)
queue_out = Queue()
deque_out = DeQue()
PROFILE_DETAIL = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/projects')
def projects():
    return render_template('project.html')

@app.route('/profiles_menu')
def profiles_menu():
    return render_template('general-profile.html')

@app.route('/queue_init')
def queue_init():
    global queue_out
    queue_out = Queue()
    return render_template('queue.html', nodes=list(queue_out))

@app.route('/queue_update', methods=['GET', 'POST'])
def queue_update():
    inp = None
    global queue_out
    if request.method == 'POST':
        inp = request.form.get('mainInput', '').strip()
        action = request.form['button']

        if action == 'dequeue': 
            queue_out.dequeue()
        elif action == 'enqueue' and inp != '':
            queue_out.enqueue(inp)

    return render_template('queue.html', nodes=list(queue_out))

@app.route('/deque_init')
def deque_init():
    global deque_out
    deque_out = DeQue()
    return render_template('deque.html', nodes=list(deque_out))

@app.route('/deque_update', methods=['GET', 'POST'])
def deque_update():
    inp = None
    global deque_out
    if request.method == 'POST':
        inp = request.form.get('mainInput', '').strip()
        action = request.form['button']

        if action == 'add_rear' and inp != '':
            deque_out.add_rear(inp)
        elif action == 'add_front' and inp != '':
            deque_out.add_front(inp)
        elif action == 'remove_rear':
            deque_out.remove_rear()
        elif action == 'remove_front':
            deque_out.remove_front()

    return render_template('deque.html', nodes=list(deque_out))

@app.route('/profile/<int:profile_id>')
def profile(profile_id = 0):
    data = PROFILE_DETAIL[profile_id]
    return render_template(
            'profile.html',
            cover_picture=data['cover'],
            profile_picture=data['photo'],
            name=data['name'],
            role=data['role'],
            bio=data['bio'],
            projs=data['projects'],
            program=data['program'],
            university=data['university'],
            interests=data['interests'],
            location=data['location'],
            skills=data['skills'],
            achievements=data['achievements'],
            prev_profile_id = len(PROFILE_DETAIL) - 1 if profile_id == 0 else profile_id - 1,
            next_profile_id = (profile_id + 1) % len(PROFILE_DETAIL)
            )

if __name__ == "__main__":
    with open('static/profile_details.json', 'r') as file:
        PROFILE_DETAIL = json.load(file)
    app.run(debug=True)
