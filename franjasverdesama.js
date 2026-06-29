
function generarFranjasAmarilloVerde() {
    let cantidad = floor(random(9, 12));

    let margenSuperior = -20;
    let margenInferior = -20;
    let espacio = (height - margenSuperior - margenInferior) / (cantidad - 1);

    let posicionesY = [];
    let distanciaMinima = 65;
    let intentos = 0;

    while (posicionesY.length < cantidad && intentos < 500) {
        let y = random(margenSuperior, height - margenInferior);

        let seToca = false;

        for (let otraY of posicionesY) {
            if (abs(y - otraY) < distanciaMinima) {
                seToca = true;
                break;
            }
        }

        if (!seToca) {
            posicionesY.push(y);
        }

        intentos++;
    }

    posicionesY.sort((a, b) => a - b);

    let minimos = {
        completa: 4,
        doble: 1,
        izquierda: 0,
        derecha: 0,
        medio: 0,
        mitad: 0
    };

    let maximos = {
        completa: 5,
        doble: 2,
        izquierda: 1,
        derecha: 1,
        medio: 1,
        mitad: 1
    };

    let tipos = [];

    for (let tipo in minimos) {
        for (let i = 0; i < minimos[tipo]; i++) {
            tipos.push(tipo);
        }
    }

    while (tipos.length < cantidad) {
        let posibles = [];

        for (let tipo in maximos) {
            let usados = tipos.filter(t => t === tipo).length;
            if (usados < maximos[tipo]) posibles.push(tipo);
        }

        tipos.push(random(posibles));
    }

    tipos = shuffle(tipos);

    for (let i = 0; i < cantidad; i++) {
        let f = {
            tipo: tipos[i],
            y: posicionesY[i]
        };

        let alto = random(26, 36);
        let onda = random(10, 18);
        let escala = random(0.009, 0.018);

        if (f.tipo === "completa") {
            hacerFranjaAmarilloVerde(-90, f.y, width + 180, alto, escala, onda);
        }

        if (f.tipo === "izquierda") {
            hacerFranjaAmarilloVerde(-90, f.y, random(300, 470), alto, escala, onda);
        }

        if (f.tipo === "derecha") {
            hacerFranjaAmarilloVerde(random(width * 0.45, width * 0.68), f.y, width, alto, escala, onda);
        }

        if (f.tipo === "doble") {
            hacerFranjaAmarilloVerde(-90, f.y, random(250, 380), alto, escala, onda);
            hacerFranjaAmarilloVerde(random(width * 0.62, width * 0.78), f.y + random(-5, 5), random(300, 460), alto, escala, onda);
        }

        if (f.tipo === "medio") {
            hacerFranjaAmarilloVerde(random(width * 0.28, width * 0.42), f.y, random(180, 300), alto, escala, onda);
        }

        if (f.tipo === "mitad") {
            hacerFranjaAmarilloVerde(-90, f.y, random(width * 0.65, width * 0.85), alto, escala, onda);
        }
    }
}





function hacerFranjaAmarilloVerde(x, y, largo, alto) {
    fondo.noStroke();

    let paso = 4;
    let semilla = random(10000);

    let arriba = [];
    let abajo = [];

    function centroEn(t) {
        return y + map(noise(t * 1.2, semilla), 0, 1, -6, 6);
    }

    function espesorEn(t) {
        let fadeInicio = constrain(map(t, 0, 0.10, 0.45, 1), 0, 1);
        let fadeFinal = constrain(map(t, 0.90, 1, 1, 0.45), 0, 1);
        let fade = fadeInicio * fadeFinal;

        let bultosGrandes = map(noise(t * 1.4, semilla + 200), 0, 1, 0.75, 1.55);
        let bultosMedios = map(noise(t * 5.2, semilla + 700), 0, 1, 0.82, 1.18);

        return alto * bultosGrandes * bultosMedios * fade;
    }

    function bordeExtra(t, offset) {
        let zona = map(noise(t * 8, semilla + offset), 0, 1, 0.4, 1.0);
        let detalle = map(noise(t * 34, semilla + offset + 500), 0, 1, -1, 1);
        return detalle * zona * 5.5;
    }

    for (let px = 0; px <= largo; px += paso) {
        let t = px / largo;
        let centro = centroEn(t);
        let e = espesorEn(t);

        arriba.push({
            x: x + px,
            y: centro - e / 2 + bordeExtra(t, 2000)
        });

        abajo.push({
            x: x + px,
            y: centro + e / 2 + bordeExtra(t, 3000)
        });
    }

    // sombra verde oscura alrededor
    fondo.fill(15, 65, 35, 115);
    fondo.beginShape();
    for (let p of arriba) fondo.curveVertex(p.x, p.y - 4);
    for (let i = abajo.length - 1; i >= 0; i--) {
        fondo.curveVertex(abajo[i].x, abajo[i].y + 4);
    }
    fondo.endShape(CLOSE);

    // cuerpo base amarillo verdoso
    fondo.fill(205, 210, 110, 215);
    fondo.beginShape();
    for (let p of arriba) fondo.curveVertex(p.x, p.y);
    for (let i = abajo.length - 1; i >= 0; i--) {
        fondo.curveVertex(abajo[i].x, abajo[i].y);
    }
    fondo.endShape(CLOSE);

    // veladuras verdes internas
    for (let i = 0; i < largo * 1.2; i++) {
        let px = random(x, x + largo);
        let t = constrain((px - x) / largo, 0, 1);
        let centro = centroEn(t);
        let e = espesorEn(t);

        fondo.fill(120, 190, 55, random(18, 55));
        fondo.ellipse(
            px,
            centro + random(-e * 0.35, e * 0.35),
            random(16, 52),
            random(5, 18)
        );
    }

    // zonas beige/ocre
    for (let i = 0; i < largo * 0.75; i++) {
        let px = random(x, x + largo);
        let t = constrain((px - x) / largo, 0, 1);
        let centro = centroEn(t);
        let e = espesorEn(t);

        fondo.fill(210, 180, 105, random(14, 44));
        fondo.ellipse(
            px,
            centro + random(-e * 0.32, e * 0.32),
            random(20, 70),
            random(6, 22)
        );
    }

    // brillo amarillo interno
    for (let i = 0; i < largo * 0.45; i++) {
        let px = random(x, x + largo);
        let t = constrain((px - x) / largo, 0, 1);
        let centro = centroEn(t);
        let e = espesorEn(t);

        fondo.fill(225, 235, 80, random(10, 32));
        fondo.ellipse(
            px,
            centro + random(-e * 0.25, e * 0.25),
            random(18, 58),
            random(5, 16)
        );
    }

    // granulado oscuro
    for (let i = 0; i < largo * 1.2; i++) {
        let px = random(x, x + largo);
        let t = constrain((px - x) / largo, 0, 1);
        let centro = centroEn(t);
        let e = espesorEn(t);

        fondo.fill(20, 55, 24, random(35, 95));
        fondo.ellipse(
            px,
            centro + random(-e * 0.45, e * 0.45),
            random(0.8, 2.5),
            random(0.8, 2.5)
        );
    }

    // borde verde oscuro acumulado
    for (let i = 0; i < arriba.length; i += 2) {
        let p = arriba[i];

        fondo.fill(10, 80, 35, random(30, 80));
        fondo.ellipse(
            p.x + random(-2, 2),
            p.y + random(-1, 1),
            random(4, 13),
            random(1, 5)
        );
    }

    for (let i = 0; i < abajo.length; i += 2) {
        let p = abajo[i];

        fondo.fill(10, 80, 35, random(30, 80));
        fondo.ellipse(
            p.x + random(-2, 2),
            p.y + random(-1, 1),
            random(4, 13),
            random(1, 5)
        );
    }
}