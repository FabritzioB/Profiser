const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

let productoActual = null;

async function obtenerProducto() {
    const { data, error } = await window.supabaseClient
        .from("productos")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error cargando producto:", error);
        return null;
    }

    return data;
}

async function cargarProducto() {
    const producto = await obtenerProducto();

    if (!producto) return;

    productoActual = producto;

    document.getElementById("product-image").src = producto.imagen;
    document.getElementById("product-title").textContent = producto.nombre;
    document.getElementById("product-description").textContent = producto.descripcion;
    document.getElementById("product-description-long").textContent = producto.descripcionLarga;
    document.getElementById("product-price").textContent = `S/ ${producto.precio}`;

    document.getElementById("material").textContent = producto.material;
    document.getElementById("color").textContent = producto.color;
    document.getElementById("medidas").textContent = producto.medidas;

    // TAGS
    const tagsContainer = document.getElementById("product-tags");
    tagsContainer.innerHTML = "";

    const tags = Array.isArray(producto.etiqueta)
        ? producto.etiqueta
        : [];

    tags.forEach(tag => {
        const span = document.createElement("span");
        span.classList.add("product-tag");
        span.textContent = `#${tag}`;
        tagsContainer.appendChild(span);
    });
}

let cantidadSeleccionada = 1;
const quantityValue = document.getElementById("quantity-value");

document.getElementById("plus-btn").addEventListener("click", () => {
    cantidadSeleccionada++;
    quantityValue.textContent = cantidadSeleccionada;
});

document.getElementById("minus-btn").addEventListener("click", () => {
    if (cantidadSeleccionada > 1) {
        cantidadSeleccionada--;
        quantityValue.textContent = cantidadSeleccionada;
    }
});

const btnCart = document.getElementById("add-to-cart");

btnCart.addEventListener("click", () => {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const existente = carrito.find(item => item.id == productoActual.id);

    if (existente) {
        existente.cantidad += cantidadSeleccionada;
    } else {
        carrito.push({
            id: productoActual.id,
            cantidad: cantidadSeleccionada
        });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));

    alert("Producto agregado al carrito");
});

cargarProducto();