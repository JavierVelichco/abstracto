function generarFranjasmarrones() {
  let cantidad = floor(random(9, 12));

  let margenSuperior = -20;
  let margenInferior = -20;

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

    if (!seToca) posicionesY.push(y);

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
      hacerFranja(-90, f.y, width + 180, alto, escala, onda, "larga");
    }

    if (f.tipo === "izquierda") {
      hacerFranja(-90, f.y, random(300, 470), alto, escala, onda, "izq");
    }

    if (f.tipo === "derecha") {
      hacerFranja(
        random(width * 0.45, width * 0.68),
        f.y,
        width,
        alto,
        escala,
        onda,
        "der"
      );
    }

    if (f.tipo === "doble") {
      hacerFranja(-90, f.y, random(250, 380), alto, escala, onda, "izq");

      hacerFranja(
        random(width * 0.62, width * 0.78),
        f.y + random(-5, 5),
        random(300, 460),
        alto,
        escala,
        onda,
        "der"
      );
    }

    if (f.tipo === "medio") {
      hacerFranja(
        random(width * 0.28, width * 0.42),
        f.y,
        random(180, 300),
        alto,
        escala,
        onda,
        "centro"
      );
    }

    if (f.tipo === "mitad") {
      hacerFranja(
        -90,
        f.y,
        random(width * 0.65, width * 0.85),
        alto,
        escala,
        onda,
        "izq"
      );
    }
  }
}

function hacerFranja(x, y, largo, alto, escala = 0.012, onda = 14, zona = "centro") {
  fondo.noStroke();

  let paso = 4;
  let semilla = random(10000);

  let arriba = [];
  let abajo = [];

  let baseR = random(88, 126);
  let baseG = random(72, 100);
  let baseB = random(54, 82);

  function datosEn(t) {
    let centro = map(noise(t * 1.8, semilla), 0, 1, -onda * 0.35, onda * 0.35);

    let xActual = x + t * largo;

    let ensancheLateral = 1;

    if (zona === "izq") {
      let cercaniaIzq = constrain(
        map(xActual, 0, width * 0.28, 1, 0),
        0,
        1
      );

      ensancheLateral = map(cercaniaIzq, 0, 1, 1, 2.15);
    }

    if (zona === "der") {
      let cercaniaDer = constrain(
        map(xActual, width * 0.72, width, 0, 1),
        0,
        1
      );

      ensancheLateral = map(cercaniaDer, 0, 1, 1, 2.15);
    }

    if (zona === "larga") {
      let cercaniaIzq = constrain(
        map(xActual, 0, width * 0.22, 1, 0),
        0,
        1
      );

      let cercaniaDer = constrain(
        map(xActual, width * 0.78, width, 0, 1),
        0,
        1
      );

      let cercaniaLateral = max(cercaniaIzq, cercaniaDer);
      ensancheLateral = map(cercaniaLateral, 0, 1, 1, 2.15);
    }

    let fadeInicio = constrain(map(t, 0, 0.10, 0.45, 1), 0, 1);
    let fadeFinal = constrain(map(t, 0.90, 1, 1, 0.45), 0, 1);

    if (zona === "izq") fadeInicio = 1;
    if (zona === "der") fadeFinal = 1;

    if (zona === "larga") {
      fadeInicio = 1;
      fadeFinal = 1;
    }

    let fade = fadeInicio * fadeFinal;

    let espesor =
      alto *
      ensancheLateral *
      map(noise(t * 0.9, semilla + 200), 0, 1, 0.55, 1.35) *
      fade;

    espesor *= map(noise(t * 6.5, semilla + 700), 0, 1, 0.75, 1.18);
    espesor *= map(noise(t * 1.8, semilla + 1700), 0, 1, 0.82, 1.42);

    let bordeArriba = map(noise(t * 14, semilla + 500), 0, 1, -5, 5);
    let bordeAbajo = map(noise(t * 14, semilla + 900), 0, 1, -5, 5);

    return { centro, espesor, bordeArriba, bordeAbajo };
  }

  for (let px = 0; px <= largo; px += paso) {
    let t = px / largo;
    let d = datosEn(t);

    arriba.push({
      x: x + px,
      y: y + d.centro - d.espesor / 2 + d.bordeArriba
    });

    abajo.push({
      x: x + px,
      y: y + d.centro + d.espesor / 2 + d.bordeAbajo
    });
  }

  fondo.fill(7, 6, 5, 125);
  fondo.beginShape();
  for (let p of arriba) fondo.curveVertex(p.x, p.y - 3);
  for (let i = abajo.length - 1; i >= 0; i--) {
    fondo.curveVertex(abajo[i].x, abajo[i].y + 3);
  }
  fondo.endShape(CLOSE);

  fondo.fill(32, 24, 18, 75);
  fondo.beginShape();
  for (let p of arriba) fondo.curveVertex(p.x, p.y - 1.5);
  for (let i = abajo.length - 1; i >= 0; i--) {
    fondo.curveVertex(abajo[i].x, abajo[i].y + 1.5);
  }
  fondo.endShape(CLOSE);

  fondo.fill(baseR, baseG, baseB, 225);
  fondo.beginShape();
  for (let p of arriba) fondo.curveVertex(p.x, p.y);
  for (let i = abajo.length - 1; i >= 0; i--) {
    fondo.curveVertex(abajo[i].x, abajo[i].y);
  }
  fondo.endShape(CLOSE);

  if (random() < 0.55) {
    fondo.fill(92, 76, 105, 34);
  } else {
    fondo.fill(145, 120, 72, 36);
  }

  fondo.beginShape();
  for (let p of arriba) fondo.curveVertex(p.x, p.y + 3);
  for (let i = abajo.length - 1; i >= 0; i--) {
    fondo.curveVertex(abajo[i].x, abajo[i].y - 3);
  }
  fondo.endShape(CLOSE);

  for (let s = 0; s < alto * 1.6; s++) {
    let py = y + randomGaussian() * alto * 0.14;

    for (let i = 0; i < largo; i += 5) {
      let t = i / largo;
      let d = datosEn(t);

      py += map(noise(t * 8, s * 20, semilla + 800), 0, 1, -1.1, 1.1);

      let limite = d.espesor * 0.38;
      let pyFinal = y + d.centro + constrain(py - y, -limite, limite);

      let n = noise((x + i) * 0.03, pyFinal * 0.03, semilla);

      fondo.fill(
        baseR + map(n, 0, 1, -24, 24),
        baseG + map(n, 0, 1, -18, 18),
        baseB + map(n, 0, 1, -14, 24),
        random(18, 48)
      );

      fondo.ellipse(
        x + i,
        pyFinal + random(-2, 2),
        random(3, 10),
        random(1.2, 5)
      );
    }
  }

  for (let i = 0; i < largo * 3.2; i++) {
    let px = random(x, x + largo);
    let t = constrain((px - x) / largo, 0, 1);
    let d = datosEn(t);

    let py = y + d.centro + randomGaussian() * d.espesor * 0.24;

    fondo.fill(30, 23, 19, random(10, 34));
    fondo.ellipse(px, py, random(2, 7), random(1, 4));
  }

  for (let i = 0; i < largo * 1.5; i++) {
    let px = random(x, x + largo);
    let t = constrain((px - x) / largo, 0, 1);
    let d = datosEn(t);

    let py = y + d.centro + randomGaussian() * d.espesor * 0.22;

    if (random() < 0.5) {
      fondo.fill(92, 86, 124, random(7, 22));
    } else {
      fondo.fill(130, 116, 76, random(7, 24));
    }

    fondo.ellipse(px, py, random(1.5, 6), random(0.8, 3));
  }

  for (let i = 0; i < arriba.length; i += 2) {
    let p = arriba[i];

    fondo.fill(7, 6, 5, random(20, 58));
    fondo.ellipse(
      p.x + random(-2, 2),
      p.y + random(-1, 1),
      random(3, 10),
      random(1, 4)
    );
  }

  for (let i = 0; i < abajo.length; i += 2) {
    let p = abajo[i];

    fondo.fill(7, 6, 5, random(20, 58));
    fondo.ellipse(
      p.x + random(-2, 2),
      p.y + random(-1, 1),
      random(3, 10),
      random(1, 4)
    );
  }

  fondo.noStroke();
}