// Función para verificar si una palabra es un palíndromo
function esPalindromo(texto) {
    // Convertir a minúsculas y eliminar espacios y caracteres especiales
    const textoLimpio = texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
        .replace(/[^a-z0-9]/g, ""); // Eliminar caracteres especiales y espacios

    // Invertir el texto
    const textoInvertido = textoLimpio.split("").reverse().join("");

    // Comparar el texto original con el invertido
    return textoLimpio === textoInvertido;
}

// Función para verificar el palíndromo desde el formulario
function verificarPalindromo() {
    const input = document.getElementById("textoInput");
    const resultado = document.getElementById("resultado");
    const texto = input.value.trim();

    if (texto === "") {
        resultado.textContent = "Por favor, ingresa un texto.";
        resultado.className = "resultado error";
        return;
    }

    const esPali = esPalindromo(texto);

    if (esPali) {
        resultado.textContent = `"${texto}" SÍ es un palíndromo ✓`;
        resultado.className = "resultado exito";
    } else {
        resultado.textContent = `"${texto}" NO es un palíndromo ✗`;
        resultado.className = "resultado error";
    }
}

// Event listener para el botón Enter
document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("textoInput");
    if (input) {
        input.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                verificarPalindromo();
            }
        });
    }
});
