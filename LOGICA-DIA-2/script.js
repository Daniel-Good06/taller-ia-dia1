//Ejercicio: Array y Obejtos
//1. Array(Listas)
//Crea una lista de tus 3 comidas favoritas 
let comidasFavoritas = ["Pizza", "Sushi", "Tacos"];

//2. Objetos  (key y value)
let persona={
    nombre :'Carlitos',
    edad: 30,
    ciudad: 'Madrid',
    habilidades: ['Programacion', 'dibujo', 'cocina'],
    estatura: 1.75,
    programador:true

}  ;
// como accedo a la propiedad nombre de mi objeto persona
console.log('nombre:' , persona.nombre);

//como accedo a la propiedad habilidades de mi objeto persona 
console.log('Habilidades:', persona.habilidades);
//como accedo a la propiedad de dibujo de mi objeto persona
console.log('Habilidades de dibujo:', persona.habilidades[1]);

//3. Array de Objetos 
//Crea una lista de 3 alumnos(objetos) con nombre y calificacion
let alumnos = [
    {nombre: "Ana", calificacion: 85},
    
    {nombre: "Luis", calificacion: 92},
    
    {nombre: "Marta", calificacion: 78},
    {nombre:"Carlos",}
];

//Escribe un bucle que recorra el array de alumnos e imprima solo  los que tengan una calificacion mayor a 80
for (let i = 0; i < alumnos.length; i++) {
    if (alumnos[i].calificacion > 80) {
        console.log('Alumno:', alumnos[i].nombre, 'Calificacion:', 
            alumnos[i].calificacion);
    }
}








