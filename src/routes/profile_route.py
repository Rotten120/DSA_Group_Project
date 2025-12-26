from .base import *
import json

profile_bp = Blueprint('profile', __name__)
PROFILE_DETAIL = []

with open('data/profile_details.json', 'r') as file:
    PROFILE_DETAIL = json.load(file)

@profile_bp.route('/<int:profile_id>')
def profile(profile_id: int = 0):
    data = PROFILE_DETAIL[profile_id]
    contacts = data['contacts']
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
        email=contacts['email'],
        instagram=contacts['instagram'],
        linkedin=contacts['linkedin'],
        github=contacts['github'],
        facebook=contacts['facebook'],
        prev_profile_id = len(PROFILE_DETAIL) - 1 if profile_id == 0 else profile_id - 1,
        next_profile_id = (profile_id + 1) % len(PROFILE_DETAIL)
    )
