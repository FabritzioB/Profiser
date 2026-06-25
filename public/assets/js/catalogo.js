const inicioCarga = performance.now();
let categoriaActual = "all";
let ordenActual = "default";

const productsContainer = document.getElementById("products");

async function obtenerProductos() {
    const inicio = performance.now();

    const { data, error } = await window.supabaseClient
        .from("productos")
        .select("*");

    console.log("🟢 DATA:", data);
    console.log("🔴 ERROR:", error);

    const fin = performance.now();

    console.log(
        `📖 Lectura de ${data?.length || 0} productos en ${(fin - inicio).toFixed(2)} ms`
    );

    return data || [];
}

async function renderizarProductos() {
    const container = document.getElementById("products");
    container.innerHTML = "";

    let productos = await obtenerProductos();
    let productosFiltrados = productos ? [...productos] : [];

    if (categoriaActual !== "all") {
        productosFiltrados = productosFiltrados.filter(p =>
            (p.etiqueta || "").includes(categoriaActual)
        );
    }

    if (ordenActual === "asc") {
        productosFiltrados.sort((a, b) => a.precio - b.precio);
    } else if (ordenActual === "desc") {
        productosFiltrados.sort((a, b) => b.precio - a.precio);
    }

    productosFiltrados.forEach(producto => {
        const card = document.createElement("div");
        card.classList.add("product");

        const tags = Array.isArray(producto.etiqueta)
            ? producto.etiqueta
            : (producto.etiqueta || "").split(/[\s,]+/);

        const tagsHTML = tags
            .filter(Boolean)
            .map(tag => `#${tag}`)
            .join(" ");

        card.innerHTML = `
            <img src="${producto.imagen}" class="product-img">
            <div class="product-info">
                <span class="product-category">${tagsHTML}</span>
                <h3 class="product-name">${producto.nombre}</h3>
                <p class="product-price">S/ ${producto.precio}</p>
                <button class="product-btn">Ver detalles</button>
            </div>
        `;

        card.addEventListener("click", () => {
            window.location.href = `product-details.html?id=${producto.id}`;
        });

        container.appendChild(card);
        console.log(`⏱️ Página cargada en ${(performance.now() - inicioCarga).toFixed(2)} ms` + ` Carga total: ${performance.now().toFixed(2)} ms`);
    });
}

document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll("#category-select .option").forEach(option => {
        option.addEventListener("click", () => {
            categoriaActual = option.dataset.value;
            renderizarProductos();
        });
    });

    document.querySelectorAll("#price-select .option").forEach(option => {
        option.addEventListener("click", () => {
            ordenActual = option.dataset.value;
            renderizarProductos();
        });
    });

    renderizarProductos();
});