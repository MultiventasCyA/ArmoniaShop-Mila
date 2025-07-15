// Este archivo contiene el código JavaScript que añade interactividad a la página.
// Puedes incluir funciones para manejar eventos, manipular el DOM y cargar contenido dinámicamente.

// Ejemplo de código para mostrar el año actual en el pie de página
document.addEventListener("DOMContentLoaded", function () {
  const currentYear = new Date().getFullYear();
  document.getElementById("current-year").textContent = currentYear;
});

// Aquí puedes agregar más funciones según sea necesario para la interactividad de tu proyecto.
// ...existing code...
document.addEventListener("DOMContentLoaded", () => {
  // SPA: Navegación entre secciones
  const navLinksList = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll(".section-content");

  navLinksList.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").replace("#", "");

      sections.forEach((sec) => sec.classList.remove("active"));
      document.getElementById(targetId).classList.add("active");

      // Opcional: Desplazar arriba en móvil
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // Mostrar año actual en el footer
  document.getElementById("current-year").textContent =
    new Date().getFullYear();

  // Menú hamburguesa responsive
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => navLinks.classList.remove("open"));
    });
  }

  // Cargar carrito y productos al iniciar
  cargarCarrito();
  // renderProducts(); // Comentado porque ahora se carga en otro lugar
  actualizarCarrito();

  // Mostrar panel al hacer clic en el carrito
  document.querySelector(".cart-indicator").addEventListener("click", () => {
    document.getElementById("cart-panel").classList.add("open");
  });
  // Cerrar panel
  document.getElementById("close-cart").addEventListener("click", () => {
    document.getElementById("cart-panel").classList.remove("open");
  });

  // Validación del formulario de contacto
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Limpiar mensajes previos
      let errorMsg = form.querySelector(".form-error");
      let successMsg = form.querySelector(".form-success");
      if (errorMsg) errorMsg.remove();
      if (successMsg) successMsg.remove();

      const nombre = form.querySelector('input[type="text"]').value.trim();
      const correo = form.querySelector('input[type="email"]').value.trim();
      const mensaje = form.querySelector("textarea").value.trim();

      // Validaciones
      if (!nombre || !correo || !mensaje) {
        mostrarMensaje("Por favor, completa todos los campos.", "form-error");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        mostrarMensaje("Por favor, ingresa un correo válido.", "form-error");
        return;
      }

      // Si todo está bien
      mostrarMensaje("¡Mensaje enviado correctamente!", "form-success");
      form.reset();
    });

    function mostrarMensaje(texto, clase) {
      const div = document.createElement("div");
      div.textContent = texto;
      div.className = clase;
      form.insertBefore(div, form.querySelector("button"));
    }
  }

  // Cargar productos desde JSON externo
  fetch("productos.json")
    .then((res) => res.json())
    .then((data) => {
      products = data;
      renderProducts();
    })
    .catch(() => {
      // Si falla la carga, muestra un mensaje
      document.getElementById("product-grid").innerHTML =
        "<p>No se pudieron cargar los productos.</p>";
    });

  // Búsqueda de productos
  const searchInput = document.getElementById("search-product");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchTerm = e.target.value;
      renderProducts();
    });
  }
});

// Array de productos de ejemplo
let products = [];

let cart = [];

// Variable para el término de búsqueda
let searchTerm = "";

// Función para renderizar productos
function renderProducts() {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = "";

  // Filtrar productos por el término de búsqueda
  const filtered = products.filter((producto) =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filtered.length === 0) {
    grid.innerHTML = "<p>No se encontraron productos.</p>";
    return;
  }

  filtered.forEach((producto, idx) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      <p>${producto.descripcion}</p>
      <span class="precio">${producto.precio}</span>
      <button data-idx="${products.indexOf(producto)}">Añadir</button>
    `;
    grid.appendChild(card);
  });

  // Evento para los botones "Añadir"
  grid.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", function () {
      const idx = this.getAttribute("data-idx");
      cart.push(products[idx]);
      actualizarCarrito();

      // Animación visual
      btn.classList.add("added");
      btn.textContent = "¡Añadido!";
      setTimeout(() => {
        btn.classList.remove("added");
        btn.textContent = "Añadir";
      }, 900);
      showToast("Producto añadido al carrito");
    });
  });
}

function guardarCarrito() {
  localStorage.setItem("carritoArmoniaSimple", JSON.stringify(cart));
}

function cargarCarrito() {
  const data = localStorage.getItem("carritoArmoniaSimple");
  cart = data ? JSON.parse(data) : [];
}

// Modifica actualizarCarrito para guardar el carrito:
function actualizarCarrito() {
  document.getElementById("cart-count").textContent = cart.length;
  renderCartList();
  guardarCarrito();
}

function renderCartList() {
  const cartList = document.getElementById("cart-list");
  cartList.innerHTML = "";
  if (cart.length === 0) {
    cartList.innerHTML = "<li>El carrito está vacío.</li>";
    return;
  }
  let total = 0;
  cart.forEach((item, idx) => {
    // Extraer el número del precio (quita el $ y convierte a número)
    const precioNum = Number(item.precio.replace(/[^0-9.]/g, ""));
    total += precioNum;

    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item.nombre} <small>${item.precio}</small></span>
      <button class="remove-btn" data-idx="${idx}">Quitar</button>
    `;
    cartList.appendChild(li);
  });

  // Mostrar total
  const totalLi = document.createElement("li");
  totalLi.style.fontWeight = "bold";
  totalLi.style.borderTop = "1px solid #e0e7ef";
  totalLi.style.marginTop = "1rem";
  totalLi.innerHTML = `<span>Total:</span> <span>$${total.toFixed(2)}</span>`;
  cartList.appendChild(totalLi);

  // Botones para quitar productos
  cartList.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const idx = this.getAttribute("data-idx");
      // Confirmación antes de eliminar
      if (confirm("¿Seguro que deseas quitar este producto del carrito?")) {
        cart.splice(idx, 1);
        actualizarCarrito();
        showToast("Producto eliminado del carrito");
      }
    });
  });
}

document.getElementById("clear-cart").addEventListener("click", () => {
  if (cart.length === 0) return;
  if (confirm("¿Seguro que deseas vaciar todo el carrito?")) {
    cart = [];
    actualizarCarrito();
    showToast("Carrito vaciado");
  }
});

function showToast(mensaje) {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = mensaje;
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 2500);
}

const toggleButton = document.getElementById("toggleMode");
toggleButton.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});
