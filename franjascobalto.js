function generarFranjasCobalto() {
  let cantidad = floor(random(10, 12));
  let posicionesY = [];
  let distanciaMinima = 80;
  let intentos = 0;

  while (posicionesY.length < cantidad && intentos < 900) {
    let y = random(-15, height + 15);

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

  for (let i = 0; i < posicionesY.length; i++) {
    let y = posicionesY[i];

    let tipo = random([
      "larga",
      "larga",
      "larga",
      "media",
      "corta",
      "corta",
      "doble",
      "fragmentada"
    ]);

    let alto = random(22, 36);

    if (tipo === "larga") {
      hacerFranjaCobalto(
        random(-90, -25),
        y,
        width + random(80, 180),
        alto,
        "larga"
      );
    }

    if (tipo === "media") {
      hacerFranjaCobalto(
        random(-70, 160),
        y,
        random(320, 620),
        alto,
        "centro"
      );
    }

    if (tipo === "corta") {
      hacerFranjaCobalto(
        random(-60, width - 160),
        y,
        random(220, 420),
        alto,
        "centro"
      );
    }

    if (tipo === "doble") {
      hacerFranjaCobalto(
        random(-80, 20),
        y,
        random(180, 360),
        alto,
        "izq"
      );

      hacerFranjaCobalto(
        random(width * 0.48, width * 0.78),
        y + random(-5, 5),
        random(170, 380),
        alto * random(0.85, 1.1),
        "der"
      );
    }

    if (tipo === "fragmentada") {
      let xActual = random(-70, 80);
      let partes = floor(random(2, 4));

      for (let j = 0; j < partes; j++) {
        let l = random(110, 260);

        hacerFranjaCobalto(
          xActual,
          y + random(-4, 4),
          l,
          alto * random(0.8, 1.05),
          "centro"
        );

        xActual += l + random(80, 170);
      }
    }
  }
}

function hacerFranjaCobalto(x, y, largo, grosor, zona = "centro") {
  fondo.noStroke();

  let paso = 4;
  let semilla = random(10000);

  let arriba = [];
  let abajo = [];

  function datosEn(t) {
    let centro = map(noise(t * 1.8, semilla), 0, 1, -8, 8);

    let xActual = x + t * largo;

    let ensancheLateral = 1;
    let fadeMin = 0.55;

    if (zona === "izq") {
      let cercaniaIzq = constrain(
        map(xActual, 0, width * 0.28, 1, 0),
        0,
        1
      );

      ensancheLateral = map(cercaniaIzq, 0, 1, 1, 2.1);
      fadeMin = map(cercaniaIzq, 0, 1, 0.55, 0.78);
    }

    if (zona === "der") {
      let cercaniaDer = constrain(
        map(xActual, width * 0.72, width, 0, 1),
        0,
        1
      );

      ensancheLateral = map(cercaniaDer, 0, 1, 1, 2.1);
      fadeMin = map(cercaniaDer, 0, 1, 0.55, 0.78);
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

      let cercania = max(cercaniaIzq, cercaniaDer);

      ensancheLateral = map(cercania, 0, 1, 1, 2.1);
      fadeMin = map(cercania, 0, 1, 0.55, 0.78);
    }

    let fadeInicio = constrain(map(t, 0, 0.10, fadeMin, 1), 0, 1);
    let fadeFinal = constrain(map(t, 0.90, 1, 1, fadeMin), 0, 1);

    if (zona === "izq") fadeInicio = 1;
    if (zona === "der") fadeFinal = 1;

    if (zona === "larga") {
      fadeInicio = 1;
      fadeFinal = 1;
    }

    let fade = fadeInicio * fadeFinal;

    let espesor =
      grosor *
      ensancheLateral *
      map(noise(t * 0.9, semilla + 200), 0, 1, 0.45, 1.45) *
      fade;

    espesor *= map(noise(t * 6.5, semilla + 700), 0, 1, 0.65, 1.2);
    espesor *= map(noise(t * 1.8, semilla + 1700), 0, 1, 0.75, 1.55);

    let bordeArriba = map(noise(t * 14, semilla + 500), 0, 1, -8, 8);
    let bordeAbajo = map(noise(t * 14, semilla + 900), 0, 1, -8, 8);

    return { centro, espesor, bordeArriba, bordeAbajo };
  }

  // silueta cerrada
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

  // sombra externa suave
  fondo.fill(14, 30, 38, 80);
  fondo.beginShape();
  for (let p of arriba) fondo.curveVertex(p.x, p.y - 1.5);
  for (let i = abajo.length - 1; i >= 0; i--) {
    fondo.curveVertex(abajo[i].x, abajo[i].y + 1.5);
  }
  fondo.endShape(CLOSE);

  // cuerpo base
  fondo.fill(25, 120, 215, 215);
  fondo.beginShape();
  for (let p of arriba) fondo.curveVertex(p.x, p.y);
  for (let i = abajo.length - 1; i >= 0; i--) {
    fondo.curveVertex(abajo[i].x, abajo[i].y);
  }
  fondo.endShape(CLOSE);

  // textura interna
  for (let s = 0; s < grosor * 1.4; s++) {
    let py = y + randomGaussian() * grosor * 0.12;

    for (let i = 0; i < largo; i += 5) {
      let t = i / largo;
      let d = datosEn(t);

      py += map(noise(t * 8, s * 20, semilla + 800), 0, 1, -1.2, 1.2);

      let limite = d.espesor * 0.38;
      let pyFinal = y + d.centro + constrain(py - y, -limite, limite);

      let n = noise((x + i) * 0.025, pyFinal * 0.025, semilla);

      fondo.fill(
        18 + n * 55,
        90 + n * 75,
        175 + n * 75,
        random(18, 42)
      );

      fondo.ellipse(
        x + i,
        pyFinal + random(-2, 2),
        random(5, 16),
        random(1.5, 6)
      );
    }
  }

  // borde orgánico por acumulación de pigmento
  for (let i = 0; i < arriba.length; i += 2) {
    let p = arriba[i];

    fondo.noStroke();
    fondo.fill(8, 25, 35, random(20, 55));

    fondo.ellipse(
      p.x + random(-2, 2),
      p.y + random(-1, 1),
      random(4, 12),
      random(1, 4)
    );
  }

  for (let i = 0; i < abajo.length; i += 2) {
    let p = abajo[i];

    fondo.noStroke();
    fondo.fill(8, 25, 35, random(20, 55));

    fondo.ellipse(
      p.x + random(-2, 2),
      p.y + random(-1, 1),
      random(4, 12),
      random(1, 4)
    );
  }

  fondo.noStroke();
}