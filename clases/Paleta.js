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
		let rBandas, gBandas, bBandas;

		do {
			rBandas = random(80, 220);
			gBandas = random(80, 220);
			bBandas = random(80, 220);
		} while (
			(rBandas > 200 && gBandas > 200 && bBandas > 200) ||
			(rBandas < 80 && gBandas < 80 && bBandas < 80)
		);

		this.colorBandas = color(rBandas, gBandas, bBandas);

		this.opacidadGotas = random(120, 220);
	}

	getColorFondo() { return this.colorFondo; }
	getColorBandas() { return this.colorBandas; }
	
	getColorGota(opacidadPersonalizada = null) {
		let op = opacidadPersonalizada !== null ? opacidadPersonalizada : this.opacidadGotas;
		return color(red(this.colorGotas), green(this.colorGotas), blue(this.colorGotas), op);
	}
}

