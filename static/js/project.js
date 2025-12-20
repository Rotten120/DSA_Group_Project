document.addEventListener("DOMContentLoaded", async ()=> {
    const track = document.querySelector(".slide-link");
    const leftBtn = document.querySelector(".scroll-left");
    const rightBtn = document.querySelector(".scroll-right");
    const overlay = document.getElementById('popup-overlay');
    const closeBtn = document.getElementById('closePopup');
    const linkBoxes = document.querySelectorAll('.link-box a');
    const prevBtn = document.querySelector('.left-button .inner-btn');
    const nextBtn = document.querySelector('.right-button .inner-btn');
    const continueBtn = document.querySelector('.center-button .inner-btn');

    let position = 0;
    const slideWidth = 200;
    let currentIndex = 0;
    let dataStructuresArray = [];

    // Load project data from backend
    async function loadProjectData() {
        const jsonPath = `/data/project_details.json?v=${Date.now()}`;
        
        try {
            const response = await fetch(jsonPath, {
                cache: 'no-store',
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const projectData = await response.json();
            console.log('✓ JSON loaded successfully:', projectData);
            
            // Convert to array
            dataStructuresArray = [
                { key: 'queue', ...projectData.queue },
                { key: 'deque', ...projectData.deque },
                { key: 'bitree', ...projectData.bitree },
                { key: 'bst', ...projectData.bst },
                { 
                    key: 'placeholder5', 
                    title: 'Coming Soon', 
                    desc: 'This data structure information is coming soon!', 
                    'bg-img': 'https://via.placeholder.com/400x300/gray/white?text=Coming+Soon', 
                    route: null 
                },
                { 
                    key: 'placeholder6', 
                    title: 'Coming Soon', 
                    desc: 'This data structure information is coming soon!', 
                    'bg-img': 'https://via.placeholder.com/400x300/gray/white?text=Coming+Soon', 
                    route: null 
                }
            ];
            
            console.log('✓ Data array created:', dataStructuresArray);
            return true;
            
        } catch (error) {
            console.error('✗ Failed to load JSON:', error);
            console.error('Error details:', {
                message: error.message,
                type: error.name,
                path: jsonPath
            });
            alert(`Error loading project data:\n${error.message}\n\nCheck console for details.`);
            return false;
        }
    }

    // Load data before setting up event listeners
    await loadProjectData();

    // Scroll left
    if (leftBtn) {
        leftBtn.addEventListener("click", () => {
            position += slideWidth;
            if(position > 0) position = 0;
            track.style.transform = `translateX(${position}px)`;
        });
    }

    // Scroll right
    if (rightBtn) {
        rightBtn.addEventListener("click", () => {
            const limit = -(track.offsetWidth - track.parentElement.offsetWidth);
            position -= slideWidth;
            if(position < limit) position = limit;
            track.style.transform = `translateX(${position}px)`;
        });
    }

    // Map link text to array indices
    const linkTextToIndex = {
        'QUEUE': 0,
        'DEQUE': 1,
        'BINARY-TREE': 2,
        'BINARY       SEARCH TREE': 3,
        '5': 4,
        '6': 5
    };

    // Open popup when clicking on links
    linkBoxes.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            const linkText = link.textContent.trim();
            currentIndex = linkTextToIndex[linkText] ?? 0;
            
            updatePopupContent(currentIndex);
            updateButtonStates();
        });
    });

    // Previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (currentIndex > 0) {
                currentIndex--;
                updatePopupContent(currentIndex);
                updateButtonStates();
            }
        });
    }

    // Continue button
    if (continueBtn) {
        continueBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const currentData = dataStructuresArray[currentIndex];
            
            if (currentData && currentData.route) {
                window.location.href = currentData.route;
            }
        });
    }

    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (currentIndex < dataStructuresArray.length - 1) {
                currentIndex++;
                updatePopupContent(currentIndex);
                updateButtonStates();
            }
        });
    }

    // Update button states
    function updateButtonStates() {
        const currentData = dataStructuresArray[currentIndex];
        
        if (prevBtn) {
            if (currentIndex === 0) {
                prevBtn.style.opacity = '0.5';
                prevBtn.style.cursor = 'not-allowed';
                prevBtn.disabled = true;
            } else {
                prevBtn.style.opacity = '1';
                prevBtn.style.cursor = 'pointer';
                prevBtn.disabled = false;
            }
        }

        if (nextBtn) {
            if (currentIndex === dataStructuresArray.length - 1) {
                nextBtn.style.opacity = '0.5';
                nextBtn.style.cursor = 'not-allowed';
                nextBtn.disabled = true;
            } else {
                nextBtn.style.opacity = '1';
                nextBtn.style.cursor = 'pointer';
                nextBtn.disabled = false;
            }
        }

        if (imgContainer) {
            if (currentData && currentData.route) {
                imgContainer.style.cursor = 'pointer';
                imgContainer.title = 'Click to go to ' + currentData.title;
            } else {
                imgContainer.style.cursor = 'default';
                imgContainer.title = '';
            }
        }
    }

    // Close popup
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closePopup();
        });
    }

    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay || e.target.classList.contains('popup-overlay')) {
                e.stopPropagation();
                closePopup();
            }
        });
    }

    const popupContent = document.querySelector('.popup-content');
    if (popupContent) {
        popupContent.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    function closePopup() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Update popup content
    function updatePopupContent(index) {
        const popupTitle = document.querySelector('#text-content h2');
        const popupText = document.querySelector('#text-content p');
        const popupImage = document.querySelector('.img-container img');
        
        const titles = [
            '01   QUEUE',
            '02   DEQUE',
            '03   BINARY TREE',
            '04   BINARY SEARCH TREE',
            '05   COMING SOON',
            '06   COMING SOON'
        ];

        const data = dataStructuresArray[index];
        
        if (data) {
            if (popupTitle) {
                popupTitle.textContent = titles[index];
            }
            
            if (popupText) {
                popupText.textContent = data.desc || 'No description available';
            }
            
            if (popupImage) {
                const imgSrc = data['bg-img'].startsWith('http') 
                    ? data['bg-img'] 
                    : `/static/images/project_pics/${data['bg-img']}`;
                popupImage.src = imgSrc;
                popupImage.alt = data.title;
            }
        } else {
            if (popupTitle) popupTitle.textContent = 'Error Loading Data';
            if (popupText) popupText.textContent = 'Could not load data structure information.';
        }
    }
});