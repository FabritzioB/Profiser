const menuToggle = document.getElementById("menu-toggle");
const lateral = document.querySelector(".nav-lateral");

menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    lateral.classList.toggle("active");
});

lateral.addEventListener("click", (e) => {
    e.stopPropagation();
});

document.addEventListener("click", () => {
    lateral.classList.remove("active");
});