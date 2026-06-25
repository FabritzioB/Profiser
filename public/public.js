window.onload = function() {
    window.scrollTo(0, 0);
};

async function sendMessage() {

    const input = document.getElementById("input");
    const message = input.value;

    // mostrar mensaje usuario
    document.getElementById("messages").innerHTML += `
        <div class="user-message">
            ${message}
        </div>
    `;

    const res = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message
        })
    });

    const data = await res.json();

    // mostrar respuesta bot
    document.getElementById("messages").innerHTML += `
        <div class="bot-message">
            ${data.reply}
        </div>
    `;

    input.value = "";
}

// ABRIR / CERRAR CHAT

const chatToggle = document.getElementById("chat-toggle");
const chatBox = document.getElementById("chat-box");

chatToggle.addEventListener("click", () => {

    if (chatBox.style.display === "flex") {
        chatBox.style.display = "none";
    }
    else {
        chatBox.style.display = "flex";
    }

});
