// Archivo de funciones JavaScript para las vistas de Unimaná

document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica de Modo Oscuro / Claro ---
    const themeToggleButtons = document.querySelectorAll('.theme-toggle-btn, .nav-theme-toggle');
    const body = document.body;

    function applyTheme(theme) {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            themeToggleButtons.forEach(btn => {
                const icon = btn.querySelector('i');
                const text = btn.querySelector('span');
                if (icon) {
                    icon.classList.remove('bi-moon-stars-fill');
                    icon.classList.add('bi-sun-fill');
                }
                if (text && btn.classList.contains('theme-toggle-btn')) text.textContent = 'Modo Claro';
            });
        } else {
            body.classList.remove('dark-mode');
            themeToggleButtons.forEach(btn => {
                const icon = btn.querySelector('i');
                const text = btn.querySelector('span');
                if (icon) {
                    icon.classList.remove('bi-sun-fill');
                    icon.classList.add('bi-moon-stars-fill');
                }
                if (text && btn.classList.contains('theme-toggle-btn')) text.textContent = 'Modo Oscuro';
            });
        }
        localStorage.setItem('theme', theme);
    }

    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    themeToggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const isDark = body.classList.contains('dark-mode');
            applyTheme(isDark ? 'light' : 'dark');
        });
    });

    // --- Lógica de Scroll Reveal para la sección de contactos ---
    const contactSection = document.querySelector('.contactos');
    if (contactSection) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        observer.observe(contactSection);
    }

    // --- Funcionalidad de Búsqueda (Ported from index.js) ---
    function removeHighlights() {
        const highlights = document.querySelectorAll('mark.highlight-search');
        highlights.forEach(mark => {
            const parent = mark.parentNode;
            if (parent) {
                parent.replaceChild(document.createTextNode(mark.textContent), mark);
                parent.normalize();
            }
        });
    }

    function highlightAndScroll(searchTerm) {
        removeHighlights();
        if (!searchTerm) return;

        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
            acceptNode: function(node) {
                const parentName = node.parentNode.nodeName;
                if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(parentName)) {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        });

        const nodesToReplace = [];
        let node;
        while ((node = walker.nextNode())) {
            const text = node.nodeValue;
            const lowerText = text.toLowerCase();
            if (lowerText.includes(searchTerm)) {
                nodesToReplace.push(node);
            }
        }

        let firstMatch = null;
        nodesToReplace.forEach(textNode => {
            const text = textNode.nodeValue;
            const lowerText = text.toLowerCase();
            const fragments = document.createDocumentFragment();
            let lastIndex = 0;
            let index = lowerText.indexOf(searchTerm);

            while (index !== -1) {
                fragments.appendChild(document.createTextNode(text.substring(lastIndex, index)));
                const mark = document.createElement('mark');
                mark.className = 'highlight-search';
                mark.style.backgroundColor = '#ffeb3b';
                mark.style.color = '#000';
                mark.style.padding = '0';
                mark.textContent = text.substring(index, index + searchTerm.length);
                fragments.appendChild(mark);
                if (!firstMatch) firstMatch = mark;
                lastIndex = index + searchTerm.length;
                index = lowerText.indexOf(searchTerm, lastIndex);
            }
            fragments.appendChild(document.createTextNode(text.substring(lastIndex)));
            textNode.parentNode.replaceChild(fragments, textNode);
        });

        if (firstMatch) {
            firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            alert("No se encontraron coincidencias en la página.");
        }
    }

    window.iniciarBusqueda = function(idInput) {
        const input = document.getElementById(idInput) || document.querySelector(idInput);
        if (!input) return;
        const term = input.value.trim().toLowerCase();
        if (!term) return;

        const offcanvasEl = document.getElementById('menuLateral');
        const overlay = document.getElementById('phoneSearchOverlay');

        if (offcanvasEl && offcanvasEl.contains(input)) {
            const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
            if (bsOffcanvas) bsOffcanvas.hide();
            setTimeout(() => highlightAndScroll(term), 350);
        } else {
            if (overlay && overlay.contains(input)) {
                overlay.classList.remove('open');
            }
            highlightAndScroll(term);
        }
        input.value = '';
    };

    // Búsqueda escritorio
    const searchForm = document.querySelector('form.d-flex');
    const searchInput = document.querySelector('.busqueda');
    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            window.iniciarBusqueda('.busqueda');
        });
        searchInput.addEventListener('input', function() {
            if (this.value.trim() === '') removeHighlights();
        });
    }

    // Búsqueda móvil (overlay)
    const phoneToggle = document.getElementById('phoneSearchToggle');
    const phoneOverlay = document.getElementById('phoneSearchOverlay');
    const phoneInput = document.getElementById('phoneSearchInput');
    const phoneClose = document.getElementById('phoneSearchClose');
    if (phoneToggle && phoneOverlay && phoneInput) {
        phoneToggle.addEventListener('click', () => {
            phoneOverlay.classList.add('open');
            setTimeout(() => phoneInput.focus(), 50);
        });
        phoneClose && phoneClose.addEventListener('click', () => {
            phoneOverlay.classList.remove('open');
            phoneInput.value = '';
            removeHighlights();
        });
        phoneInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                window.iniciarBusqueda('phoneSearchInput');
            }
            if (e.key === 'Escape') {
                phoneOverlay.classList.remove('open');
                removeHighlights();
            }
        });
    }

    // Búsqueda offcanvas
    const offInput = document.getElementById('offcanvasSearchInput');
    const offBtn = document.getElementById('offcanvasSearchBtn');
    if (offInput && offBtn) {
        offBtn.addEventListener('click', () => window.iniciarBusqueda('offcanvasSearchInput'));
        offInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                window.iniciarBusqueda('offcanvasSearchInput');
            }
        });
    }

    // --- Manejo de Offcanvas y scroll suave ---
    const menuLateral = document.getElementById('menuLateral');
    if (menuLateral) {
        const links = menuLateral.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const bsOffcanvas = bootstrap.Offcanvas.getInstance(menuLateral);
                menuLateral.setAttribute('data-pending-scroll', targetId);
                if (bsOffcanvas) bsOffcanvas.hide();
            });
        });

        menuLateral.addEventListener('hidden.bs.offcanvas', function() {
            const targetId = this.getAttribute('data-pending-scroll');
            if (targetId) {
                const targetEl = document.querySelector(targetId);
                if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
                this.removeAttribute('data-pending-scroll');
            }
        });
    }
});
