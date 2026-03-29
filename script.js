//? Este archivo contiene el código JavaScript que añade interactividad a la página.
//? Puedes incluir funciones para manejar eventos, manipular el DOM y cargar contenido dinámicamente.

//? Aquí puedes agregar más funciones según sea necesario para la interactividad de tu proyecto.
//? Código para manejar la navegación entre secciones, el carrito de compras y más
document.addEventListener("DOMContentLoaded", () => {
  //? SPA: Navegación entre secciones
  const navLinksList = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll(".section-content");

  navLinksList.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").replace("#", "");

      sections.forEach((sec) => sec.classList.remove("active"));
      document.getElementById(targetId).classList.add("active");

      //? Opcional: Desplazar arriba en móvil
      // window.scrollTo({ top: 0, behavior: "smooth" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  //? Mostrar año actual en el footer
  document.getElementById("current-year").textContent =
    new Date().getFullYear();

  //? Menú hamburguesa responsive
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

  //? Cargar carrito y productos al iniciar
  cargarCarrito();
  //? renderProducts(); // Comentado porque ahora se carga en otro lugar
  actualizarCarrito();

  //? Mostrar panel al hacer clic en el carrito
  document.querySelector(".cart-indicator").addEventListener("click", () => {
    document.getElementById("cart-panel").classList.add("open");
  });
  //? Cerrar panel
  document.getElementById("close-cart").addEventListener("click", () => {
    document.getElementById("cart-panel").classList.remove("open");
  });

  const form = document.getElementById("contact-form");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault(); // Intercepta envío temporalmente

      // Limpiar clases de error visual
      form
        .querySelectorAll("input, textarea")
        .forEach((el) => el.classList.remove("error"));

      // Eliminar mensajes previos
      form
        .querySelectorAll(".form-error, .form-success")
        .forEach((el) => el.remove());

      const nombre = form.nombre.value.trim();
      const correo = form.correo.value.trim();
      const mensaje = form.mensaje.value.trim();

      // Validación de campos vacíos
      if (!nombre || !correo || !mensaje) {
        mostrarMensaje("Por favor, completa todos los campos.", "form-error");
        return;
      }

      // Validación de correo electrónico
      const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
      if (!emailValido) {
        form.correo.classList.add("error");
        mostrarMensaje("Correo inválido. Verifica el formato.", "form-error");
        return;
      }

      // ✅ Todo correcto → ahora sí enviamos el formulario real
      form.submit(); // Esto activa el envío a FormSubmit
    });

    function mostrarMensaje(texto, clase) {
      const div = document.createElement("div");
      div.textContent = texto;
      div.className = clase;
      form.insertBefore(div, form.querySelector("button"));
    }
  }

  //? Cargar productos desde JSON externo
  fetch("productos.json")
    .then((res) => res.json())
    .then((data) => {
      products = data;
      renderProducts();
    })
    .catch(() => {
      //? Si falla la carga, muestra un mensaje
      document.getElementById("product-grid").innerHTML =
        "<p>No se pudieron cargar los productos.</p>";
    });

  //? Búsqueda de productos
  const searchInput = document.getElementById("search-product");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchTerm = e.target.value;
      renderProducts();
    });
  }
});

//? Array de productos de ejemplo
let products = [];

let cart = [];

//? Variable para el término de búsqueda
let searchTerm = "";

//? Función para renderizar productos
function renderProducts() {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = "";

  //? Filtrar productos por el término de búsqueda
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

  //? Evento para los botones "Añadir"
  grid.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", function () {
      const idx = this.getAttribute("data-idx");
      cart.push(products[idx]);
      actualizarCarrito();

      //? Animación visual
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

//? Modifica actualizarCarrito para guardar el carrito:
function actualizarCarrito() {
  document.getElementById("cart-count").textContent = cart.length;
  renderCartList();
  guardarCarrito();
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

//? rendezizar la lista del carrito y sumar precios
//? Esta función se encarga de mostrar los productos en el carrito y calcular el total
//? de la compra. También permite eliminar productos del carrito y enviar el pedido por WhatsApp

function renderCartList() {
  const cartList = document.getElementById("cart-list");
  cartList.innerHTML = "";

  if (cart.length === 0) {
    cartList.innerHTML = "<li>El carrito está vacío.</li>";
    return;
  }

  //? Agrupar productos
  const agrupados = {};
  cart.forEach((item) => {
    if (!agrupados[item.nombre]) {
      agrupados[item.nombre] = { ...item, cantidad: 1 };
    } else {
      agrupados[item.nombre].cantidad += 1;
    }
  });

  let totalProductos = 0;
  const costoEnvio = 50; // ?💸 Puedes ajustar o hacerlo dinámico

  Object.values(agrupados).forEach((item) => {
    const precioUnit = Number(item.precio.replace(/[^0-9.]/g, ""));
    const subtotal = precioUnit * item.cantidad;
    totalProductos += subtotal;

    const li = document.createElement("li");
    li.innerHTML = `
      <span>
        ${item.nombre} 
        <small>$${precioUnit.toFixed(2)} × ${item.cantidad}</small> 
        = <strong>$${subtotal.toFixed(2)}</strong>
      </span>
      <div style="margin-top: 0.5rem;">
        <button class="btn-restar" data-nombre="${item.nombre}">–</button>
        <button class="btn-sumar" data-nombre="${item.nombre}">+</button>
      </div>
    `;
    cartList.appendChild(li);
  });

  //? Linea de subtotal
  const subtotalLi = document.createElement("li");
  subtotalLi.innerHTML = `<span>Subtotal:</span> <span>$${totalProductos.toFixed(
    2
  )}</span>`;
  cartList.appendChild(subtotalLi);

  //? Línea de envío
  const envioLi = document.createElement("li");
  envioLi.innerHTML = `<span>🛵Envío:</span> <span>$${costoEnvio.toFixed(
    2
  )}</span>`;
  cartList.appendChild(envioLi);

  //? Línea de total final
  const totalLi = document.createElement("li");
  totalLi.style.fontWeight = "bold";
  totalLi.style.borderTop = "1px solid #e0e7ef";
  totalLi.style.marginTop = "0.5rem";
  totalLi.innerHTML = `<span>Total:</span> <span>$${(
    totalProductos + costoEnvio
  ).toFixed(2)}</span>`;
  cartList.appendChild(totalLi);

  //? Botones suma y resta
  cartList.querySelectorAll(".btn-sumar").forEach((btn) => {
    btn.addEventListener("click", () => {
      const nombre = btn.getAttribute("data-nombre");
      const producto = cart.find((p) => p.nombre === nombre);
      if (producto) cart.push({ ...producto });
      actualizarCarrito();
      showToast(`Agregaste otra unidad de ${nombre}`);
    });
  });

  cartList.querySelectorAll(".btn-restar").forEach((btn) => {
    btn.addEventListener("click", () => {
      const nombre = btn.getAttribute("data-nombre");
      const idx = cart.findIndex((p) => p.nombre === nombre);
      if (idx !== -1) {
        cart.splice(idx, 1);
        actualizarCarrito();
        showToast(`Quitaste una unidad de ${nombre}`);
      }
    });
  });

  //? Botón de WhatsApp
  const whatsappButton = document.createElement("button");
  whatsappButton.textContent = "Enviar por WhatsApp";
  whatsappButton.style.marginTop = "1rem";
  whatsappButton.classList.add("whatsapp-btn"); //? Agrega una clase para estilos
  whatsappButton.addEventListener("click", enviarCarritoPorWhatsApp);
  cartList.appendChild(whatsappButton);
}

//? Función para enviar el carrito por WhatsApp
//? Esta función agrupa los productos por nombre, calcula subtotales y envía un
//? mensaje formateado a través de la API de WhatsApp.
//? Asegúrate de que el número de WhatsApp sea correcto y esté en formato internacional.
function enviarCarritoPorWhatsApp() {
  if (cart.length === 0) {
    showToast("El carrito está vacío. ¡Agrega productos primero!");
    return;
  }

  //? Agrupar productos
  const productosAgrupados = {};
  cart.forEach((item) => {
    if (!productosAgrupados[item.nombre]) {
      productosAgrupados[item.nombre] = { ...item, cantidad: 1 };
    } else {
      productosAgrupados[item.nombre].cantidad += 1;
    }
  });

  const costoEnvio = 50; // ? Ajustable según tu lógica
  let mensaje = "🧾 *Pedido Armonía Shop-Mila*\n";
  mensaje += "─────────────────────────\n";
  mensaje += "*Producto*     Cant.   Subtotal\n";
  mensaje += "─────────────────────────\n";

  let subtotal = 0;

  Object.values(productosAgrupados).forEach((item) => {
    const precioUnit = Number(item.precio.replace(/[^0-9.]/g, ""));
    const monto = precioUnit * item.cantidad;
    subtotal += monto;

    const nombre = item.nombre.padEnd(16);
    const cantidad = `${item.cantidad}`.padStart(5);
    const precioFinal = `$${monto.toFixed(2)}`.padStart(10);

    mensaje += `${nombre}${cantidad}${precioFinal}\n`;
  });

  mensaje += "─────────────────────────\n";
  mensaje += `Subtotal:           $${subtotal.toFixed(2)}\n`;
  mensaje += `Envío:              $${costoEnvio.toFixed(2)}\n`;
  mensaje += `*TOTAL:*              $${(subtotal + costoEnvio).toFixed(2)}\n`;
  mensaje += "─────────────────────────\n\n";
  mensaje +=
    "Gracias por su preferencia.\nEn un momento le envió los datos para su pago por transferencia\no si lo prefiere en contra entrega\nFavor de enviarnos su Ubicación y Dirección.";

  const url = `https://wa.me/+528139951055?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");

  // 🧹 Vacía el carrito después del envío
  cart.length = 0; // limpia el array sin perder la referencia
  actualizarCarrito(); // vuelve a renderizar el carrito y contador
  showToast("Pedido enviado. El carrito ha sido vaciado.");
}

// 🧱 1. Selecciona el contenedor del modal (donde se mostrará la imagen ampliada)
const modal = document.getElementById("imgModal");

// 🖼️ 2. Selecciona la imagen dentro del modal, que se actualizará dinámicamente
const modalImg = document.getElementById("modal-image");

// ❌ 3. Selecciona el botón de cierre del modal (el ícono ×)
const closeBtn = document.querySelector(".cerrar-modal");

// 🖱️ 4. Escucha clics dentro del contenedor dinámico de productos
document.getElementById("product-grid").addEventListener("click", (e) => {
  // 🔍 5. Verifica si el clic proviene de una imagen dentro de .product-card
  const clickedImg = e.target.closest(".product-card img");

  // 🖼️ 6. Si el clic fue sobre una imagen válida, actualiza el modal y lo muestra
  if (clickedImg) {
    modalImg.src = clickedImg.src; // Copia la ruta de la imagen clickeada
    modal.style.display = "flex"; // Muestra el modal (flex para centrar)
  }
});

// ❌ 7. Cuando se hace clic en el botón de cerrar, oculta el modal
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// 🕵️ 8. También permite cerrar el modal si se hace clic fuera de la imagen (en el fondo)
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

//Dimanismo para el boton hacia arriba
// 1. OBTENER REFERENCIAS A LOS ELEMENTOS
const btnIrArriba = document.getElementById("btn-ir-arriba");

// 2. DETECTAR EL SCROLL EN LA PÁGINA
window.onscroll = function () {
  controlarVisibilidadBoton();
};

function controlarVisibilidadBoton() {
  // Si el scroll vertical es mayor a 20px, muestra el botón. Si no, lo oculta.
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    btnIrArriba.style.display = "block";
  } else {
    btnIrArriba.style.display = "none";
  }
}

// 3. AÑADIR EL EVENTO CLICK AL BOTÓN
btnIrArriba.addEventListener("click", function () {
  irAlInicio();
});

function irAlInicio() {
  // Esta función nos llevará al inicio de la página de forma suave
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
