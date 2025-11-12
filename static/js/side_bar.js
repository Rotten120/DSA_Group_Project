document.addEventListener("DOMContentLoaded", () => {
    const menuIcon = document.getElementById("menu-icon");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");

    function toggleSidebar() {
        sidebar.classList.toggle("active");
        overlay.classList.toggle("active");
    }

    menuIcon.addEventListener("click", toggleSidebar);
    overlay.addEventListener("click", toggleSidebar);
});
