
// CLASE BANDA - CON BORDES MÁS DEFINIDOS Y ESPACIADO CORREGIDO
class Banda {
constructor(yCentro, grosor, irregularidad, paleta, indice, fluctuacionGlobal = 0.4) {
	this.yCentro = yCentro;
	this.grosor = grosor;
	this.irregularidad = irregularidad;
	this.paleta = paleta;
	this.indice = indice;
	this.fluctuacionGlobal = fluctuacionGlobal; // Nuevo
		//this.separacionMinima = separacionMinima; // Espacio mínimo con banda vecina

		let tiposQueTocanBorde = [
			'completa', 'completa', 'completa',
			'borde_izq', 'borde_izq',
			'borde_der', 'borde_der',
			'ambos_bordes_cortados',
			'fragmentada'
		];
		
		this.tipoHorizontal = random(tiposQueTocanBorde);

		this.fragmentoIzquierdo = false;
		this.fragmentoDerecho = false;
		
		switch (this.tipoHorizontal) {
			case 'completa':
				this.inicioX = 0;
				this.finX = width;
				break;
				
			case 'borde_izq':
				this.inicioX = 0;
				this.finX = random(width * 0.4, width * 0.85);
				this.fragmentoDerecho = true;
				this.tamanioFragmentoDer = random(15, 45);
				break;
				
			case 'borde_der':
				this.inicioX = random(width * 0.15, width * 0.6);
				this.finX = width;
				this.fragmentoIzquierdo = true;
				this.tamanioFragmentoIzq = random(15, 45);
				break;
				
			case 'ambos_bordes_cortados':
				this.inicioX = 0;
				this.finX = width;
				this.estrechamientoCentral = random(0.3, 0.7);
				break;
				
			case 'fragmentada':
				this.inicioX = 0;
				this.finX = width;
				this.numFragmentos = floor(random(2, 5));
				this.huecoMin = random(20, 50);
				this.fragmentoIzquierdo = true;
				this.fragmentoDerecho = true;
				this.tamanioFragmentoIzq = random(15, 45);
				this.tamanioFragmentoDer = random(15, 45);
				break;
		}

		this.puntosSuperior = [];
		this.puntosInferior = [];
		this.generarPuntos();
		
		if (this.fragmentoIzquierdo) {
			this.puntosSuperiorIzq = [];
			this.puntosInferiorIzq = [];
			this.generarFragmentoIzquierdo();
		}
		
		if (this.fragmentoDerecho) {
			this.puntosSuperiorDer = [];
			this.puntosInferiorDer = [];
			this.generarFragmentoDerecho();
		}
	}

generarPuntos() {
	let step = 5;
	
	// ============================================
	// PARÁMETROS EQUILIBRADOS
	// ============================================
	
	// FLUCTUACIÓN DEL CENTRO - aplica a TODAS las bandas
	let centroAmplitud = this.grosor * random(0.12, 0.22);
	let centroFrecuencia = random(0.02, 0.035);
	
	// FLUCTUACIÓN DEL GROSOR
	let grosorMinimo = 0.65;
	let grosorMaximo = 1.35;
	let grosorFrecuencia = random(0.025, 0.04);
	// ============================================

	this.puntosSuperior = [];
	this.puntosInferior = [];

	for (let x = this.inicioX; x <= this.finX; x += step) {
		let factorEstrechamiento = 1;
		if (this.tipoHorizontal === 'ambos_bordes_cortados') {
			let centroX = width / 2;
			let distanciaAlCentro = abs(x - centroX);
			let maxDistancia = width / 2;
			factorEstrechamiento = map(distanciaAlCentro, 0, maxDistancia, this.estrechamientoCentral, 1);
			factorEstrechamiento = constrain(factorEstrechamiento, 0.3, 1);
		}

		// ==========================================
		// FLUCTUACIÓN DEL CENTRO - AHORA PARA TODAS LAS BANDAS
		// ==========================================
		let desplazamientoCentro = 0;
		// Movimiento principal
		let faseCentro = x * centroFrecuencia + this.indice * 2.5;
		desplazamientoCentro = sin(faseCentro) * centroAmplitud;
		// Segunda armónica para más riqueza
		desplazamientoCentro += sin(x * centroFrecuencia * 2.0 + this.indice) * (centroAmplitud * 0.3);
		
		let yCentroActual = this.yCentro + desplazamientoCentro;

		// ==========================================
		// FLUCTUACIÓN DEL GROSOR
		// ==========================================
		let factorGrosor = 1;
		let faseGrosor = x * grosorFrecuencia + this.indice * 3;
		let valorSenoidal = sin(faseGrosor);
		let segundaOnda = cos(x * grosorFrecuencia * 1.5 + this.indice) * 0.3;
		let combinado = (valorSenoidal + segundaOnda) * 0.7;
		factorGrosor = map(combinado, -0.8, 0.8, grosorMinimo, grosorMaximo);
		factorGrosor = constrain(factorGrosor, grosorMinimo, grosorMaximo);

		let grosorActual = this.grosor * factorGrosor;
		let mitadGrosor = grosorActual / 2;

		// ==========================================
		// RUIDO DE BORDES
		// ==========================================
		let ruidoSup = noise(x * 0.025, this.indice * 0.3) * this.irregularidad * 1.0;
		let ruidoInf = noise(x * 0.025 + 100, this.indice * 0.3 + 50) * this.irregularidad * 0.8;

		let ySup = yCentroActual - mitadGrosor + ruidoSup * factorEstrechamiento;
		let yInf = yCentroActual + mitadGrosor + ruidoInf * factorEstrechamiento;

		this.puntosSuperior.push(createVector(x, ySup));
		this.puntosInferior.push(createVector(x, yInf));
	}
	this.limitarBordes();

	// Verificar fluctuación del centro
	let centroMinY = Infinity;
	let centroMaxY = -Infinity;

	for (let i = 0; i < this.puntosSuperior.length; i++) {
		let centroY = (this.puntosSuperior[i].y + this.puntosInferior[i].y) / 2;
		if (centroY < centroMinY) centroMinY = centroY;
		if (centroY > centroMaxY) centroMaxY = centroY;
	}
	let variacionCentro = centroMaxY - centroMinY;
	
	console.log("Banda", this.indice, "- Variación CENTRO:", variacionCentro.toFixed(1), "px");
}
	
generarFragmentoIzquierdo() {
	let step = 5;
	let inicioXIzq = 0;
	let finXIzq = this.tamanioFragmentoIzq;
	
	// Centro y grosor fluctuante para fragmentos
	let centroAmplitud = this.grosor * random(0.1, 0.25);
	let centroFrecuencia = random(0.02, 0.05);
	let grosorVariacion = random(0.3, 0.5);
	
	for (let x = inicioXIzq; x <= finXIzq; x += step) {
		// Movimiento del centro
		let desplazamientoCentro = sin(x * centroFrecuencia + this.indice) * centroAmplitud;
		let yCentroActual = this.yCentro + desplazamientoCentro;
		
		// Variación del grosor
		let factorGrosor = 1 + sin(x * 0.03 + this.indice) * grosorVariacion;
		factorGrosor = constrain(factorGrosor, 0.5, 1.5);
		let grosorActual = this.grosor * factorGrosor;
		let mitadGrosor = grosorActual / 2;
		
		let ruidoSup = noise(x * 0.04 + 200, this.indice * 0.4) * this.irregularidad * 3;
		let ruidoInf = noise(x * 0.04 + 300, this.indice * 0.4 + 50) * this.irregularidad * 2.5;
		
		let ySup = yCentroActual - mitadGrosor + ruidoSup;
		let yInf = yCentroActual + mitadGrosor + ruidoInf;
		
		this.puntosSuperiorIzq.push(createVector(x, ySup));
		this.puntosInferiorIzq.push(createVector(x, yInf));
	}
}

generarFragmentoDerecho() {
	let step = 5;
	let inicioXDer = width - this.tamanioFragmentoDer;
	let finXDer = width;
	
	let centroAmplitud = this.grosor * random(0.1, 0.25);
	let centroFrecuencia = random(0.01, 0.025);
	let grosorVariacion = random(0.3, 0.5);
	
	for (let x = inicioXDer; x <= finXDer; x += step) {
		let desplazamientoCentro = sin(x * centroFrecuencia + this.indice) * centroAmplitud;
		let yCentroActual = this.yCentro + desplazamientoCentro;
		
		let factorGrosor = 1 + sin(x * 0.03 + this.indice) * grosorVariacion;
		factorGrosor = constrain(factorGrosor, 0.5, 1.5);
		let grosorActual = this.grosor * factorGrosor;
		let mitadGrosor = grosorActual / 2;
		
		let ruidoSup = noise(x * 0.04, this.indice * 0.4) * this.irregularidad * 3;
		let ruidoInf = noise(x * 0.04 + 100, this.indice * 0.4 + 50) * this.irregularidad * 2.5;
		
		let ySup = yCentroActual - mitadGrosor + ruidoSup;
		let yInf = yCentroActual + mitadGrosor + ruidoInf;
		
		this.puntosSuperiorDer.push(createVector(x, ySup));
		this.puntosInferiorDer.push(createVector(x, yInf));
	}
	
}
	


	
	dibujarExtremoRedondo(puntosSup, puntosInf, xPos) {
		let puntoSup = null;
		let puntoInf = null;
		let minDiff = Infinity;
		
		for (let i = 0; i < puntosSup.length; i++) {
			let diff = abs(puntosSup[i].x - xPos);
			if (diff < minDiff) {
				minDiff = diff;
				puntoSup = puntosSup[i];
				puntoInf = puntosInf[i];
			}
		}
		
		if (puntoSup && puntoInf) {
			let centroY = (puntoSup.y + puntoInf.y) / 2;
			let alto = puntoInf.y - puntoSup.y;
			ellipse(xPos, centroY, max(alto * 0.7, 10), alto);
		}
	}

	dibujarFragmentada() {
		if (this.puntosSuperior.length === 0) return;
		
		let anchoTotal = this.finX - this.inicioX;
		let huecoSize = this.huecoMin + random(10, 30);
		
		let segmentos = [];
		let inicioSegmento = 0;
		
		for (let i = 0; i < this.numFragmentos; i++) {
			let finSegmento = inicioSegmento + random(anchoTotal / (this.numFragmentos * 1.5), anchoTotal / (this.numFragmentos * 0.8));
			finSegmento = min(finSegmento, anchoTotal - huecoSize);
			segmentos.push([inicioSegmento, finSegmento]);
			inicioSegmento = finSegmento + random(huecoSize, huecoSize * 2);
			if (inicioSegmento >= anchoTotal) break;
		}
		
		let primerSegmento = segmentos[0];
		let llegaAlBordeIzq = primerSegmento && primerSegmento[0] <= 5;
		
		let ultimoSegmento = segmentos[segmentos.length - 1];
		let llegaAlBordeDer = ultimoSegmento && ultimoSegmento[1] >= anchoTotal - 10;
		
		if (!llegaAlBordeIzq && !this.fragmentoIzquierdo) {
			this.fragmentoIzquierdo = true;
			this.tamanioFragmentoIzq = random(15, 45);
			this.puntosSuperiorIzq = [];
			this.puntosInferiorIzq = [];
			this.generarFragmentoIzquierdo();
		}
		
		if (!llegaAlBordeDer && !this.fragmentoDerecho) {
			this.fragmentoDerecho = true;
			this.tamanioFragmentoDer = random(15, 45);
			this.puntosSuperiorDer = [];
			this.puntosInferiorDer = [];
			this.generarFragmentoDerecho();
		}
		
		for (let seg of segmentos) {
			let startX = this.inicioX + seg[0];
			let endX = this.inicioX + seg[1];
			
			let puntosSupSeg = [];
			let puntosInfSeg = [];
			
			for (let p of this.puntosSuperior) {
				if (p.x >= startX && p.x <= endX) puntosSupSeg.push(p);
			}
			for (let p of this.puntosInferior) {
				if (p.x >= startX && p.x <= endX) puntosInfSeg.push(p);
			}
			
			if (puntosSupSeg.length > 0 && puntosInfSeg.length > 0) {
				fill(this.paleta.getColorBandas());
				noStroke();
				beginShape();
				for (let p of puntosSupSeg) vertex(p.x, p.y);
				for (let i = puntosInfSeg.length - 1; i >= 0; i--) vertex(puntosInfSeg[i].x, puntosInfSeg[i].y);
				endShape(CLOSE);
				
				push();
				blendMode(BLEND);
				fill(this.paleta.getColorBandas());
				noStroke();
				this.dibujarExtremoRedondo(puntosSupSeg, puntosInfSeg, startX);
				this.dibujarExtremoRedondo(puntosSupSeg, puntosInfSeg, endX);
				pop();
			}
		}
	}
	
	// Añadir contorno para más definición
	dibujarContorno() {
		stroke(red(this.paleta.getColorBandas()) * 0.6, 
		       green(this.paleta.getColorBandas()) * 0.6, 
		       blue(this.paleta.getColorBandas()) * 0.6, 80);
		strokeWeight(1.5);
		noFill();
		
		// Contorno superior
		beginShape();
		for (let p of this.puntosSuperior) vertex(p.x, p.y);
		endShape();
		
		// Contorno inferior
		beginShape();
		for (let p of this.puntosInferior) vertex(p.x, p.y);
		endShape();
	}

	dibujar() {
		if (this.puntosSuperior.length === 0) return;

		if (this.tipoHorizontal === 'fragmentada') {
			this.dibujarFragmentada();
			if (this.fragmentoIzquierdo && this.puntosSuperiorIzq) {
				this.dibujarFragmentoIzquierdo();
			}
			if (this.fragmentoDerecho && this.puntosSuperiorDer) {
				this.dibujarFragmentoDerecho();
			}
			return;
		}

		// Dibujar banda principal con relleno
		fill(this.paleta.getColorBandas());
		noStroke();
		beginShape();
		for (let p of this.puntosSuperior) vertex(p.x, p.y);
		for (let i = this.puntosInferior.length - 1; i >= 0; i--) vertex(this.puntosInferior[i].x, this.puntosInferior[i].y);
		endShape(CLOSE);
// AGREGAR ESTO - EFECTO DE PROFUNDIDAD

	this.dibujarBordeLuz();

		// Añadir contorno para definición
		this.dibujarContorno();

		// Extremos redondeados de la banda principal
		push();
		blendMode(BLEND);
		fill(this.paleta.getColorBandas());
		noStroke();
		
		if (this.inicioX > 5) {
			this.dibujarExtremoRedondo(this.puntosSuperior, this.puntosInferior, this.inicioX);
		}
		if (this.finX < width - 5) {
			this.dibujarExtremoRedondo(this.puntosSuperior, this.puntosInferior, this.finX);
		}
		pop();
		
		if (this.fragmentoIzquierdo && this.puntosSuperiorIzq) {
			this.dibujarFragmentoIzquierdo();
		}
		if (this.fragmentoDerecho && this.puntosSuperiorDer) {
			this.dibujarFragmentoDerecho();
		}
	}
	
	dibujarFragmentoIzquierdo() {
		if (!this.puntosSuperiorIzq || this.puntosSuperiorIzq.length === 0) return;
		
		fill(this.paleta.getColorBandas());
		noStroke();
		beginShape();
		for (let p of this.puntosSuperiorIzq) vertex(p.x, p.y);
		for (let i = this.puntosInferiorIzq.length - 1; i >= 0; i--) vertex(this.puntosInferiorIzq[i].x, this.puntosInferiorIzq[i].y);
		endShape(CLOSE);
		
		// Contorno del fragmento
		stroke(red(this.paleta.getColorBandas()) * 0.6, 
		       green(this.paleta.getColorBandas()) * 0.6, 
		       blue(this.paleta.getColorBandas()) * 0.6, 80);
		strokeWeight(1.2);
		beginShape();
		for (let p of this.puntosSuperiorIzq) vertex(p.x, p.y);
		endShape();
		beginShape();
		for (let p of this.puntosInferiorIzq) vertex(p.x, p.y);
		endShape();
		noStroke();
		
		push();
		blendMode(BLEND);
		fill(this.paleta.getColorBandas());
		noStroke();
		let finXIzq = this.tamanioFragmentoIzq;
		this.dibujarExtremoRedondo(this.puntosSuperiorIzq, this.puntosInferiorIzq, 0);
		this.dibujarExtremoRedondo(this.puntosSuperiorIzq, this.puntosInferiorIzq, finXIzq);
		pop();
	}
	
	dibujarFragmentoDerecho() {
		if (!this.puntosSuperiorDer || this.puntosSuperiorDer.length === 0) return;
		
		fill(this.paleta.getColorBandas());
		noStroke();
		beginShape();
		for (let p of this.puntosSuperiorDer) vertex(p.x, p.y);
		for (let i = this.puntosInferiorDer.length - 1; i >= 0; i--) vertex(this.puntosInferiorDer[i].x, this.puntosInferiorDer[i].y);
		endShape(CLOSE);
		
		// Contorno del fragmento
		stroke(red(this.paleta.getColorBandas()) * 0.6, 
		       green(this.paleta.getColorBandas()) * 0.6, 
		       blue(this.paleta.getColorBandas()) * 0.6, 80);
		strokeWeight(1.2);
		beginShape();
		for (let p of this.puntosSuperiorDer) vertex(p.x, p.y);
		endShape();
		beginShape();
		for (let p of this.puntosInferiorDer) vertex(p.x, p.y);
		endShape();
		noStroke();
		
		push();
		blendMode(BLEND);
		fill(this.paleta.getColorBandas());
		noStroke();
		let inicioXDer = width - this.tamanioFragmentoDer;
		this.dibujarExtremoRedondo(this.puntosSuperiorDer, this.puntosInferiorDer, inicioXDer);
		this.dibujarExtremoRedondo(this.puntosSuperiorDer, this.puntosInferiorDer, width);
		pop();
	}

	dibujarConexiones(otraBanda, umbralDistancia = 35) {
		let hayOverlap = !(this.finX < otraBanda.inicioX || otraBanda.finX < this.inicioX);
		if (!hayOverlap) return;

		stroke(this.paleta.getColorBandas());
		strokeWeight(random(1, 2));
		noFill();

		for (let i = 0; i < this.puntosSuperior.length; i++) {
			let p1 = this.puntosSuperior[i];
			for (let j = 0; j < otraBanda.puntosInferior.length; j++) {
				let p2 = otraBanda.puntosInferior[j];
				if (abs(p1.x - p2.x) < 20 && abs(p1.y - p2.y) < umbralDistancia) {
					line(p1.x, p1.y, p2.x, p2.y);
				}
			}
		}
		
		if (this.fragmentoIzquierdo && this.puntosSuperiorIzq) {
			for (let i = 0; i < this.puntosSuperiorIzq.length; i++) {
				let p1 = this.puntosSuperiorIzq[i];
				for (let j = 0; j < otraBanda.puntosInferior.length; j++) {
					let p2 = otraBanda.puntosInferior[j];
					if (abs(p1.x - p2.x) < 20 && abs(p1.y - p2.y) < umbralDistancia) {
						line(p1.x, p1.y, p2.x, p2.y);
					}
				}
			}
		}
		
		if (this.fragmentoDerecho && this.puntosSuperiorDer) {
			for (let i = 0; i < this.puntosSuperiorDer.length; i++) {
				let p1 = this.puntosSuperiorDer[i];
				for (let j = 0; j < otraBanda.puntosInferior.length; j++) {
					let p2 = otraBanda.puntosInferior[j];
					if (abs(p1.x - p2.x) < 20 && abs(p1.y - p2.y) < umbralDistancia) {
						line(p1.x, p1.y, p2.x, p2.y);
					}
				}
			}
		}
	}

	limitarBordes() {
	if (this.puntosSuperior.length === 0) return;
	
	let limiteSuperior = this.yCentro - this.grosor * 0.8;  // Límite máximo hacia arriba
	let limiteInferior = this.yCentro + this.grosor * 0.8;  // Límite máximo hacia abajo
	
	for (let i = 0; i < this.puntosSuperior.length; i++) {
		// Limitar borde superior
		if (this.puntosSuperior[i].y < limiteSuperior) {
			this.puntosSuperior[i].y = limiteSuperior;
		}
		
		// Limitar borde inferior
		if (this.puntosInferior[i].y > limiteInferior) {
			this.puntosInferior[i].y = limiteInferior;
		}
		
		// Asegurar que superior no sea mayor que inferior
		if (this.puntosSuperior[i].y > this.puntosInferior[i].y - 2) {
			this.puntosSuperior[i].y = this.puntosInferior[i].y - 2;
		}
	}


}
	dibujarBordeLuz() {
	// Línea de luz en el borde superior (efecto de volumen)
	stroke(255, 255, 255, 80);
	strokeWeight(1.5);
	noFill();
	beginShape();
	for (let p of this.puntosSuperior) {
		vertex(p.x, p.y);
	}
	endShape();
	
	// Línea de sombra en el borde inferior
	stroke(0, 0, 0, 60);
	strokeWeight(1.5);
	beginShape();
	for (let p of this.puntosInferior) {
		vertex(p.x, p.y);
	}
	endShape();
}

}
