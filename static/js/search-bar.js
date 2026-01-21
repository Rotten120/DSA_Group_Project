// Search bar navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.querySelector('.search-form');
    const searchInput = searchForm.querySelector('input[type="search"]');

    const searchRoutes = {
        // Pages
        'home': '/',
        'homepage': '/',
        'projects': '/projects',
        'project': '/projects',
        'profile': '/profiles_menu',
        'profiles': '/profiles_menu',
        'about': '/profiles_menu',
        'contact': '/#contactform-section',
        'contacts': '/#contactform-section',
        'email': '/#contactform-section',
        'message': '/#contactform-section',

        // Labs
        'queue': '/queue/init',
        'deque': '/deque/init',
        'bi-tree': '/bitree/',
        'binary tree': '/bitree/',
        'bst': '/bst/',
        'binary search tree': '/bst/',
        'graph': '/graph',
        'train': '/graph',
        'sorting': '/sorting',
        'sorting algorithm': '/sorting',
        'algorithm': '/sorting',

        // Profile
        'von': '/profile/0',
        'zedric': '/profile/0',
        'delos reyes': '/profile/0',
        
        'saint': '/profile/1',
        'trowa': '/profile/1',
        'tangco': '/profile/1',

        'shane': '/profile/2',
        'craven': '/profile/2',
        'palomo': '/profile/2',

        'adrian': '/profile/3',
        'kurt': '/profile/3',
        'marinas': '/profile/3',

        'carl': '/profile/4',
        'joshua': '/profile/4',
        'manaog': '/profile/4',

        'ycz': '/profile/5',
        'aubhrey': '/profile/5',
        'dy': '/profile/5',

        'angel': '/profile/6',
        'laika': '/profile/6',
        'clarito': '/profile/6',

        'chloe': '/profile/7',
        'mary': '/profile/7',
        'anne': '/profile/7',
        'luna': '/profile/7',

        'chris': '/profile/8',
        'mangahas': '/profile/8',

        // DSA sections on homepage
        'dsa': '/#meaning-section',
        'data structure': '/#meaning-section',
        'data structures': '/#meaning-section',
        'meaning': '/#meaning-section',
        'definition': '/#meaning-section',
        'what is dsa': '/#meaning-section',
        
        'application': '/#applications-section',
        'applications': '/#applications-section',
        'uses': '/#applications-section',
        'use cases': '/#applications-section',
        
        'importance': '/#importance-section',
        'why': '/#importance-section',
        'why dsa': '/#importance-section',
        'important': '/#importance-section',
        
        // Social media
        'facebook': 'https://facebook.com/yourpage',
        'instagram': 'https://instagram.com/yourpage',
        'linkedin': 'https://linkedin.com/in/yourpage',
        'github': 'https://github.com/yourpage',
        
        // External resources
        'tutorial': 'https://www.w3schools.com/dsa/index.php',
        'tutorials': 'https://www.w3schools.com/dsa/index.php',
        'learn': 'https://www.w3schools.com/dsa/index.php',
        'w3schools': 'https://www.w3schools.com/dsa/index.php'
    };

    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const query = searchInput.value.trim().toLowerCase();
        
        if (!query) {
            alert('Please enter a search term');
            return;
        }

        let destination = null;
        
        if (searchRoutes[query]) {
            destination = searchRoutes[query];
        } else {
            for (const [keyword, route] of Object.entries(searchRoutes)) {
                if (query.includes(keyword) || keyword.includes(query)) {
                    destination = route;
                    break;
                }
            }
        }

        if (destination) {
            if (destination.startsWith('http')) {
                // External link
                window.open(destination, '_blank');
            } else if (destination.includes('#')) {
                // Internal anchor link
                window.location.href = destination;
            } else {
                // Internal page
                window.location.href = destination;
            }
            
            searchInput.value = '';
        } else {
            alert(`No results found for "${query}". Try searching for: Home, Projects, Profile, Contact, DSA, Applications, or Importance`);
        }
    });

    searchInput.addEventListener('focus', function() {
        this.setAttribute('placeholder', 'Try: Home, Projects, DSA, Contact...');
    });

    searchInput.addEventListener('blur', function() {
        this.setAttribute('placeholder', 'Search...');
    });
});