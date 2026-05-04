// CLASE GOTA

class Gota {
	constructor(x, y, tamanio, dentroDeBanda, paleta) {
		this.x = x;
		this.y = y;
		this.tamanioBase = tamanio;
		this.dentroDeBanda = dentroDeBanda;
		this.paleta = paleta;
		this.irregularidad = random(0.7, 1.3);
		this.opacidad = random(80, 180);
	}

	dibujar() {
		push();
		translate(this.x, this.y);

		let radioW = this.tamanioBase * this.irregularidad;
		let radioH = this.tamanioBase * random(0.8, 1.2);

		let colorGota;
		if (this.dentroDeBanda) {
			colorGota = this.paleta.getColorGota(this.opacidad * 0.8);
		} else {
			colorGota = this.paleta.getColorGota(this.opacidad * 0.6);
		}

		fill(colorGota);
		noStroke();

		beginShape();
		let puntos = 24;
		for (let i = 0; i < puntos; i++) {
			let angulo = map(i, 0, puntos, 0, TWO_PI);
			let radioVariacion = map(noise(this.x * 0.01, this.y * 0.01, i * 0.2), 0, 1, 0.6, 1.4);
			let rx = radioW * radioVariacion * cos(angulo);
			let ry = radioH * radioVariacion * sin(angulo);
			vertex(rx, ry);
		}
		endShape(CLOSE);
		pop();
	}
}
