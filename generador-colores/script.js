// script.js — Generador de Colores Aleatorios (JavaScript vanilla)

// Selección de elementos del DOM
const colorDisplay = document.getElementById('colorDisplay');
const colorCodeEl = document.getElementById('colorCode');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const feedbackEl = document.getElementById('feedback');

// Función: Genera un color hexadecimal aleatorio en formato #RRGGBB
// Devuelve una cadena, p. ej. "#1a2b3c"
function generarHexAleatorio() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  // Convertir a hexadecimal y rellenar con ceros si hace falta
  const hex = '#' + [r, g, b].map(n => n.toString(16).padStart(2, '0')).join('');
  return hex.toUpperCase();
}

// Función: Calcula contraste aproximado para decidir el color del texto (blanco/negro)
// Recibe un color hex y devuelve '#000000' o '#FFFFFF'
function colorContraste(hex) {
  // Quitar la almohadilla
  const h = hex.replace('#','');
  const r = parseInt(h.substring(0,2),16);
  const g = parseInt(h.substring(2,4),16);
  const b = parseInt(h.substring(4,6),16);
  // Calcular luminancia relativa
  const luminance = (0.2126*r + 0.7152*g + 0.0722*b) / 255;
  return luminance > 0.6 ? '#000000' : '#FFFFFF';
}

// Función: Actualiza la UI con el color proporcionado
// Cambia el fondo del div, actualiza el texto del código y ajusta contraste
function aplicarColor(hex) {
  colorDisplay.style.backgroundColor = hex;
  colorCodeEl.textContent = hex;
  const texto = colorContraste(hex);
  colorCodeEl.style.color = texto;
  copyBtn.style.color = texto;
}

// Función: Generar y aplicar un nuevo color (invocada al hacer clic)
function generarYAplicar() {
  const nuevo = generarHexAleatorio();
  aplicarColor(nuevo);
  mostrarFeedback('Color generado: ' + nuevo, 1200);
}

// Función: Copia el código al portapapeles y muestra confirmación visual
async function copiarAlPortapapeles() {
  const texto = colorCodeEl.textContent.trim();
  try {
    // Intento moderno
    await navigator.clipboard.writeText(texto);
    // Feedback visual en el botón
    const prev = copyBtn.textContent;
    copyBtn.textContent = 'Copiado!';
    copyBtn.disabled = true;
    setTimeout(() => { copyBtn.textContent = prev; copyBtn.disabled = false; }, 1200);
    mostrarFeedback('Código copiado al portapapeles', 1200);
  } catch (err) {
    // Fallback para navegadores antiguos: crear textarea temporal
    try {
      const textarea = document.createElement('textarea');
      textarea.value = texto;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
      mostrarFeedback('Código copiado (fallback)', 1200);
    } catch (err2) {
      mostrarFeedback('No se pudo copiar automáticamente. Selecciona y copia manualmente.', 2500);
    }
  }
}

// Función: Muestra un mensaje breve en el área de feedback
// mensaje: texto a mostrar, dur(ms): duración en milisegundos
function mostrarFeedback(mensaje, dur = 1000) {
  feedbackEl.textContent = mensaje;
  feedbackEl.style.opacity = '1';
  setTimeout(() => { feedbackEl.style.opacity = '0'; feedbackEl.textContent = ''; }, dur);
}

// Eventos
generateBtn.addEventListener('click', generarYAplicar);
copyBtn.addEventListener('click', copiarAlPortapapeles);

// Generar un color inicial al cargar la página
window.addEventListener('DOMContentLoaded', () => {
  const inicial = generarHexAleatorio();
  aplicarColor(inicial);
});