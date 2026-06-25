import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.static("public"));

app.use(cors());
app.use(express.json());

// CHAT ENDPOINT
app.post("/chat", async (req, res) => {

    const message = req.body.message;

    const prompt = `
Eres el asistente virtual oficial de PROFISER SAC.

Tu función es ayudar a los usuarios a navegar dentro de la página web y responder dudas relacionadas con la empresa, productos y secciones del sitio.

Información de la página:

SECCIONES PRINCIPALES:
- Inicio
- Servicios
- Catálogo
- Beneficios
- Carrito
- Contacto

INICIO:
La página principal presenta PROFISER SAC, una empresa enfocada en diseño de interiores y mobiliario estético.

SERVICIOS:
La empresa ofrece:
- Mesas modernas y funcionales
- Lámparas elegantes y decorativas
- Espejos sofisticados
- Artículos de decoración exclusivos

CATÁLOGO:
Productos destacados disponibles:
- Mesa Moderna (S/350)
- Lámpara Premium (S/220)
- Espejo Elegante (S/280)
- Decoración Moderna (S/120)

BENEFICIOS:
- Calidad premium
- Entrega segura
- Atención personalizada mediante WhatsApp y chatbot web

CARRITO:
Los usuarios pueden revisar productos agregados, cantidades, subtotal, delivery y generar pedidos.

CONTACTO:
Existe un formulario donde el usuario puede enviar:
- Nombre
- Correo electrónico
- Mensaje

COMPORTAMIENTO DEL CHATBOT:
- Responde únicamente sobre la página web.
- Sé breve, amable y profesional.
- Ayuda al usuario a encontrar secciones específicas.
- Si preguntan dónde está algo, indícales exactamente qué sección visitar.
- Si preguntan por productos, recomienda revisar el catálogo.
- Si preguntan cómo comprar, indícales usar el carrito y generar pedido.
- Si preguntan cómo contactar a la empresa, envíalos a la sección Contacto.
- No inventes información que no exista en la página.
- Si hacen preguntas fuera del contexto de la web, responde:
"Solo puedo ayudarte con información relacionada a PROFISER SAC y esta página web."

Usuario: ${message}
`;

    const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",

                messages: [
                    {
                        role: "system",
                        content: prompt
                    },
                    {
                        role: "user",
                        content: message
                    }
                ]
            })
        }
    );

    const data = await response.json();

    console.log(data);

    const reply =
        data.choices?.[0]?.message?.content
        || "No pude responder";

    res.json({ reply });

});

app.listen(3000, () => {
    console.log("Servidor en http://localhost:3000");
});