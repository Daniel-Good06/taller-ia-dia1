// ========================================
// CONFIGURACIÓN Y VARIABLES GLOBALES
// ========================================

// Objeto para almacenar el estado de la alarma
const alarmaConfig = {
    activa: false,
    hora: null,
    sonandoActualmente: false
};

// Variable para almacenar el intervalo del reloj
let intervaloReloj = null;

// Modo de 24 horas (por defecto)
let modo24h = true;

// ========================================
// MESES EN ESPAÑOL
// ========================================

const mesesEspanol = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];

// ========================================
// DÍAS EN ESPAÑOL
// ========================================

const diasEspanol = [
    'domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'
];

// ========================================
// ELEMENTOS DEL DOM
// ========================================

const elementosDOM = {
    hora: document.getElementById('hora'),
    minuto: document.getElementById('minuto'),
    segundo: document.getElementById('segundo'),
    fecha: document.getElementById('fecha'),
    saludo: document.getElementById('saludo'),
    horaAlarma: document.getElementById('horaAlarma'),
    establecerAlarma: document.getElementById('establecerAlarma'),
    cancelarAlarma: document.getElementById('cancelarAlarma'),
    statusMessage: document.getElementById('statusMessage'),
    alarmStatus: document.getElementById('alarmStatus'),
    notificacion: document.getElementById('notificacion'),
    alarmTime: document.getElementById('alarmTime'),
    detenerAlarma: document.getElementById('detenerAlarma'),
    botonModo: document.getElementById('botonModo')
};

// ========================================
// FUNCIÓN: Formatear número con ceros a la izquierda
// Parámetro: num (número a formatear)
// Retorna: string con el número formateado (ej: "05")
// ========================================

function formatearNumero(num) {
    return num < 10 ? '0' + num : num;
}

// ========================================
// FUNCIÓN: Obtener saludo según la hora del día
// Parámetro: hora (número de 0 a 23)
// Retorna: string con el saludo apropiado
// ========================================

function obtenerSaludo(hora) {
    if (hora >= 5 && hora < 12) {
        return 'Buenos días';
    } else if (hora >= 12 && hora < 18) {
        return 'Buenas tardes';
    } else if (hora >= 18 && hora < 24) {
        return 'Buenas noches';
    } else {
        return 'Buenas noches'; // De 0 a 4 am
    }
}

// ========================================
// FUNCIÓN: Convertir hora a formato 12h o 24h
// Parámetro: hora (número de 0 a 23)
// Retorna: objeto con { hora, periodo }
// ========================================

function convertirA12Horas(hora) {
    let periodo = 'AM';
    let horaConvertida = hora;

    if (hora >= 12) {
        periodo = 'PM';
        if (hora > 12) {
            horaConvertida = hora - 12;
        }
    } else if (hora === 0) {
        horaConvertida = 12;
    }

    return { hora: horaConvertida, periodo };
}

// ========================================
// FUNCIÓN: Actualizar el reloj
// Se ejecuta cada segundo y actualiza:
// - Hora, minuto y segundo
// - Fecha actual
// - Saludo dinámico
// - Verifica si debe sonar la alarma
// ========================================

function actualizarReloj() {
    // Obtener fecha y hora actual
    const ahora = new Date();
    let hora = ahora.getHours();
    const minuto = ahora.getMinutes();
    const segundo = ahora.getSeconds();
    const diaSemana = diasEspanol[ahora.getDay()];
    const dia = ahora.getDate();
    const mes = mesesEspanol[ahora.getMonth()];
    const anio = ahora.getFullYear();

    // Actualizar saludo dinámico
    elementosDOM.saludo.textContent = obtenerSaludo(hora);

    // Mostrar reloj en formato 24h o 12h
    if (modo24h) {
        elementosDOM.hora.textContent = formatearNumero(hora);
    } else {
        const { hora: horaConvertida, periodo } = convertirA12Horas(hora);
        elementosDOM.hora.textContent = formatearNumero(horaConvertida);
    }

    elementosDOM.minuto.textContent = formatearNumero(minuto);
    elementosDOM.segundo.textContent = formatearNumero(segundo);

    // Actualizar fecha con formato español
    const fechaFormato = `${diaSemana}, ${dia} de ${mes} de ${anio}`;
    elementosDOM.fecha.textContent = fechaFormato;

    // Comparar hora actual con alarma configurada
    // Si la alarma está activa y la hora coincide, activar alarma
    if (alarmaConfig.activa && !alarmaConfig.sonandoActualmente) {
        const horaActualFormato = `${formatearNumero(hora)}:${formatearNumero(minuto)}`;
        
        // Verificar si la hora actual coincide con la hora de alarma configurada
        if (horaActualFormato === alarmaConfig.hora) {
            activarAlarma(alarmaConfig.hora);
        }
    }
}

// ========================================
// FUNCIÓN: Validar que la hora sea futura
// Parámetro: horaAlarmaString (formato "HH:MM")
// Retorna: boolean (true si es futura, false si no)
// ========================================

function esHoraFutura(horaAlarmaString) {
    // Obtener hora actual
    const ahora = new Date();
    const horaActual = formatearNumero(ahora.getHours());
    const minutoActual = formatearNumero(ahora.getMinutes());
    const horaActualFormato = `${horaActual}:${minutoActual}`;

    // Comparar strings en formato HH:MM
    return horaAlarmaString > horaActualFormato;
}

// ========================================
// FUNCIÓN: Establecer alarma
// Valida la entrada y guarda la configuración
// ========================================

function establecerAlarma() {
    // Obtener valor del input de tiempo
    const horaSeleccionada = elementosDOM.horaAlarma.value;

    // Validar que se haya seleccionado una hora
    if (!horaSeleccionada) {
        alert('Por favor, selecciona una hora para la alarma');
        return;
    }

    // Validar que la hora sea futura
    if (!esHoraFutura(horaSeleccionada)) {
        alert('Por favor, selecciona una hora futura');
        return;
    }

    // Guardar configuración de alarma
    alarmaConfig.activa = true;
    alarmaConfig.hora = horaSeleccionada;
    alarmaConfig.sonandoActualmente = false;

    // Actualizar interfaz de usuario
    actualizarStatusAlarma();

    // Feedback visual
    alert(`✓ Alarma configurada para las ${horaSeleccionada}`);
}

// ========================================
// FUNCIÓN: Cancelar alarma
// Desactiva la alarma actual
// ========================================

function cancelarAlarma() {
    // Desactivar alarma
    alarmaConfig.activa = false;
    alarmaConfig.hora = null;
    alarmaConfig.sonandoActualmente = false;

    // Limpiar input
    elementosDOM.horaAlarma.value = '';

    // Actualizar interfaz
    actualizarStatusAlarma();

    // Feedback visual
    alert('✓ Alarma cancelada');
}

// ========================================
// FUNCIÓN: Actualizar estado visual de la alarma
// Muestra si hay alarma activa y a qué hora
// ========================================

function actualizarStatusAlarma() {
    if (alarmaConfig.activa && alarmaConfig.hora) {
        // Alarma activa: mostrar hora de alarma
        elementosDOM.statusMessage.textContent = `🔔 Alarma activa - Sonará a las ${alarmaConfig.hora}`;
        elementosDOM.alarmStatus.classList.add('active');
    } else {
        // Sin alarma: mostrar mensaje por defecto
        elementosDOM.statusMessage.textContent = 'Sin alarma configurada';
        elementosDOM.alarmStatus.classList.remove('active');
    }
}

// ========================================
// FUNCIÓN: Activar alarma
// Se ejecuta cuando la hora actual coincide con la alarma
// Muestra notificación, reproduce sonido y desactiva automáticamente
// Parámetro: hora (string en formato "HH:MM")
// ========================================

function activarAlarma(hora) {
    // Marcar que la alarma está sonando
    alarmaConfig.sonandoActualmente = true;

    // Actualizar hora en la notificación
    elementosDOM.alarmTime.textContent = `Hora: ${hora}`;

    // Mostrar notificación
    elementosDOM.notificacion.classList.remove('hidden');

    // Reproducir sonido de alarma (simulado con alert y sonidos del navegador)
    reproducirSonidoAlarma();

    // Reproducir un alert (como backup)
    console.log('¡ALARMA ACTIVADA! Hora: ' + hora);
}

// ========================================
// FUNCIÓN: Reproducir sonido de alarma
// Crea tonos de frecuencia variable (efecto de alarma)
// ========================================

function reproducirSonidoAlarma() {
    // Crear contexto de audio del navegador
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Crear múltiples tonos que suenan de forma alternada
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                // Alternar entre dos frecuencias para efecto de alarma
                oscillator.frequency.value = i % 2 === 0 ? 800 : 600;
                
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.1);
            }, i * 150);
        }
    } catch (e) {
        // Si hay error con Audio API, usar alert como fallback
        console.log('Audio no disponible, usando alert');
    }
}

// ========================================
// FUNCIÓN: Detener alarma
// Se ejecuta cuando el usuario presiona el botón "Detener Alarma"
// ========================================

function detenerAlarma() {
    // Ocultar notificación
    elementosDOM.notificacion.classList.add('hidden');

    // Desactivar alarma
    alarmaConfig.sonandoActualmente = false;
    alarmaConfig.activa = false;
    alarmaConfig.hora = null;

    // Limpiar input
    elementosDOM.horaAlarma.value = '';

    // Actualizar estado visual
    actualizarStatusAlarma();
}

// ========================================
// FUNCIÓN: Toggle modo 12h/24h
// Cambia entre formato de 12 horas y 24 horas
// ========================================

function toggleModo() {
    modo24h = !modo24h;
    
    // Actualizar texto del botón
    elementosDOM.botonModo.textContent = modo24h ? '24h' : '12h';
    
    // Actualizar reloj inmediatamente
    actualizarReloj();
}

// ========================================
// EVENT LISTENERS - Configurar eventos
// ========================================

// Evento: Click en "Establecer Alarma"
elementosDOM.establecerAlarma.addEventListener('click', establecerAlarma);

// Evento: Click en "Cancelar Alarma"
elementosDOM.cancelarAlarma.addEventListener('click', cancelarAlarma);

// Evento: Click en "Detener Alarma" (en la notificación)
elementosDOM.detenerAlarma.addEventListener('click', detenerAlarma);

// Evento: Click en botón de toggle de modo
elementosDOM.botonModo.addEventListener('click', toggleModo);

// Evento: Enter en el input de tiempo para establecer alarma rápido
elementosDOM.horaAlarma.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        establecerAlarma();
    }
});

// ========================================
// INICIALIZACIÓN
// ========================================

// Actualizar reloj inmediatamente
actualizarReloj();

// Establecer intervalo para actualizar reloj cada segundo
intervaloReloj = setInterval(actualizarReloj, 1000);

// Log de inicialización (para debugging)
console.log('✓ Reloj digital inicializado correctamente');
console.log('✓ Sistema de alarma listo');
