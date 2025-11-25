const readline = require('readline');

// Escribe un programa que salude al usuario por consola
console.log("¡Hola, Mundo! Bienvenido al curso de IA.");

//Solicita al usuario que ingrese su nombre y lo salude

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Por favor, ingresa tu nombre: ', (nombre) => {
    console.log(`¡Hola, ${nombre}! Bienvenido al curso de IA.`);
    rl.close();
});


