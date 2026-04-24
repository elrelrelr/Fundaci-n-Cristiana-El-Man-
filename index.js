// Separar cada letra en un span para efectos individuales
document.addEventListener("DOMContentLoaded", function () {
  const text = document.querySelector(".animated-text");
  const textContent = text.textContent;
  let newHtml = "";

  for (let i = 0; i < textContent.length; i++) {
    if (textContent[i] === " ") {
      newHtml += " ";
    } else {
      newHtml += `<span>${textContent[i]}</span>`;
    }
  }

  text.innerHTML = newHtml;

  // Efecto de ola automático
  const spans = text.querySelectorAll("span");
  let currentIndex = 0;

  setInterval(() => {
    if (currentIndex > 0) {
      spans[currentIndex - 1].classList.remove("wave-animation");
    } else {
      spans[spans.length - 1].classList.remove("wave-animation");
    }

    spans[currentIndex].classList.add("wave-animation");

    currentIndex = (currentIndex + 1) % spans.length;
  }, 100);
});
// Seleccionar todas las imagenes y bajarles el peso
const imagenes = document.querySelectorAll("img");
imagenes.forEach((img) => img.setAttribute("loading", "lazy"));



// Efecto de linea al hacer hover en el texto del menu desplegable
const menuItems = document.querySelectorAll(".nav-item");
menuItems.forEach((item) => {
  item.addEventListener("mouseover", () => {
    item.style.textDecoration = "line-through";
  });
  item.addEventListener("mouseout", () => {
    item.style.textDecoration = "none";
  });
});

// Funcionalidad de la barra de búsqueda
const searchForm = document.querySelector('form.d-flex');
const searchInput = document.querySelector('.busqueda');

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
      // Texto antes de la coincidencia
      fragments.appendChild(document.createTextNode(text.substring(lastIndex, index)));
      
      // La coincidencia envuelta en <mark>
      const mark = document.createElement('mark');
      mark.className = 'highlight-search';
      mark.style.backgroundColor = '#ffeb3b';
      mark.style.color = '#000';
      mark.style.padding = '0';
      mark.textContent = text.substring(index, index + searchTerm.length);
      fragments.appendChild(mark);
      
      if (!firstMatch) {
        firstMatch = mark;
      }

      lastIndex = index + searchTerm.length;
      index = lowerText.indexOf(searchTerm, lastIndex);
    }
    
    // Texto después de la última coincidencia
    fragments.appendChild(document.createTextNode(text.substring(lastIndex)));
    
    // Reemplazar el nodo de texto original con el fragmento
    textNode.parentNode.replaceChild(fragments, textNode);
  });

  if (firstMatch) {
    firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else {
    alert("No se encontraron coincidencias en la página.");
  }
}

if (searchForm && searchInput) {
  searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const searchTerm = searchInput.value.trim().toLowerCase();
    highlightAndScroll(searchTerm);
  });

  // Limpiar resaltados al vaciar el campo de búsqueda
  searchInput.addEventListener('input', function(e) {
    if (this.value.trim() === '') {
      removeHighlights();
    }
  });
}

// Animación de estrellitas al presionar el botón de "subir"
document.addEventListener('DOMContentLoaded', () => {
  const rocketBtn = document.getElementById('rocket-btn');

  if (rocketBtn) {
    rocketBtn.addEventListener('click', () => {
      // Crear 50 pequeñas estrellas
      for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star fly-up';
        
        // Tamaño aleatorio entre 2px y 5px
        const size = Math.random() * 3 + 2;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Posición horizontal aleatoria en toda la pantalla
        star.style.left = `${Math.random() * 100}vw`;
        
        // Retraso y duración aleatoria de la animación
        star.style.animationDelay = `${Math.random() * 0.5}s`;
        star.style.animationDuration = `${Math.random() * 1.5 + 1.5}s`; // de 1.5s a 3s
        
        document.body.appendChild(star);
        
        // Eliminar del DOM después de que termine la animación
        setTimeout(() => {
          star.remove();
        }, 4000);
      }
    });
  }
});

// ── Año del carrusel ──────────────────────────────────────────
(function () {
  const carouselEl = document.getElementById('carouselExampleIndicators');
  const yearEl     = document.getElementById('carouselYear');
  if (!carouselEl || !yearEl) return;

  function extractYear(slideEl) {
    const img = slideEl && slideEl.querySelector('img');
    if (!img) return '';
    const filename = img.getAttribute('src').split('/').pop(); // e.g. "202301.jpg"
    const first4   = filename.substring(0, 4);
    return /^\d{4}$/.test(first4) ? first4 : 'Grad.';
  }

  // Valor inicial
  const firstSlide = carouselEl.querySelector('.carousel-item.active');
  if (firstSlide) yearEl.textContent = extractYear(firstSlide);

  // Actualizar con fade en cada transición
  carouselEl.addEventListener('slide.bs.carousel', function (e) {
    const slides   = carouselEl.querySelectorAll('.carousel-item');
    const nextSlide = slides[e.to];
    const newYear   = extractYear(nextSlide);

    // Fade out
    yearEl.classList.add('fading');

    setTimeout(function () {
      yearEl.textContent = newYear;
      yearEl.classList.remove('fading');
    }, 300);
  });
})();

// ── Búsqueda móvil (lupa navbar) ─────────────────────────────
(function () {
  const toggle = document.getElementById('mobileSearchToggle');
  const bar    = document.getElementById('mobileSearchBar');
  const input  = document.getElementById('mobileSearchInput');
  if (!toggle || !bar || !input) return;

  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    bar.classList.toggle('open');
    if (bar.classList.contains('open')) {
      input.focus();
    } else {
      input.value = '';
    }
  });

  // Buscar al presionar Enter
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const term = input.value.trim().toLowerCase();
      if (term) {
        highlightAndScroll(term);
        bar.classList.remove('open');
        input.value = '';
      }
    }
    if (e.key === 'Escape') {
      bar.classList.remove('open');
      input.value = '';
    }
  });

  // Cerrar al hacer clic fuera
  document.addEventListener('click', function (e) {
    if (!toggle.contains(e.target) && !bar.contains(e.target)) {
      bar.classList.remove('open');
      input.value = '';
    }
  });
})();

// ── Búsqueda del menú lateral (offcanvas) ────────────────────
(function () {
  const input  = document.getElementById('offcanvasSearchInput');
  const btn    = document.getElementById('offcanvasSearchBtn');
  const offcanvasEl = document.getElementById('menuLateral');
  if (!input || !btn) return;

  function doSearch() {
    const term = input.value.trim().toLowerCase();
    if (!term) return;

    // Cerrar el offcanvas antes de buscar
    if (offcanvasEl) {
      const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
      if (bsOffcanvas) bsOffcanvas.hide();
    }

    // Pequeño delay para que el offcanvas cierre antes de hacer scroll
    setTimeout(function () {
      highlightAndScroll(term);
    }, 350);

    input.value = '';
  }

  btn.addEventListener('click', doSearch);

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      doSearch();
    }
    if (e.key === 'Escape') {
      input.value = '';
    }
  });

  // Limpiar al cerrar el offcanvas
  if (offcanvasEl) {
    offcanvasEl.addEventListener('hidden.bs.offcanvas', function () {
      input.value = '';
      removeHighlights();
    });
  }
})();
