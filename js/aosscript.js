    AOS.init();

    function toggleSidebar() {
        document.getElementById('sidebar').classList.toggle('active');
        document.getElementById('main').classList.toggle('shifted');
    };

    const sidebar = document.getElementById('sidebar');
    const overlay = document.querySelector('.overlay');

    function toggleSidebar() {
        sidebar.classList.toggle('active');
        document.getElementById('main').classList.toggle('shifted');
        overlay.classList.toggle('active');
    }

    overlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        document.getElementById('main').classList.remove('shifted');
        overlay.classList.remove('active');
    });