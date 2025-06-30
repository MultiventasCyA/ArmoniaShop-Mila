document.addEventListener("DOMContentLoaded", () => {
  // !Inicializar iconos Lucide
  lucide.createIcons();

  // !Establecer el año actual en el pie de página
  document.getElementById("current-year").textContent =
    new Date().getFullYear();

  // !Datos de productos
  const products = [
    {
      id: 1,
      name: "Organizador Multiusos",
      description: "Ideal para cocina o baño, mantiene todo en orden.",
      price: "199.00 MXN",
      imageUrl: "https://placehold.co/400x300/e0e7ff/3f51b5?text=Organizador",
    },
    {
      id: 2,
      name: "Contenedores Herméticos",
      description:
        "Set de 3 para conservar tus alimentos frescos por más tiempo.",
      price: "249.00 MXN",
      imageUrl: "https://placehold.co/400x300/c7d2fe/3f51b5?text=Contenedores",
    },
    {
      id: 3,
      name: "Tapete Microfibra",
      description: "Suave y absorbente, perfecto para el baño o la entrada.",
      price: "129.00 MXN",
      imageUrl: "https://placehold.co/400x300/a5b4fc/3f51b5?text=Tapete",
    },
    {
      id: 4,
      name: "Exprimidor Manual",
      description: "Diseño ergonómico para exprimir frutas fácilmente.",
      price: "99.00 MXN",
      imageUrl: "https://placehold.co/400x300/818cf8/3f51b5?text=Exprimidor",
    },
    {
      id: 5,
      name: "Escoba Mágica",
      description: "Limpieza eficiente en cualquier superficie sin esfuerzo.",
      price: "299.00 MXN",
      imageUrl: "https://placehold.co/400x300/6366f1/3f51b5?text=Escoba",
    },
    {
      id: 6,
      name: "Juego de Sartenes",
      description: "Antiadherentes y duraderos, esenciales para tu cocina.",
      price: "499.00 MXN",
      imageUrl: "https://placehold.co/400x300/4f46e5/3f51b5?text=Sartenes",
    },
  ];

  // !Función para crear el HTML de una tarjeta de producto
  const createProductCard = (product) => {
    return `
                    <div class="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 border border-blue-200">
                        <img
                            src="${product.imageUrl}"
                            alt="${product.name}"
                            class="w-full h-48 object-cover object-center"
                            onerror="this.onerror=null;this.src='https://placehold.co/400x300/a5b4fc/3f51b5?text=Producto';"
                        />
                        <div class="p-5">
                            <h3 class="font-semibold text-xl mb-2 text-blue-800">${product.name}</h3>
                            <p class="text-gray-600 text-sm mb-4 line-clamp-3">${product.description}</p>
                            <div class="flex justify-between items-center">
                                <span class="text-blue-700 font-bold text-lg">${product.price}</span>
                                <button class="bg-blue-600 text-white py-2 px-4 rounded-full text-sm hover:bg-blue-700 transition-colors duration-300 flex items-center space-x-1">
                                    <i data-lucide="shopping-cart" class="w-4 h-4"></i>
                                    <span>Añadir</span>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
  };

  // Renderizar productos en el grid
  const productGridHome = document.getElementById("product-grid");
  const productGridStandalone = document.getElementById(
    "product-grid-standalone"
  );

  products.forEach((product) => {
    const cardHtml = createProductCard(product);
    if (productGridHome) {
      productGridHome.innerHTML += cardHtml;
    }
    if (productGridStandalone) {
      productGridStandalone.innerHTML += cardHtml;
    }
  });

  // !Re-inicializar iconos Lucide después de cargar contenido dinámico
  lucide.createIcons();

  // !Lógica para cambiar de sección
  const navButtons = document.querySelectorAll(".nav-button");
  const sections = document.querySelectorAll(".section-content");

  navButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const targetSectionId = event.currentTarget.dataset.section;

      // !Ocultar todas las secciones
      sections.forEach((section) => {
        section.classList.remove("active");
      });

      // !Mostrar la sección objetivo
      const targetSection = document.getElementById(targetSectionId);
      if (targetSection) {
        targetSection.classList.add("active");
      }

      // !Opcional: Desplazar hacia arriba la nueva sección para mejor experiencia en móvil
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // !Envío del formulario de contacto
  const contactForm = document.getElementById("contact-form");
  const submissionStatus = document.getElementById("submission-status");

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault(); // Prevenir el envío por defecto del formulario

      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const message = document.getElementById("message").value;

      // !Validación básica
      if (!name || !email || !message) {
        submissionStatus.classList.remove(
          "hidden",
          "bg-green-100",
          "text-green-800"
        );
        submissionStatus.classList.add("bg-red-100", "text-red-800");
        submissionStatus.textContent =
          "Por favor, completa todos los campos del formulario.";
      } else {
        // !Simular envío de formulario (en una app real, enviar datos al backend)
        console.log("Formulario enviado:", { name, email, message });

        submissionStatus.classList.remove(
          "hidden",
          "bg-red-100",
          "text-red-800"
        );
        submissionStatus.classList.add("bg-green-100", "text-green-800");
        submissionStatus.textContent =
          "¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.";

        // !Limpiar campos del formulario
        contactForm.reset();
      }

      // !Ocultar mensaje de estado después de 3 segundos
      setTimeout(() => {
        submissionStatus.classList.add("hidden");
      }, 3000);
    });
  }
});
