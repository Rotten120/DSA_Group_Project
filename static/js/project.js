document.addEventListener("DOMContentLoaded", async ()=> {
    const track = document.querySelector(".slide-link");
    const leftBtn = document.querySelector(".scroll-left");
    const rightBtn = document.querySelector(".scroll-right");
    const overlay = document.getElementById('popup-overlay');
    const linkBoxes = document.querySelectorAll('.link-box a');
    const exitBtn = document.querySelector('.left-button .inner-btn');
    const continueBtn= document.querySelector('.right-button .inner-btn');

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
                { key: 'graph', ...projectData.graph},
                { key: 'sorting', ...projectData.sorting }
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
        'BINARY SEARCH TREE': 3,
        'TRAIN ROUTE': 4,
        'SORTING ALGORITHM': 5
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
        });
    });

    // Exit button
    if (exitBtn) {
        exitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closePopup();
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

    // Update popup content - only load the image now
    function updatePopupContent(index) {
        const popupImage = document.querySelector('.img-container img');
        const data = dataStructuresArray[index];
        
        if (data && popupImage) {
            const imgSrc = data['bg-img'].startsWith('http') 
                ? data['bg-img'] 
                : `/static/images/projects-img/${data['bg-img']}`;
            popupImage.src = imgSrc;
            popupImage.alt = data.title;
        } else {
            console.error('Could not load image for index:', index);
        }
    }
});