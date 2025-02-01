// Función para animar los contadores
function countUp(element, targetNumber, duration) {
  let currentNumber = 0;
  const increment = targetNumber / (duration / 50);

  const interval = setInterval(() => {
    currentNumber += increment;
    element.innerText = Math.floor(currentNumber);
    if (currentNumber >= targetNumber) {
      clearInterval(interval);
      element.innerText = targetNumber;
    }
  }, 30);
}

// Función para detectar cuando los elementos entran en la vista
function onIntersection(entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll('.counter');
      counters.forEach((counter) => {
        const targetNumber = parseInt(counter.dataset.target, 10);
        const duration = 2000;
        countUp(counter, targetNumber, duration);
        counter.classList.add('counter-visible');
      });
      observer.unobserve(entry.target); // Deja de observar después de la animación
    }
  });
}

// Configuración del Intersection Observer
const observer = new IntersectionObserver(onIntersection, {
  threshold: 0.5, // El 50% del elemento debe ser visible para activar la animación
});

// Observamos la sección de estadísticas
const statsSection = document.querySelector('.statistics');
observer.observe(statsSection);
