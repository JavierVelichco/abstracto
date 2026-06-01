// CLASE COMPOSICION - CON ESPACIADO CORREGIDO
class Composicion {
	constructor(paleta) {
		this.paleta = paleta;
		this.bandas = [];
		this.gotas = [];
		this.cantidadBandas = floor(random(9, 15));
		this.cantidadGotas = floor(random(220, 400));
		this.irregularidadGlobal = random(0.6, 1.2);
		this.generarComposicion();
	}

	generarComposicion() {
		this.generarGotas();
		this.generarBandas();
		this.separarBandas();

	}


	generarGotas() {
		this.gotas = [];

		for (let i = 0; i < this.cantidadGotas; i++) {
			let x, y;
			let encontrado = false;
			let intentos = 0;

			while (!encontrado && intentos < 100) {
				x = random(width);
				y = random(height);

				let estaEnBanda = false;

				for (let banda of this.bandas) {
					if (this.puntoEstaEnBanda(x, y, banda)) {
						estaEnBanda = true;
						break;
					}
				}

				if (!estaEnBanda) {
					encontrado = true;
				}

				intentos++;
			}

			if (encontrado) {
				if (random() < 0.7) {
					this.gotas.push(new GotaPequena(x, y, this.paleta));
				} else {
					let tamanio = random(5, 13);
					this.gotas.push(new Gota(x, y, tamanio, false, this.paleta));
				}
			}
		}

		console.log("✅ Gotas fuera de bandas:", this.gotas.length);
	}


	generarBandas() {
		let margenSuperior = height * -0.05;
		let inicioPrimeraBanda = margenSuperior;
		let margenInferior = height * -0.05;
		let espacioDisponible = height - inicioPrimeraBanda - margenInferior;

		let separacionBase = espacioDisponible / this.cantidadBandas;

		let grosorMaximo = separacionBase * 0.7;
		let grosorMinimo = separacionBase * 0.3;

		let fluctuacionGlobal = random(0.3, 0.7);

		for (let i = 0; i < this.cantidadBandas; i++) {
			let yCentro = inicioPrimeraBanda + i * separacionBase + separacionBase / 2;

			let variacion = random(-separacionBase * 0.12, separacionBase * 0.12);
			yCentro += variacion;

			let grosor = random(grosorMinimo, grosorMaximo);
			let irregularidad = this.irregularidadGlobal * random(0.7, 1.3);

			let banda = new Banda(yCentro, grosor, irregularidad, this.paleta, i, fluctuacionGlobal);
			this.bandas.push(banda);
		}
	}

	separarBandas() {
		let espacioMinimo = 8;

		for (let i = 0; i < this.bandas.length - 1; i++) {
			let bandaSuperior = this.bandas[i];
			let bandaInferior = this.bandas[i + 1];

			for (let j = 0; j < bandaSuperior.puntosInferior.length; j++) {
				let x = bandaSuperior.puntosInferior[j].x;

				let puntoSupBandaInferior = null;
				for (let k = 0; k < bandaInferior.puntosSuperior.length; k++) {
					if (Math.abs(bandaInferior.puntosSuperior[k].x - x) < 3) {
						puntoSupBandaInferior = bandaInferior.puntosSuperior[k];
						break;
					}
				}

				if (puntoSupBandaInferior) {
					let bordeSuperiorBandaInf = puntoSupBandaInferior.y;
					let bordeInferiorBandaSup = bandaSuperior.puntosInferior[j].y;

					if (bordeInferiorBandaSup + espacioMinimo > bordeSuperiorBandaInf) {
						let desplazamiento = (bordeInferiorBandaSup + espacioMinimo) - bordeSuperiorBandaInf;

						for (let k = 0; k < bandaInferior.puntosSuperior.length; k++) {
							bandaInferior.puntosSuperior[k].y += desplazamiento;
							bandaInferior.puntosInferior[k].y += desplazamiento;
						}
						bandaInferior.yCentro += desplazamiento;
					}
				}
			}
		}
	}


	puntoEstaEnBanda(x, y, banda) {
		let puntosSup = banda.puntosSuperior;
		let puntosInf = banda.puntosInferior;

		for (let i = 0; i < puntosSup.length - 1; i++) {
			let x1 = puntosSup[i].x;
			let x2 = puntosSup[i + 1].x;

			if (x >= x1 && x <= x2) {
				let t = (x - x1) / (x2 - x1);
				let ySup = lerp(puntosSup[i].y, puntosSup[i + 1].y, t);
				let yInf = lerp(puntosInf[i].y, puntosInf[i + 1].y, t);

				if (y >= ySup && y <= yInf) {
					return true;
				}
			}
		}

		return false;
	}

	dibujar() {
		background(this.paleta.getColorFondo());

		for (let gota of this.gotas) gota.dibujar();
		for (let banda of this.bandas) banda.dibujar();
		for (let i = 0; i < this.bandas.length - 1; i++) this.bandas[i].dibujarConexiones(this.bandas[i + 1]);
		this.aplicarVeladura();
	}

	aplicarVeladura() {
		push();
		blendMode(OVERLAY);
		fill(245, 240, 225, 10);
		noStroke();
		rect(0, 0, width, height);
		pop();
	}
}