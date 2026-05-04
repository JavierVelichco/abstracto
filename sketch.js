/**
 * TP1 - Roger Weik
 * Alumnos: Stigliano, Velichco
 * 
 * Serie de bandas horizontales con bordes orgánicos
 * y gotas/ manchas de aspecto celular
 * 
 * CORREGIDO: Las bandas siempre conectan con al menos un borde lateral
 */

let composicionActual;


function setup() {
	// Proporción 2:3 (ancho:alto)
	let ancho = 500;
	let alto = 750;
	createCanvas(ancho, alto);

	// Semilla aleatoria para reproducibilidad
	randomSeed(floor(random(10000)));

	generarObra();
}

function draw() {
	// No necesita actualización continua
	noLoop();
}

function generarObra() {
	// 1. Seleccionar paleta aleatoria
	let paleta = new Paleta();

	// 2. Crear composición
	composicionActual = new Composicion(paleta);

	// 3. Dibujar
	composicionActual.dibujar();
}

function keyPressed() {
	if (key === ' ' || key === 'Space') {
		// Regenerar obra
		randomSeed(floor(random(10000)));
		generarObra();
	} else if (key === 's' || key === 'S') {
		// Guardar imagen
		saveCanvas('weik_serie_' + nf(random(1000), 3, 0), 'png');
	}
}
