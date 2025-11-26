// Lógica de la calculadora básica
const display = document.getElementById('display');
let displayValue = '0';
let firstOperand = null;
let waitingForSecondOperand = false;
let operator = null;
let memoryValue = 0;

function updateDisplay() {
  display.textContent = displayValue;
}

function inputDigit(digit) {
  if (waitingForSecondOperand) {
    displayValue = digit;
    waitingForSecondOperand = false;
  } else {
    displayValue = displayValue === '0' ? digit : displayValue + digit;
  }
}

function inputDot() {
  if (waitingForSecondOperand) {
    displayValue = '0.';
    waitingForSecondOperand = false;
    return;
  }
  if (!displayValue.includes('.')) {
    displayValue += '.';
  }
}

function clearAll() {
  displayValue = '0';
  firstOperand = null;
  waitingForSecondOperand = false;
  operator = null;
}

function toggleSign() {
  if (displayValue === '0') return;
  displayValue = displayValue.charAt(0) === '-' ? displayValue.slice(1) : '-' + displayValue;
}

function percent() {
  const value = parseFloat(displayValue);
  if (isNaN(value)) return;
  displayValue = String(value / 100);
}

function applyUnary(action) {
  const x = parseFloat(displayValue);
  if (isNaN(x)) return;
  let res;
  switch(action) {
    case 'sqrt':
      if (x < 0) { displayValue = 'Error'; return; }
      res = Math.sqrt(x); break;
    case 'ln':
      if (x <= 0) { displayValue = 'Error'; return; }
      res = Math.log(x); break;
    case 'log':
      if (x <= 0) { displayValue = 'Error'; return; }
      res = Math.log10 ? Math.log10(x) : Math.log(x)/Math.LN10; break;
    case 'sin': res = Math.sin(x); break;
    case 'cos': res = Math.cos(x); break;
    case 'tan': res = Math.tan(x); break;
    case 'sq': res = x * x; break;
    case 'cube': res = x * x * x; break;
    case 'inv':
      if (x === 0) { displayValue = 'Error'; return; }
      res = 1 / x; break;
    case 'exp': res = Math.exp(x); break;
    case 'pi': res = Math.PI; break;
    case 'e': res = Math.E; break;
    case 'fact':
      if (x < 0 || !Number.isInteger(x)) { displayValue = 'Error'; return; }
      res = factorial(x); break;
    default: return;
  }
  if (Number.isFinite(res)) res = Math.round((res + Number.EPSILON) * 1000000000) / 1000000000;
  displayValue = String(res);
}

function factorial(n) {
  if (n === 0 || n === 1) return 1;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function handleOperator(nextOperator) {
  const inputValue = parseFloat(displayValue);

  if (operator && waitingForSecondOperand) {
    operator = nextOperator;
    return;
  }

  if (firstOperand == null && !isNaN(inputValue)) {
    firstOperand = inputValue;
  } else if (operator) {
    const result = calculate(firstOperand, inputValue, operator);
    displayValue = String(result);
    firstOperand = result;
  }

  waitingForSecondOperand = true;
  operator = nextOperator;
}

function calculate(a, b, op) {
  let res = 0;
  switch(op) {
    case '+': res = a + b; break;
    case '-': res = a - b; break;
    case '*': res = a * b; break;
    case '^': res = Math.pow(a, b); break;
    case '%':
      if (b === 0) return 'Error';
      res = a % b; break;
    case '/':
      if (b === 0) return 'Error';
      res = a / b; break;
    default: return b;
  }
  // Limitar decimales para evitar floats largos
  if (Number.isFinite(res)) {
    res = Math.round((res + Number.EPSILON) * 1000000000) / 1000000000;
  }
  return res;
}

// Delegación de eventos en los botones
const keys = document.querySelector('.keys');
keys.addEventListener('click', (event) => {
  const target = event.target;
  if (!target.matches('button')) return;

  if (target.dataset.digit) {
    const d = target.dataset.digit;
    if (d === '.') inputDot(); else inputDigit(d);
    updateDisplay();
    return;
  }

  const action = target.dataset.action;
  switch(action) {
    case 'bg-toggle':
      toggleBackground();
      updateDisplay();
      break;
    case 'clear':
      clearAll();
      updateDisplay();
      break;
    case 'posneg':
      toggleSign();
      updateDisplay();
      break;
    case 'percent':
      percent();
      updateDisplay();
      break;
      case 'c2f':
        convertTemp('c2f');
        updateDisplay();
        break;
      case 'f2c':
        convertTemp('f2c');
        updateDisplay();
        break;
    case 'backspace':
      deleteDigit();
      updateDisplay();
      break;
    case 'sin':
    case 'cos':
    case 'tan':
    case 'ln':
    case 'log':
    case 'sqrt':
    case 'sq':
    case 'cube':
    case 'fact':
    case 'pi':
    case 'e':
    case 'inv':
    case 'exp':
      applyUnary(action);
      updateDisplay();
      break;
    case '=':
      handleOperator(null);
      operator = null;
      waitingForSecondOperand = false;
      firstOperand = null;
      updateDisplay();
      break;
    case 'pow':
    case 'pow2':
      // usar ^ como operador binario
      handleOperator('^');
      updateDisplay();
      break;
    case 'mod':
      handleOperator('%');
      updateDisplay();
      break;
    case '+':
      handleOperator(action);
      updateDisplay();
      break;
    case '-':
      // Si la pantalla está en 0 o estamos esperando el segundo operando,
      // iniciar la entrada de un número negativo en lugar de tratarlo como operador.
      if (displayValue === '0' || waitingForSecondOperand) {
        displayValue = '-';
        waitingForSecondOperand = false;
        updateDisplay();
      } else {
        handleOperator('-');
        updateDisplay();
      }
      break;
    case '*':
    case '/':
      handleOperator(action);
      updateDisplay();
      break;
    default:
      break;
  }
});

// Inicializar visual
updateDisplay();

// --- Soporte para teclado ---
function deleteDigit() {
  if (waitingForSecondOperand) return;
  // Si solo hay un caracter (o '-x'), volver a 0
  if (displayValue.length === 1 || (displayValue.length === 2 && displayValue.startsWith('-'))) {
    displayValue = '0';
  } else {
    displayValue = displayValue.slice(0, -1);
  }
}

function handleKeyDown(event) {
  const key = event.key;

  // Dígitos
  if (/^[0-9]$/.test(key)) {
    inputDigit(key);
    updateDisplay();
    return;
  }

  // Punto decimal
  if (key === '.') {
    inputDot();
    updateDisplay();
    return;
  }

  // Operadores básicos (permitir '-' como signo negativo al inicio o cuando se espera el segundo operando)
  if (key === '-') {
    // si estamos en inicio (pantalla 0) o esperando segundo operando, iniciar número negativo
    if (displayValue === '0' || waitingForSecondOperand) {
      displayValue = '-';
      waitingForSecondOperand = false;
      updateDisplay();
      return;
    }
    // en cualquier otro caso, es operador resta
    handleOperator('-');
    updateDisplay();
    return;
  }

  if (key === '+' || key === '*' || key === '/' || key === '^' || key === '%') {
    handleOperator(key === '^' ? '^' : key);
    updateDisplay();
    return;
  }

  // Igual / Enter
  if (key === 'Enter' || key === '=') {
    // Ejecutar cálculo final
    handleOperator(null);
    operator = null;
    waitingForSecondOperand = false;
    firstOperand = null;
    updateDisplay();
    return;
  }

  // Backspace -> borrar último dígito
  if (key === 'Backspace') {
    deleteDigit();
    updateDisplay();
    return;
  }

  // Escape o tecla c -> limpiar
  if (key === 'Escape' || key.toLowerCase() === 'c') {
    clearAll();
    updateDisplay();
    return;
  }

  // Porcentaje
  if (key === '%') {
    // si se presiona % se aplica como porcentaje (unario)
    percent();
    updateDisplay();
    return;
  }

  // n -> cambiar signo (opcional)
  if (key === 'n' || key === 'N') {
    toggleSign();
    updateDisplay();
    return;
  }
}

window.addEventListener('keydown', handleKeyDown);

// --- Control de fondo ---
function toggleBackground() {
  const body = document.body;
  const btn = document.querySelector('[data-action="bg-toggle"]');
  if (!btn) return;
  const isOff = body.classList.toggle('no-bg');
  btn.textContent = isOff ? 'Fondo: Off' : 'Fondo: On';
}

// Tecla rápida: 'b' para cambiar fondo on/off
window.addEventListener('keydown', (e) => {
  if (e.key === 'b' || e.key === 'B') {
    toggleBackground();
  }
});

// --- Conversión Celsius/Fahrenheit ---
function formatNumber(n) {
  // Limitar a 6 decimales y quitar ceros finales
  if (!Number.isFinite(n)) return String(n);
  const s = Number(Math.round((n + Number.EPSILON) * 1000000) / 1000000).toString();
  return s;
}

function convertTemp(action) {
  const x = parseFloat(displayValue);
  if (isNaN(x)) return;
  let res;
  if (action === 'c2f') {
    // C -> F
    res = (x * 9 / 5) + 32;
  } else if (action === 'f2c') {
    // F -> C
    res = (x - 32) * 5 / 9;
  } else return;
  displayValue = formatNumber(res);
}

// --- Wallpapers (varios paisajes realistas) ---
// Usar imágenes locales en `calculadora/assets/`. Ejecuta el script `download_wallpapers.ps1` para descargarlas.
const wallpaperURLs = {
  mountains: 'assets/mountains.jpg',
  beach: 'assets/beach.jpg',
  forest: 'assets/forest.jpg',
  night: 'assets/night.jpg'
};

function setWallpaper(name, save = true) {
  const body = document.body;
  const select = document.getElementById('bg-select');
  const layer = document.getElementById('bg-layer');
  if (!select || !layer) return;

  // Detener animaciones previas
  stopBeachAnimation();
  stopNightAnimation();
  layer.classList.remove('beach','night');

  if (name === 'sunset') {
    // usar SVG embebido en body (por defecto)
    layer.style.backgroundImage = '';
    body.style.backgroundImage = '';
  } else if (wallpaperURLs[name]) {
    // aplicar imagen al layer para permitir animaciones encima
    layer.style.backgroundImage = `url('${wallpaperURLs[name]}')`;
    layer.style.backgroundSize = 'cover';
    layer.style.backgroundPosition = 'center';
  }

  // Activar animaciones específicas según el fondo
  if (name === 'beach') {
    layer.classList.add('beach');
    startBeachAnimation();
  } else if (name === 'night') {
    layer.classList.add('night');
    startNightAnimation();
  }

  select.value = name;
  if (save) localStorage.setItem('calculator_bg', name);
}

// Escuchar cambios en el selector
const bgSelect = document.getElementById('bg-select');
if (bgSelect) {
  bgSelect.addEventListener('change', (e) => {
    const name = e.target.value;
    // si estaba desactivado, volver a activar fondo al elegir uno
    if (document.body.classList.contains('no-bg')) document.body.classList.remove('no-bg');
    setWallpaper(name);
    localStorage.setItem('calculator_bg_on', '1');
  });
}

// Guardar estado de bg al togglear
function toggleBackground() {
  const body = document.body;
  const btn = document.querySelector('[data-action="bg-toggle"]');
  if (!btn) return;
  const isOff = body.classList.toggle('no-bg');
  btn.textContent = isOff ? 'Fondo: Off' : 'Fondo: On';
  localStorage.setItem('calculator_bg_on', isOff ? '0' : '1');
}

// Cargar preferencia al inicio
function loadBackgroundPreference() {
  const saved = localStorage.getItem('calculator_bg') || 'sunset';
  const on = localStorage.getItem('calculator_bg_on');
  if (on === '0') document.body.classList.add('no-bg'); else document.body.classList.remove('no-bg');
  setWallpaper(saved, false);
  // actualizar texto del botón
  const btn = document.querySelector('[data-action="bg-toggle"]');
  if (btn) btn.textContent = document.body.classList.contains('no-bg') ? 'Fondo: Off' : 'Fondo: On';
}

// Ejecutar carga de preferencias
loadBackgroundPreference();

// --- Animaciones y rotación automática de fondos ---
let beachAnimInterval = null;
function startBeachAnimation() {
  const layer = document.getElementById('bg-layer');
  if (!layer) return;
  // movimiento sutil lateral
  layer.style.transition = 'transform 12s linear';
  let dir = 0;
  beachAnimInterval = setInterval(() => {
    dir = dir === 0 ? 1 : 0;
    layer.style.transform = dir ? 'translateX(8px) scale(1.01)' : 'translateX(-8px) scale(1)';
  }, 6000);
}
function stopBeachAnimation() {
  const layer = document.getElementById('bg-layer');
  if (beachAnimInterval) { clearInterval(beachAnimInterval); beachAnimInterval = null; }
  if (layer) { layer.style.transform = ''; layer.style.transition = ''; }
}

let nightStarsInterval = null;
function startNightAnimation() {
  const layer = document.getElementById('bg-layer');
  if (!layer) return;
  // generar estrellas fugaces con intervalos aleatorios
  nightStarsInterval = setInterval(() => {
    createShootingStar(layer);
  }, 1200 + Math.random() * 1800);
}
function stopNightAnimation() {
  if (nightStarsInterval) { clearInterval(nightStarsInterval); nightStarsInterval = null; }
}

function createShootingStar(container) {
  const star = document.createElement('div');
  star.className = 'shooting-star';
  const startX = container.clientWidth * (0.6 + Math.random() * 0.35);
  const startY = container.clientHeight * (0.05 + Math.random() * 0.35);
  star.style.left = `${startX}px`;
  star.style.top = `${startY}px`;
  const angle = -20 - Math.random() * 40;
  star.style.transform = `rotate(${angle}deg)`;
  container.appendChild(star);
  setTimeout(() => { star.remove(); }, 1400);
}

// Rotación automática de fondos (no quita las opciones; reinicia en selección manual)
const autoBackgrounds = ['sunset','mountains','beach','forest','night'];
let autoIndex = autoBackgrounds.indexOf(localStorage.getItem('calculator_bg') || 'sunset');
let autoTimer = null;
function startAutoRotate(intervalMs = 12000) {
  stopAutoRotate();
  autoTimer = setInterval(() => {
    autoIndex = (autoIndex + 1) % autoBackgrounds.length;
    const next = autoBackgrounds[autoIndex];
    // solo cambiar si el usuario no ha desactivado el fondo
    if (document.body.classList.contains('no-bg')) return;
    setWallpaper(next);
  }, intervalMs);
}
function stopAutoRotate() { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } }

// iniciar rotación automática
startAutoRotate(12000);

// Reiniciar rotación cuando el usuario elige un fondo
const bgSelect2 = document.getElementById('bg-select');
if (bgSelect2) bgSelect2.addEventListener('change', () => { autoIndex = autoBackgrounds.indexOf(bgSelect2.value); stopAutoRotate(); startAutoRotate(12000); });