class Contact:
    def __init__(
            self,
            contact_id=None,
            name="",
            status="", 
            mobile=None,
            email=None,
            instagram=None,
            telephone=None,
            facebook=None,
            notes="",
            is_fav=False,
            avatar="",
            background=""
    ):
        self.id = contact_id
        self.name = name
        self.avatar = avatar
        self.background = background
        self.status = status
        self.mobile = mobile
        self.email = email
        self.instagram = instagram
        self.telephone = telephone
        self.facebook = facebook
        self.notes = notes
        self.is_fav = is_fav

    @classmethod
    def import_dict(self, inp_dict):
        temp_contact = Contact(
            contact_id=inp_dict["id"],
            name=inp_dict["name"],
            avatar=inp_dict["avatar"],
            background=inp_dict["headerImage"],
            status=inp_dict["status"],
            mobile=inp_dict["mobile"],
            email=inp_dict["email"],
            instagram=inp_dict["instagram"],
            telephone=inp_dict["telephone"],
            facebook=inp_dict["facebook"],
            notes=inp_dict["notes"],
            is_fav=inp_dict["isFavorite"]
        )
        return temp_contact

    def __list__(self):
        return iter([
            self.id,
            self.name,
            self.avatar,
            self.background,
            self.status,
            self.mobile,
            self.email,
            self.instagram,
            self.telephone,
            self.facebook,
            self.notes,
            self.is_fav
        ])

    def __dict__(self):
        return {
            "id": self.id,
            "name": self.name,
            "avatar": self.avatar,
            "headerImage": self.background,
            "status": self.status,
            "mobile": self.mobile,
            "email": self.email,
            "instagram": self.instagram,
            "telephone": self.telephone,
            "facebook": self.facebook,
            "notes": self.notes,
            "isFavorite": self.is_fav
        }

    def __contains__(self, key):
        return key in list(self)
