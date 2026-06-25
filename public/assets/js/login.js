async function login() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { data, error } = await window.supabaseClient.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        alert(error.message + "\n" + "Credenciales incorrectas");
        return;
    }

    window.location.href = "admin.html";
}