// CLASE GOTA PEQUEÑA - Evita las bandas
class GotaPequena {
	constructor(x, y, paleta) {
		this.x = x;
		this.y = y;
		this.paleta = paleta;
		this.tamanio = random(1, 4.5);  // Tamaño pequeño
		this.irregularidad = random(0.7, 1.2);
		this.opacidad = random(30, 90);  // Más transparentes
	}

	dibujar() {
		push();
		translate(this.x, this.y);

		let radioW = this.tamanio * this.irregularidad;
		let radioH = this.tamanio * random(0.8, 1.2);

		// Siempre fuera de banda, así que opacidad reducida
		let colorGota = this.paleta.getColorGota(this.opacidad * 0.5);
		fill(colorGota);
		noStroke();

		beginShape();
		let puntos = 16;  // Menos puntos para optimizar
		for (let i = 0; i < puntos; i++) {
			let angulo = map(i, 0, puntos, 0, TWO_PI);
			let radioVariacion = map(noise(this.x * 0.02, this.y * 0.02, i * 0.3), 0, 1, 0.7, 1.3);
			let rx = radioW * radioVariacion * cos(angulo);
			let ry = radioH * radioVariacion * sin(angulo);
			vertex(rx, ry);
		}
		endShape(CLOSE);
		pop();
	}
}