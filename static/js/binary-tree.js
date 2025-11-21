// ===== STATE =====
let contacts = [];
let selectedContact = null;
let currentView = 'empty';
let isEditing = false;
let currentAvatarData = null;
let currentHeaderData = null;

// ===== DOM ELEMENTS =====
const btSearchInput = document.getElementById('btSearchInput');
const btContactsList = document.getElementById('btContactsList');
const btAddBtn = document.getElementById('btAddBtn');
const btCreateBtn = document.getElementById('btCreateBtn');
const btFavoritesBtn = document.getElementById('btFavoritesBtn');
const btCancelBtn = document.getElementById('btCancelBtn');
const btDoneBtn = document.getElementById('btDoneBtn');
const btMenuBtn = document.getElementById('btMenuBtn');
const btEditBtn = document.getElementById('btEditBtn');
const btDeleteBtn = document.getElementById('btDeleteBtn');
const btMenuCancelBtn = document.getElementById('btMenuCancelBtn');
const btFavoriteToggle = document.getElementById('btFavoriteToggle');

const btEmptyContent = document.getElementById('btEmptyContent');
const btContactForm = document.getElementById('btContactForm');
const btContactDetails = document.getElementById('btContactDetails');
const btFavoritesView = document.getElementById('btFavoritesView');
const btMenuDropdown = document.getElementById('btMenuDropdown');

const btAvatarInput = document.getElementById('btAvatarInput');
const btAvatarPreview = document.getElementById('btAvatarPreview');
const btHeaderInput = document.getElementById('btHeaderInput');
const btHeaderPreview = document.getElementById('btHeaderPreview');
const btHeaderAddBtn = document.getElementById('btHeaderAddBtn');
const btNameInput = document.getElementById('btNameInput');
const btStatusInput = document.getElementById('btStatusInput');
const btMobileInput = document.getElementById('btMobileInput');
const btEmailInput = document.getElementById('btEmailInput');
const btInstagramInput = document.getElementById('btInstagramInput');
const btTelephoneInput = document.getElementById('btTelephoneInput');
const btFacebookInput = document.getElementById('btFacebookInput');
const btNotesInput = document.getElementById('btNotesInput');
const btFavoritesGrid = document.getElementById('btFavoritesGrid');
const btContactAvatar = document.getElementById('btContactAvatar');
const btContactName = document.getElementById('btContactName');
const btContactStatus = document.getElementById('btContactStatus');
const btContactMobile = document.getElementById('btContactMobile');
const btContactEmail = document.getElementById('btContactEmail');
const btContactInstagram = document.getElementById('btContactInstagram');
const btContactTelephone = document.getElementById('btContactTelephone');
const btContactFacebook = document.getElementById('btContactFacebook');
const btContactNotes = document.getElementById('btContactNotes');

// ===== INITIALIZE =====
renderContactsList();
showView('empty');

// ===== EVENT LISTENERS =====
btAddBtn.addEventListener('click', showAddForm);
btFavoritesBtn.addEventListener('click', toggleFavoritesView);
btCancelBtn.addEventListener('click', cancelForm);
btDoneBtn.addEventListener('click', saveContact);
btAvatarInput.addEventListener('change', handleAvatarUpload);
btHeaderInput.addEventListener('change', handleHeaderUpload);
btHeaderAddBtn.addEventListener('click', () => btHeaderInput.click());
btMenuBtn.addEventListener('click', toggleMenu);
btEditBtn.addEventListener('click', handleEdit);
btDeleteBtn.addEventListener('click', handleDelete);
btMenuCancelBtn.addEventListener('click', () => btMenuDropdown.classList.add('bt-hidden'));
btFavoriteToggle.addEventListener('click', toggleFavorite);
btSearchInput.addEventListener('input', renderContactsList);

// FOR DYNAMIC ELEMENTS
btContactsList.addEventListener('click', (e) => {
    if (e.target.classList.contains('bt-create-btn')) {
        showAddForm();
    }
    const item = e.target.closest('.bt-contact-item');
    if (item) {
        const id = parseInt(item.dataset.id);
        const contact = contacts.find(c => c.id === id);
        showContactDetails(contact);
    }
});

// ===== FUNCTIONS =====
const btSearchCancelBtn = document.getElementById('btSearchCancelBtn');

btSearchInput.addEventListener('input', function() {
    if (this.value.length > 0) {
        btSearchCancelBtn.classList.remove('bt-hidden');
    } else {
        btSearchCancelBtn.classList.add('bt-hidden');
    }
    renderContactsList();
});

// Clear search when cancel button is clicked
btSearchCancelBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    btSearchInput.value = '';
    btSearchCancelBtn.classList.add('bt-hidden');
    renderContactsList();
    btSearchInput.focus(); 
});

// Optional: Clear search with Escape key
btSearchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && this.value.length > 0) {
        btSearchInput.value = '';
        btSearchCancelBtn.classList.add('bt-hidden');
        renderContactsList();
    }
});

function showView(view) {
    btEmptyContent.classList.add('bt-hidden');
    btContactForm.classList.add('bt-hidden');
    btContactDetails.classList.add('bt-hidden');
    btFavoritesView.classList.add('bt-hidden');

    switch(view) {
        case 'empty': btEmptyContent.classList.remove('bt-hidden'); break;
        case 'form': btContactForm.classList.remove('bt-hidden'); break;
        case 'details': btContactDetails.classList.remove('bt-hidden'); break;
        case 'favorites': btFavoritesView.classList.remove('bt-hidden'); break;
    }

    currentView = view;
    btFavoritesBtn.classList.toggle('active', currentView === 'favorites');
}

function showAddForm() {
    isEditing = false;
    currentAvatarData = null;
    currentHeaderData = null;
    clearForm();
    showView('form');
}

function clearForm() {
    btNameInput.value = '';
    btStatusInput.value = 'NEW CONTACT';
    btMobileInput.value = '';
    btEmailInput.value = '';
    btInstagramInput.value = '';
    btTelephoneInput.value = '';
    btFacebookInput.value = '';
    btNotesInput.value = '';
    
    // Clear avatar
    btAvatarPreview.style.backgroundImage = '';
    btAvatarPreview.style.background = 'linear-gradient(to bottom, #87ceeb 0%, #87ceeb 50%, #90ee90 50%, #90ee90 100%)';
    btAvatarPreview.innerHTML = '<button class="bt-avatar-add-btn"><i class="fa-solid fa-plus"></i></button>';
    btAvatarPreview.querySelector('button').addEventListener('click', () => btAvatarInput.click());
    
    // Clear header
    btHeaderPreview.style.backgroundImage = '';
    btHeaderPreview.style.background = 'rgba(100, 120, 130, 0.3)';
    btHeaderPreview.classList.remove('has-image');
    btHeaderAddBtn.innerHTML = '<span><i class="fa-solid fa-camera"></i></span><span>Add Header Photo</span>';
}

function cancelForm() {
    if (contacts.length === 0) showView('empty');
    else if (selectedContact) showContactDetails(selectedContact);
    else showView('empty');
}

function saveContact() {
    const name = btNameInput.value.trim();
    if (!name) return alert('Please enter a name');

    const contactData = {
        id: isEditing ? selectedContact.id : Date.now(),
        name,
        status: btStatusInput.value,
        mobile: btMobileInput.value.trim(),
        email: btEmailInput.value.trim(),
        instagram: btInstagramInput.value.trim(), 
        telephone: btTelephoneInput.value.trim(),
        facebook: btFacebookInput.value.trim(),
        notes: btNotesInput.value.trim(),
        isFavorite: isEditing ? selectedContact.isFavorite : false,
        avatar: currentAvatarData || (isEditing ? selectedContact.avatar : ''),
        headerImage: currentHeaderData || (isEditing ? selectedContact.headerImage : '')
    };

    if (isEditing) {
        const index = contacts.findIndex(c => c.id === selectedContact.id);
        contacts[index] = contactData;
    } else contacts.push(contactData);

    selectedContact = contactData;
    renderContactsList();
    showContactDetails(contactData);
}

function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        currentAvatarData = event.target.result;
        btAvatarPreview.style.backgroundImage = `url(${currentAvatarData})`;
        btAvatarPreview.style.background = 'none';
        btAvatarPreview.innerHTML = '';
    };
    reader.readAsDataURL(file);
}

function handleHeaderUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        currentHeaderData = event.target.result;
        btHeaderPreview.style.backgroundImage = `url(${currentHeaderData})`;
        btHeaderPreview.style.background = 'none';
        btHeaderPreview.classList.add('has-image');
        btHeaderAddBtn.innerHTML = '<span><i class="fa-solid fa-camera"></i></span><span>Change Photo</span>';
    };
    reader.readAsDataURL(file);
}

function renderContactsList() {
    const filtered = contacts.filter(c => c.name.toLowerCase().includes(btSearchInput.value.toLowerCase()));

    if (filtered.length === 0) {
        btContactsList.innerHTML = `
            <div class="bt-empty-state">
                <div class="bt-empty-icon"><i class="fa-solid fa-user"></i></div>
                <h3>No Contacts</h3>
                <p>Contacts you've added will appear here.</p>
                <button class="bt-create-btn">Create New Contact</button>
            </div>
        `;
        return;
    }

    const grouped = {};
    filtered.forEach(c => {
        const letter = c.name[0].toUpperCase();
        if (!grouped[letter]) grouped[letter] = [];
        grouped[letter].push(c);
    });

    const sortedLetters = Object.keys(grouped).sort();
    let html = '';
    sortedLetters.forEach(letter => {
        html += `<div class="bt-letter-group"><div class="bt-letter-header">${letter}</div>`;
        grouped[letter].forEach(contact => {
            const isActive = selectedContact && selectedContact.id === contact.id;

            const favoriteIcon = contact.isFavorite 
                ? '<span class="bt-contact-favorite active"><i class="fa-solid fa-star"></i></span>' 
                : '';
            html += `
                <div class="bt-contact-item ${isActive ? 'active' : ''}" data-id="${contact.id}">
                    ${favoriteIcon}
                    <span class="bt-contact-item-name">${contact.name}</span>
                </div>
            `;
        });
        html += '</div>';
    });
    btContactsList.innerHTML = html;
}

function showContactDetails(contact) {
    selectedContact = contact;
    btContactName.textContent = contact.name;
    btContactStatus.textContent = contact.status;
    btContactMobile.textContent = contact.mobile || 'Not provided';
    btContactEmail.textContent = contact.email || 'Not provided';
    btContactInstagram.textContent = contact.instagram || 'Not provided';
    btContactTelephone.textContent = contact.telephone || 'Not provided';
    btContactFacebook.textContent = contact.facebook || 'Not provided';
    btContactNotes.textContent = contact.notes || 'No notes';

    // Handle avatar
    if (contact.avatar) {
        btContactAvatar.style.backgroundImage = `url(${contact.avatar})`;
        btContactAvatar.style.background = `url(${contact.avatar}) center/cover`;
    } else {
        btContactAvatar.style.background = 'linear-gradient(to bottom, #87ceeb 0%, #87ceeb 50%, #90ee90 50%, #90ee90 100%)';
    }

    // Handle header image
    const headerBg = document.querySelector('.bt-contact-header-bg');
    if (contact.headerImage) {
        headerBg.style.backgroundImage = `url(${contact.headerImage})`;
    } else {
        // Default gradient if no header image
        headerBg.style.backgroundImage = 'none';
        headerBg.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }

    btFavoriteToggle.classList.toggle('active', contact.isFavorite);
    showView('details');
    renderContactsList();
}

function toggleMenu() {
    btMenuDropdown.classList.toggle('bt-hidden');
}

function handleEdit() {
    isEditing = true;
    btMenuDropdown.classList.add('bt-hidden');
    btNameInput.value = selectedContact.name;
    btStatusInput.value = selectedContact.status;
    btMobileInput.value = selectedContact.mobile;
    btEmailInput.value = selectedContact.email;
    btInstagramInput.value = selectedContact.instagram;
    btTelephoneInput.value = selectedContact.telephone;
    btFacebookInput.value = selectedContact.facebook;
    btNotesInput.value = selectedContact.notes;
    currentAvatarData = selectedContact.avatar;
    currentHeaderData = selectedContact.headerImage;

    // Handle avatar
    if (selectedContact.avatar) {
        btAvatarPreview.style.backgroundImage = `url(${selectedContact.avatar})`;
        btAvatarPreview.style.background = 'none';
        btAvatarPreview.innerHTML = '';
    } else {
        btAvatarPreview.style.background = 'linear-gradient(to bottom, #87ceeb 0%, #87ceeb 50%, #90ee90 50%, #90ee90 100%)';
        btAvatarPreview.innerHTML = '<button class="bt-avatar-add-btn"><i class="fa-solid fa-plus"></i></button>';
        btAvatarPreview.querySelector('button').addEventListener('click', () => btAvatarInput.click());
    }

    // Handle header image
    if (selectedContact.headerImage) {
        btHeaderPreview.style.backgroundImage = `url(${selectedContact.headerImage})`;
        btHeaderPreview.style.background = 'none';
        btHeaderPreview.classList.add('has-image');
        btHeaderAddBtn.innerHTML = '<span><i class="fa-solid fa-camera"></i></span><span>Change Photo</span>';
    } else {
        btHeaderPreview.style.backgroundImage = '';
        btHeaderPreview.style.background = 'rgba(100, 120, 130, 0.3)';
        btHeaderPreview.classList.remove('has-image');
        btHeaderAddBtn.innerHTML = '<span><i class="fa-solid fa-camera"></i></span><span>Add Header Photo</span>';
    }

    showView('form');
}

function handleDelete() {
    if (!selectedContact) return;
    if (confirm(`Delete ${selectedContact.name}?`)) {
        contacts = contacts.filter(c => c.id !== selectedContact.id);
        selectedContact = null;
        btMenuDropdown.classList.add('bt-hidden');
        showView(contacts.length === 0 ? 'empty' : 'empty');
        renderContactsList();
    }
}

function toggleFavorite() {
    if (!selectedContact) return;
    selectedContact.isFavorite = !selectedContact.isFavorite;
    btFavoriteToggle.classList.toggle('active', selectedContact.isFavorite);
    renderContactsList();
    renderFavorites();
}

function toggleFavoritesView() {
    if (currentView === 'favorites') {
        showView(contacts.length === 0 ? 'empty' : (selectedContact ? 'details' : 'empty'));
    } else {
        renderFavorites();
        showView('favorites');
    }
}

function renderFavorites() {
    const favorites = contacts.filter(c => c.isFavorite);
    if (favorites.length === 0) {
        btFavoritesGrid.innerHTML = '<p class="bt-no-favorites">No favorite contacts yet</p>';
        return;
    }

    let html = '';
    favorites.forEach(contact => {
        const avatarStyle = contact.avatar
            ? `background-image: url(${contact.avatar}); background-size: cover; background-position: center;`
            : 'background: linear-gradient(to bottom, #87ceeb 0%, #87ceeb 50%, #90ee90 50%, #90ee90 100%);';
        html += `
            <div class="bt-favorite-card" data-id="${contact.id}">
                <div class="bt-favorite-card-avatar" style="${avatarStyle}"></div>
                <div class="bt-favorite-card-name">${contact.name}</div>
            </div>
        `;
    });

    btFavoritesGrid.innerHTML = html;

    document.querySelectorAll('.bt-favorite-card').forEach(card => {
        card.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            const contact = contacts.find(c => c.id === id);
            showContactDetails(contact);
        });
    });
}