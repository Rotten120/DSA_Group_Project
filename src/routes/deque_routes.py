from flask import Blueprint, render_template, request
from src.queue_deque.datadeque import DeQue

deque_bp = Blueprint('deque', __name__)
deque_out = DeQue()

@deque_bp.route('/init')
def deque_init():
    global deque_out
    deque_out = DeQue()
    return render_template('deque.html', nodes=list(deque_out))

@deque_bp.route('/update', methods=['GET', 'POST'])
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

