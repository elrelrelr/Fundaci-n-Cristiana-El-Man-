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
