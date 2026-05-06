// Archivo de funciones JavaScript para la vista de Psicología
// Nota: La animación del botón flotante de WhatsApp (giro y brillo) está hecha puramente con CSS
// y fue agregada al archivo vistas/styles.css. No se requiere código JavaScript para ese efecto.

// Scroll reveal animation for contact section
(function() {
  const contactSection = document.querySelector('.contactos');
  if (!contactSection) return;

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
})();