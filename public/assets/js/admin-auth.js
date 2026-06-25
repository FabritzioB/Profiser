console.log("🔐 admin guard ejecutando...");

document.documentElement.style.display = "none";

(async () => {

    const { data: { session } } =
        await window.supabaseClient.auth.getSession();

    if (!session) {
        window.location.replace("login.html");
        return;
    }

    const user = session.user;

    const { data: profile, error } = await window.supabaseClient
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (error || !profile) {
        alert("Error de perfil");
        window.location.replace("login.html");
        return;
    }
    
    document.documentElement.style.display = "block";
})();