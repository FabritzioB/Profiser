let productosCache = []

async function obtenerProductos() {
    const { data, error } = await window.supabaseClient
        .from("productos")
        .select("*");

    if (error) {
        console.error(error);
        return [];
    }

    return data;
}

async function renderCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const container = document.getElementById("cart-items");

    container.innerHTML = "";

    let total = 0;

    productosCache = await obtenerProductos();

    if (carrito.length === 0) {
        container.innerHTML = "<p>Tu carrito está vacío.</p>";
        document.getElementById("cart-total").textContent = "S/ 0.00";
        return;
    }

    carrito.forEach(item => {
        const producto = productosCache.find(p => p.id === item.id);

        if (!producto) return;

        total += producto.precio * item.cantidad;

        const card = document.createElement("div");
        card.classList.add("cart-item");

        card.innerHTML = `
            <img class="cart-item-image" src="${producto.imagen}" alt="${producto.nombre}">

            <div class="cart-item-info">
                <h3>${producto.nombre}</h3>
                <p>S/ ${producto.precio.toFixed(2)}</p>
                <p>Cant: ${item.cantidad}</p>
            </div>

            <button class="remove-btn" data-id="${producto.id}">
                Eliminar
            </button>
        `;

        container.appendChild(card);
    });

    document.getElementById("cart-total").textContent =
        `S/ ${total.toFixed(2)}`;

    activarBotonesEliminar();
}

function activarBotonesEliminar() {
    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = Number(btn.dataset.id);

            let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

            carrito = carrito.filter(item => item.id !== id);

            localStorage.setItem("carrito", JSON.stringify(carrito));

            renderCarrito();
        });
    });
}

const btnWhatsapp = document.getElementById("btn-whatsapp");

btnWhatsapp.addEventListener("click", () => {
    let total = 0;
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    if (carrito.length === 0) {
        alert("Tu carrito está vacío");
        return;
    }

    let mensaje = "Hola Profiser!%0A%0AQuiero comprar:%0A";

    carrito.forEach(item => {
        const producto = productosCache.find(p => p.id === item.id);

        if (producto) {
            const subtotal = producto.precio * item.cantidad;
            total += subtotal;
            mensaje += `• ${item.cantidad} ${producto.nombre}%0A`;
        }
    });

    mensaje += `%0ATotal: S/ ${total.toFixed(2)}`;

    const telefono = "51982202085";

    window.open(
        `https://wa.me/${telefono}?text=${mensaje}`,
        "_blank"
    );
});

document.addEventListener("DOMContentLoaded", () => {
    renderCarrito();
});