function toggleChat() {
    var chat = document.getElementById("chatBox");

    if (chat.style.display === "block") {
        chat.style.display = "none"; 

    } else {
        chat.style.display = "block";
    }
}