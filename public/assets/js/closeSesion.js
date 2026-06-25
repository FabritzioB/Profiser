console.log("closeSesion.js cargado");

document.addEventListener("DOMContentLoaded", () => {

    const logoutBtn = document.getElementById("logoutBtn");

    logoutBtn.addEventListener("click", async () => {

        console.log("logout click");

        await window.supabaseClient.auth.signOut({ scope: "global" });

        localStorage.clear();
        sessionStorage.clear();

        window.location.replace("login.html");
    });

    // INACTIVIDAD
    let idleTime;
    const LIMIT = 5 * 60 * 1000;

    function reset() {
        clearTimeout(idleTime);

        idleTime = setTimeout(async () => {

            await window.supabaseClient.auth.signOut({ scope: "global" });

            localStorage.clear();
            sessionStorage.clear();

            alert("Sesión cerrada por inactividad");

            window.location.replace("login.html");

        }, LIMIT);
    }

    window.addEventListener("mousemove", reset);
    window.addEventListener("keydown", reset);
    window.addEventListener("click", reset);
    window.addEventListener("scroll", reset);

    reset();
});