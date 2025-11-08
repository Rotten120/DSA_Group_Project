from flask import Flask, render_template, request
from src.backend.dataqueue import Queue
from src.backend.datadeque import DeQue

app = Flask(__name__)
queue_out = Queue()
deque_out = DeQue()

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
    queue_out = Queue()
    return render_template('queue.html', nodes=[])

@app.route('/queue_update', methods=['GET', 'POST'])
def queue_update():
    inp = None 
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
    deque_out = DeQue()
    return render_template('deque.html', nodes=[])

@app.route('/deque_update', methods=['GET', 'POST'])
def deque_update():
    inp = None
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

if __name__ == "__main__":
    app.run(debug=True)
