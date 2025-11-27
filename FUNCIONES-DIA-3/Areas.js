/**
 * Calcula el área de un círculo.
 * Esta función recibe el radio y aplica la fórmula A = π * r².
 * 
 * @param {number} radio - El radio del círculo a calcular.
/**
 * Calcula el área de un círculo.
 * Esta función recibe el radio y aplica la fórmula A = π * r².
 * 
 * @param {number} radio - El radio del círculo a calcular.
 * @returns {number} El área del círculo.
 */
function areaCirculo(radio) {
    return Math.PI * Math.pow(radio, 2);
}

/**
 * Calcula el área de un rectángulo.
 * 
 * @param {number} base - La base del rectángulo.
 * @param {number} altura - La altura del rectángulo.
 * @returns {number} El área del rectángulo.
 */
function areaRectangulo(base, altura) {
    return base * altura;
}
/**
 * Calcula el volumen de un cilindro.
 * El volumen es el área de la base (círculo) por la altura.
 * 
 * @param {number} radio - El radio de la base del cilindro.
 * @param {number} altura - La altura del cilindro.
 * @returns {number} El volumen del cilindro.
 */
function volumenCilindro(radio, altura) {
    const areaBase = areaCirculo(radio);
    return areaBase * altura;
}

//crea una funcion para calcular una derivada simple de una funcion polinomial de la forma ax^n
/**
 * Calcula la derivada de un término polinómico utilizando la regla de la potencia.
 * 
 * Dado un término de la forma: coeficiente * x^exponente
 * La derivada es: (coeficiente * exponente) * x^(exponente - 1)
 * 
 * @param {number} coeficiente - El coeficiente del término polinómico
 * @param {number} exponente - El exponente de la variable x
 * @returns {string} La derivada del término en formato de string (ej: "6x^1")
 * 
 * @example
 * // Derivada de 3x^2
 * derivadaPolinomio(3, 2); // retorna "6x^1"
 * 
 * @example
 * // Derivada de 5x^3
 * derivadaPolinomio(5, 3); // retorna "15x^2"
 */
function derivadaPolinomio(coeficiente, exponente) {
    const nuevoCoeficiente = coeficiente * exponente;
    const nuevoExponente = exponente - 1;
    return `${nuevoCoeficiente}x^${nuevoExponente}`;
}

//Crea una funcion para calcular una integral simple de una funcion polinomial de la forma ax^n
function integralPolinomio(coeficiente, exponente) {
    const nuevoExponente = exponente + 1;
    const nuevoCoeficiente = coeficiente / nuevoExponente;
    return `${nuevoCoeficiente}x^${nuevoExponente} + C`;
}