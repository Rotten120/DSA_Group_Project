from .base import *
from src.logic.queue_deque import Queue

queue_bp = Blueprint('queue', __name__)
queue_out = Queue()

@queue_bp.route('/init')
def queue_init():
    global queue_out
    queue_out = Queue()
    return render_template('queue.html', nodes=list(queue_out))

@queue_bp.route('/update', methods=['GET', 'POST'])
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

