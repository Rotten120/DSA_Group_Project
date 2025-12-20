document.addEventListener("DOMContentLoaded", () => {
    const menuIcon = document.getElementById("menu-icon");
    const sidebar = document.getElementById("sidebar");
    const sidebarOverlay = document.getElementById("sidebar-overlay");

    function toggleSidebar() {
        sidebar.classList.toggle("active");
        sidebarOverlay.classList.toggle("active");
    }

    if (menuIcon) {
        menuIcon.addEventListener("click", toggleSidebar);
    }
    
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener("click", toggleSidebar);
    }
});