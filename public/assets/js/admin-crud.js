let categoriaActual = "all";
let ordenActual = "default";

const productsContainer = document.getElementById("products");

async function obtenerProductos() {
    const url = window.SUPABASE_URL;
    console.log("🔥 SUPABASE URL:", url);

    const { data, error } = await window.supabaseClient
        .from("productos")
        .select("*");

    return data;
}

async function subirImagen(file) {
    const fileName = `${Date.now()}-${file.name}`;

    const { data, error } = await window.supabaseClient
        .storage
        .from("productos")
        .upload(fileName, file);

    if (error) {
        console.error("Error subiendo imagen:", error);
        return null;
    }

    const { data: urlData } = window.supabaseClient
        .storage
        .from("productos")
        .getPublicUrl(fileName);

    return urlData.publicUrl;
}

async function renderizarProductos() {
    try {
        const container = document.getElementById("products");
        container.innerHTML = "";

        let productos = await obtenerProductos();
        let productosFiltrados = productos || [];

        console.log("PRODUCTOS:", productosFiltrados);

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
                    <h3>${producto.nombre}</h3>
                    <p>S/ ${producto.precio}</p>

                    <button class="btn-edit">Editar</button>
                    <button class="btn-inspect">Ver en Catálogo</button>
                    <button class="btn-delete">Eliminar</button>
                </div>
            `;

            // 🔥 EVENTOS (IMPORTANTÍSIMO)
            card.querySelector(".btn-edit").addEventListener("click", (e) => {
                e.stopPropagation();
                editarProducto(producto);
            });

            card.querySelector(".btn-inspect").addEventListener("click", (e) => {
                e.stopPropagation();
                window.open(`product-details.html?id=${producto.id}`, "_blank");
            });

            card.querySelector(".btn-delete").addEventListener("click", async (e) => {
                e.stopPropagation();

                const ok = confirm("¿Eliminar producto?");
                if (!ok) return;

                const { data, error } = await window.supabaseClient
                    .from("productos")
                    .delete()
                    .eq("id", producto.id)
                    .select();

                if (error || !data?.length) {
                    alert("❌ No tienes permisos para eliminar este producto");
                    return;
                }

                renderizarProductos();
            });

            container.appendChild(card);
        });

        console.log("FIN RENDER OK");

    } catch (err) {
        console.error("🔥 ERROR EN RENDER:", err);
    }
}

async function guardar() {

    const name = document.getElementById("name").value;
    const desc = document.getElementById("desc").value;
    const descLarge = document.getElementById("descLarge").value;
    const labels = document.getElementById("labels").value;
    const material = document.getElementById("material").value;
    const measures = document.getElementById("measures").value;
    const color = document.getElementById("color").value;
    const price = parseFloat(document.getElementById("price").value);

    let imageUrl = null;

    const fileInput = document.getElementById("image");
    const file = fileInput.files[0];

    // 👉 SOLO si hay nueva imagen, se sube
    if (file) {
        const fileName = `${Date.now()}-${file.name}`;

        const { error: uploadError } = await window.supabaseClient
            .storage
            .from("productos")
            .upload(fileName, file);

        if (uploadError) {
            console.error(uploadError);
            return;
        }

        const { data } = window.supabaseClient
            .storage
            .from("productos")
            .getPublicUrl(fileName);

        imageUrl = data.publicUrl;
    }

    const producto = {
        nombre: document.getElementById("name").value,
        descripcion: document.getElementById("desc").value,
        descripcionLarga: document.getElementById("descLarge").value,
        etiqueta: document.getElementById("labels").value,
        material: document.getElementById("material").value,
        medidas: document.getElementById("measures").value,
        color: document.getElementById("color").value,
        precio: parseFloat(document.getElementById("price").value),
        imagen: imageUrl || window.currentImage
    };



    if (window.editingId) {
        const { data, error } = await window.supabaseClient
            .from("productos")
            .update(producto)
            .eq("id", window.editingId)
            .select();

        console.log("UPDATE RESULT:", { data, error });

        if (error) {
            alert("❌ No tienes permisos para editar productos");
            return;
        }

        if (!data || data.length === 0) {
            alert("❌ No tienes permisos para editar productos");
            return;
        }

        alert("✅ Producto editado correctamente");
        window.editingId = null;
    } else {
        const inicio = performance.now();

        const { error } = await window.supabaseClient
            .from("productos")
            .insert([producto]);

        if (error) {
            alert("❌ No tienes permisos para crear productos");
            console.log(error.message);
            return;
        }

        const fin = performance.now();

        console.log(
            `💾 Producto guardado en ${(fin - inicio).toFixed(2)} ms`
        );
    }

    limpiar();
    renderizarProductos();
}

function limpiar() {
    document.querySelectorAll(".crud input").forEach(i => i.value = "");
    window.editingId = null;
}

function editarProducto(producto) {
    document.querySelector("input[placeholder='Nombre del producto']").value = producto.nombre;
    document.querySelector("input[placeholder='Descripción']").value = producto.descripcion;
    document.querySelector("input[placeholder='Descripción larga del producto']").value = producto.descripcionLarga;
    document.querySelector("input[placeholder='Etiquetas']").value = Array.isArray(producto.etiqueta) ? producto.etiqueta.join(", ") : producto.etiqueta || "";
    document.querySelector("input[placeholder='Material']").value = producto.material;
    document.querySelector("input[placeholder='Medidas']").value = producto.medidas;
    document.querySelector("input[placeholder='Color']").value = producto.color;
    document.querySelector("input[placeholder='Precio']").value = producto.precio;

    window.currentImage = producto.imagen;
    window.editingId = producto.id;
}

window.addEventListener("load", async () => {
    await renderizarProductos();
});