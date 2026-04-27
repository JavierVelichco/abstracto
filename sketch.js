/**
 * TP1 - Roger Weik
 * Alumnos: Stigliano, Velichco
 * 
 * Serie de bandas horizontales con bordes orgánicos
 * y gotas/ manchas de aspecto celular
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


// CLASE PALETA

class Paleta {
	constructor() {
		// 1. Fondo: siempre claro
		let rFondo = random(200, 255);
		let gFondo = random(200, 255);
		let bFondo = random(200, 255);
		this.colorFondo = color(rFondo, gFondo, bFondo);

		// 2. Gotas: siempre oscuras
		let rGotas = random(0, 70);
		let gGotas = random(0, 70);
		let bGotas = random(0, 70);
		this.colorGotas = color(rGotas, gGotas, bGotas);

		// 3. Bandas: cualquier color, pero asegurando que NO se confunda con fondo ni gotas
		// Para eso, forzamos que al menos uno de los canales sea medio o saturado
		let rBandas, gBandas, bBandas;

		// Evitamos que los tres canales sean muy claros (como fondo)
		// Y evitamos que los tres canales sean muy oscuros (como gotas)
		do {
			rBandas = random(80, 220);
			gBandas = random(80, 220);
			bBandas = random(80, 220);
		} while (
			// Si es demasiado claro (se confunde con fondo)
			(rBandas > 200 && gBandas > 200 && bBandas > 200) ||
			// Si es demasiado oscuro (se confunde con gotas)
			(rBandas < 80 && gBandas < 80 && bBandas < 80)
		);

		this.colorBandas = color(rBandas, gBandas, bBandas);

		// Opacidad variable para gotas
		this.opacidadGotas = random(120, 220);
	}

	getColorFondo() {
		return this.colorFondo;
	}

	getColorBandas() {
		return this.colorBandas;
	}

	getColorGota(opacidadPersonalizada = null) {
		let op = opacidadPersonalizada !== null ? opacidadPersonalizada : this.opacidadGotas;
		return color(red(this.colorGotas), green(this.colorGotas), blue(this.colorGotas), op);
	}
}

// ============================================
// CLASE GOTA
// ============================================
class Gota {
	constructor(x, y, tamanio, dentroDeBanda, paleta) {
		this.x = x;
		this.y = y;
		this.tamanioBase = tamanio;
		this.dentroDeBanda = dentroDeBanda;
		this.paleta = paleta;

		// Variación individual
		this.irregularidad = random(0.7, 1.3);
		this.opacidad = random(80, 180);
	}

	dibujar() {
		push();
		translate(this.x, this.y);

		let radioW = this.tamanioBase * this.irregularidad;
		let radioH = this.tamanioBase * random(0.8, 1.2);

		// Color según ubicación
		let colorGota;
		if (this.dentroDeBanda) {
			// Gotas dentro de banda: más oscuras y opacas
			colorGota = this.paleta.getColorGota(this.opacidad * 0.8);
		} else {
			// Gotas sobre fondo: más transparentes
			colorGota = this.paleta.getColorGota(this.opacidad * 0.6);
		}

		fill(colorGota);
		noStroke();

		// Dibujar forma orgánica (como ameba)
		beginShape();
		let puntos = 24; // cantidad de puntos en el contorno
		for (let i = 0; i < puntos; i++) {
			let angulo = map(i, 0, puntos, 0, TWO_PI);
			// Variación radial orgánica
			let radioVariacion = map(noise(this.x * 0.01, this.y * 0.01, i * 0.2), 0, 1, 0.6, 1.4);
			let rx = radioW * radioVariacion * cos(angulo);
			let ry = radioH * radioVariacion * sin(angulo);
			vertex(rx, ry);
		}
		endShape(CLOSE);
		pop();
	}
}

// CLASE BANDA
class Banda {
	constructor(yCentro, grosor, irregularidad, paleta, indice) {
		this.yCentro = yCentro;
		this.grosor = grosor;
		this.irregularidad = irregularidad;
		this.paleta = paleta;
		this.indice = indice;

		// NUEVOS PARÁMETROS PARA CONTROLAR HORIZONTALMENTE LA BANDA
		// PASO 1: Elegir el tipo (con probabilidades)
		this.tipoHorizontal = random([
			'completa', 'completa', 'completa',  // 3/7 (~43%)
			'recortada_izq',                      // 1/7 (~14%)
			'recortada_der',                      // 1/7 (~14%)
			'central',                            // 1/7 (~14%)
			'fragmentada'                         // 1/7 (~14%)
		]);

		// Definir rango de inicio y fin (en X)
		switch (this.tipoHorizontal) {
			case 'completa':
				this.inicioX = 0;
				this.finX = width;
				break;
			case 'recortada_izq':
				this.inicioX = random(width * 0.1, width * 0.4);
				this.finX = width;
				break;
			case 'recortada_der':
				this.inicioX = 0;
				this.finX = random(width * 0.6, width * 0.9);
				break;
			case 'central':
				this.inicioX = random(width * 0.1, width * 0.3);
				this.finX = random(width * 0.7, width * 0.9);
				break;
			case 'fragmentada':
				this.inicioX = 0;
				this.finX = width;
				this.fragmentos = random([true, false]);
				this.numFragmentos = floor(random(2, 5));
				this.huecoMin = random(20, 60);
				break;
		}

		this.puntosSuperior = [];
		this.puntosInferior = [];
		this.generarPuntos();
	}

	generarPuntos() {
		let ySupBase = this.yCentro - this.grosor / 2;
		let yInfBase = this.yCentro + this.grosor / 2;

		let step = 6; // más puntos = más detalle

		for (let x = this.inicioX; x <= this.finX; x += step) {
			// Usar MÚLTIPLES octavos de ruido para más irregularidad
			let ruidoSup = 0;
			let ruidoInf = 0;

			// Ruido de alta frecuencia para bordes "quebrados"
			ruidoSup += noise(x * 0.05, this.indice * 0.3) * this.irregularidad * 12;
			ruidoSup += noise(x * 0.15, this.indice * 0.7) * this.irregularidad * 6;
			ruidoSup += noise(x * 0.4, this.indice * 1.2) * this.irregularidad * 3;

			// Ruido para borde inferior (INDEPENDIENTE del superior - clave!)
			ruidoInf += noise(x * 0.05 + 100, this.indice * 0.3 + 50) * this.irregularidad * 10;
			ruidoInf += noise(x * 0.18, this.indice * 0.8) * this.irregularidad * 5;
			ruidoInf += noise(x * 0.5, this.indice * 1.5) * this.irregularidad * 2;

			// Agregar "picos" ocasionales (característico de Weik)
			let pico = 0;
			if (random(1) < 0.08) { // 8% de los puntos tienen un pico
				pico = random(-this.irregularidad * 8, this.irregularidad * 12);
			}

			// Pequeñas protuberancias (protuberancias redondeadas pero abruptas)
			let protuberancia = sin(x * 0.12) * cos(x * 0.07) * this.irregularidad * 4;

			let desplazamientoSup = ruidoSup + pico + protuberancia;
			let desplazamientoInf = ruidoInf + pico * 0.7 + protuberancia * 0.5;

			let ySup = ySupBase + desplazamientoSup;
			let yInf = yInfBase + desplazamientoInf;

			// A veces el borde superior puede tocar o superar al inferior (crea "cuellos")
			if (ySup > yInf - 2) {
				ySup = yInf - random(3, 8);
			}

			this.puntosSuperior.push(createVector(x, ySup));
			this.puntosInferior.push(createVector(x, yInf));
		}
	}

	dibujar() {
		if (this.puntosSuperior.length === 0) return;

		fill(this.paleta.getColorBandas());
		noStroke();

		// DIBUJAR EXTREMOS REDONDEADOS (detrás de la banda)
		push();
		blendMode(BLEND);

		// Extremo izquierdo (si no empieza en borde)
		if (this.inicioX > 5) {
			let primerPuntoSup = this.puntosSuperior[0];
			let primerPuntoInf = this.puntosInferior[0];
			let centroY = (primerPuntoSup.y + primerPuntoInf.y) / 2;
			let alto = primerPuntoInf.y - primerPuntoSup.y;
			ellipse(primerPuntoSup.x, centroY, 30, alto);
		}

		// Extremo derecho (si no termina en borde)
		if (this.finX < width - 5) {
			let ultimoPuntoSup = this.puntosSuperior[this.puntosSuperior.length - 1];
			let ultimoPuntoInf = this.puntosInferior[this.puntosInferior.length - 1];
			let centroY = (ultimoPuntoSup.y + ultimoPuntoInf.y) / 2;
			let alto = ultimoPuntoInf.y - ultimoPuntoSup.y;
			ellipse(ultimoPuntoSup.x, centroY, 30, alto);
		}

		pop();

		// Dibujar la forma principal
		beginShape();
		// Borde superior
		for (let p of this.puntosSuperior) {
			vertex(p.x, p.y);
		}
		// Borde inferior (en orden inverso)
		for (let i = this.puntosInferior.length - 1; i >= 0; i--) {
			vertex(this.puntosInferior[i].x, this.puntosInferior[i].y);
		}
		endShape(CLOSE);
	}

	dibujarConexiones(otraBanda, umbralDistancia = 35) {
		// Solo conectar si ambas bandas son del tipo que cubren áreas superpuestas en X
		let hayOverlap = !(this.finX < otraBanda.inicioX || otraBanda.finX < this.inicioX);
		if (!hayOverlap) return;

		stroke(this.paleta.getColorBandas());
		strokeWeight(random(1, 3));
		noFill();

		for (let i = 0; i < this.puntosSuperior.length; i++) {
			let p1 = this.puntosSuperior[i];

			for (let j = 0; j < otraBanda.puntosInferior.length; j++) {
				let p2 = otraBanda.puntosInferior[j];
				let distanciaX = abs(p1.x - p2.x);

				if (distanciaX < 20) {
					let distanciaY = abs(p1.y - p2.y);
					if (distanciaY < umbralDistancia) {
						line(p1.x, p1.y, p2.x, p2.y);
					}
				}
			}
		}
	}
}

// CLASE COMPOSICION

class Composicion {
	constructor(paleta) {
		this.paleta = paleta;
		this.bandas = [];
		this.gotas = [];

		// Parámetros aleatorios
		this.cantidadBandas = floor(random(9, 14)); // entre 9 y 13
		this.cantidadGotas = floor(random(130, 350));
		this.irregularidadGlobal = random(0.6, 1.4);

		this.generarComposicion();
	}

	generarComposicion() {
		this.generarBandas();
		this.generarGotas();
	}

	generarBandas() {
		// Calcular separación vertical
		let espacioDisponible = height * 0.85; // dejar márgenes
		let separacionBase = espacioDisponible / this.cantidadBandas;
		let margenSuperior = height * 0.08;

		for (let i = 0; i < this.cantidadBandas; i++) {
			let yCentro = margenSuperior + i * separacionBase + random(-separacionBase * 0.2, separacionBase * 0.2);
			let grosor = random(15, 45);
			let irregularidad = this.irregularidadGlobal * random(0.7, 1.3);

			let banda = new Banda(yCentro, grosor, irregularidad, this.paleta, i);
			this.bandas.push(banda);
		}
	}

	generarGotas() {
		for (let i = 0; i < this.cantidadGotas; i++) {
			let x = random(width);
			let y = random(height);

			// Decidir si la gota está dentro de una banda (40% probabilidad)
			let dentroDeBanda = false;
			for (let banda of this.bandas) {
				// Verificar si y está cerca del centro de la banda
				let distanciaY = abs(y - banda.yCentro);
				if (distanciaY < banda.grosor / 2) {
					dentroDeBanda = true;
					break;
				}
			}

			let tamanio = random(1, 15);
			let gota = new Gota(x, y, tamanio, dentroDeBanda, this.paleta);
			this.gotas.push(gota);
		}
	}

	dibujar() {
		// 1. Fondo
		background(this.paleta.getColorFondo());

		// 2. Bandas
		for (let banda of this.bandas) {
			banda.dibujar();
		}

		// 3. Conexiones entre bandas (opcional, textura extra)
		for (let i = 0; i < this.bandas.length - 1; i++) {
			this.bandas[i].dibujarConexiones(this.bandas[i + 1]);
		}

		// 4. Gotas
		for (let gota of this.gotas) {
			gota.dibujar();
		}

		// 5. Ajuste final de transparencia/veladura
		this.aplicarVeladura();
	}


	aplicarVeladura() {
		// Capa final muy sutil de mezcla
		push();
		blendMode(OVERLAY);
		fill(245, 240, 225, 15);
		noStroke();
		rect(0, 0, width, height);
		pop();
	}
}