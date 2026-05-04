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
		this.generarBandas();
		this.separarBandas();
		this.generarGotas();
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

	generarGotas() {
		this.gotas = [];
		
		// Cantidades separadas
		let cantidadGotasNormales = floor(this.cantidadGotas * 0.3);
		let cantidadGotasPequeñas = this.cantidadGotas - cantidadGotasNormales;
		
		// ==========================================
		// GENERAR GOTAS PEQUEÑAS (Siempre fuera de bandas)
		// ==========================================
		for (let i = 0; i < cantidadGotasPequeñas; i++) {
			let x, y;
			let encontrado = false;
			let intentos = 0;
			
			while (!encontrado && intentos < 20) {
				x = random(width);
				y = random(height);
				
				let estaEnBanda = false;
				for (let banda of this.bandas) {
					if (abs(y - banda.yCentro) < banda.grosor / 2) {
						estaEnBanda = true;
						break;
					}
				}
				
				if (!estaEnBanda) {
					encontrado = true;
				}
				intentos++;
			}
			
			if (!encontrado) {
				x = random(width);
				y = random(height);
			}
			
			let gota = new GotaPequena(x, y, this.paleta);
			this.gotas.push(gota);
		}
		
		// ==========================================
		// GENERAR GOTAS NORMALES (Pueden estar en bandas)
		// ==========================================
		let porcentajeNormalesEnBandas = random(0.5, 0.8);
		
		for (let i = 0; i < cantidadGotasNormales; i++) {
			let x, y;
			let dentroDeBanda = false;
			let quieroDentro = random() < porcentajeNormalesEnBandas;
			let encontrado = false;
			let intentos = 0;
			
			while (!encontrado && intentos < 20) {
				x = random(width);
				y = random(height);
				
				let estaEnBanda = false;
				for (let banda of this.bandas) {
					if (abs(y - banda.yCentro) < banda.grosor / 2) {
						estaEnBanda = true;
						break;
					}
				}
				
				if (quieroDentro && estaEnBanda) {
					encontrado = true;
					dentroDeBanda = true;
				} else if (!quieroDentro && !estaEnBanda) {
					encontrado = true;
					dentroDeBanda = false;
				}
				intentos++;
			}
			
			if (!encontrado) {
				x = random(width);
				y = random(height);
				dentroDeBanda = false;
			}
			
			let tamanio = random(5, 13);
			let gota = new Gota(x, y, tamanio, dentroDeBanda, this.paleta);
			this.gotas.push(gota);
		}
		
		console.log("✅ Gotas generadas:", this.gotas.length);
	}

	dibujar() {
		background(this.paleta.getColorFondo());
		for (let banda of this.bandas) banda.dibujar();
		for (let i = 0; i < this.bandas.length - 1; i++) this.bandas[i].dibujarConexiones(this.bandas[i + 1]);
		for (let gota of this.gotas) gota.dibujar();
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