function generarFranjasVerdes() {
  let cantidad = floor(random(9, 12));
  let margenSuperior = 10;
  let margenInferior = height - 10;
  let espacio = (margenInferior - margenSuperior) / (cantidad - 1);

  for (let i = 0; i < cantidad; i++) {
    let y = margenSuperior + i * espacio + random(-espacio * 0.12, espacio * 0.12);

    let tipo = random([
      "larga",
      "larga",
      "lateral",
      "media",
      "media",
      "corta",
      "doble"
    ]);

    let alto = random(28, 44);

    if (tipo === "larga") {
      hacerFranjaVerde(
        random(-80, -30),
        y,
        width + random(80, 160),
        alto,
        "larga"
      );
    }

    if (tipo === "lateral") {
      if (random() < 0.5) {
        hacerFranjaVerde(-90, y, random(240, 460), alto, "izq");
      } else {
        hacerFranjaVerde(
          random(width * 0.68, width * 0.88),
          y,
          random(240, 460),
          alto,
          "der"
        );
      }
    }

    if (tipo === "media") {
      hacerFranjaVerde(
        random(width * 0.28, width * 0.48),
        y,
        random(220, 430),
        alto * 0.85,
        "centro"
      );
    }

    if (tipo === "corta") {
      hacerFranjaVerde(
        random(width * 0.28, width * 0.62),
        y,
        random(120, 240),
        alto * 0.75,
        "centro"
      );
    }

    if (tipo === "doble") {
      hacerFranjaVerde(-90, y, random(170, 320), alto, "izq");

      hacerFranjaVerde(
        random(width * 0.68, width * 0.86),
        y + random(-4, 4),
        random(170, 320),
        alto,
        "der"
      );
    }
  }
}

function hacerFranjaVerde(x, y, largo, grosor, zona = "centro") {
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

  // halo/sombra externa verde oscura
  fondo.fill(0, 38, 24, 95);
  fondo.beginShape();
  for (let p of arriba) fondo.curveVertex(p.x, p.y - 3);
  for (let i = abajo.length - 1; i >= 0; i--) {
    fondo.curveVertex(abajo[i].x, abajo[i].y + 3);
  }
  fondo.endShape(CLOSE);

  // segunda sombra verdosa pegada al borde
  fondo.fill(10, 55, 48, 70);
  fondo.beginShape();
  for (let p of arriba) fondo.curveVertex(p.x, p.y - 1.5);
  for (let i = abajo.length - 1; i >= 0; i--) {
    fondo.curveVertex(abajo[i].x, abajo[i].y + 1.5);
  }
  fondo.endShape(CLOSE);

  // cuerpo principal verde pálido
  fondo.fill(145, 180, 135, 225);
  fondo.beginShape();
  for (let p of arriba) fondo.curveVertex(p.x, p.y);
  for (let i = abajo.length - 1; i >= 0; i--) {
    fondo.curveVertex(abajo[i].x, abajo[i].y);
  }
  fondo.endShape(CLOSE);

  // veladura interna amarillenta
  fondo.fill(190, 205, 145, 42);
  fondo.beginShape();
  for (let p of arriba) fondo.curveVertex(p.x, p.y + 3);
  for (let i = abajo.length - 1; i >= 0; i--) {
    fondo.curveVertex(abajo[i].x, abajo[i].y - 3);
  }
  fondo.endShape(CLOSE);

  // textura interna contenida
  for (let s = 0; s < grosor * 1.4; s++) {
    let py = y + randomGaussian() * grosor * 0.12;

    for (let i = 0; i < largo; i += 5) {
      let t = i / largo;
      let d = datosEn(t);

      py += map(noise(t * 8, s * 20, semilla + 800), 0, 1, -1.1, 1.1);

      let limite = d.espesor * 0.38;
      let pyFinal = y + d.centro + constrain(py - y, -limite, limite);

      let n = noise((x + i) * 0.03, pyFinal * 0.03, semilla);

      fondo.fill(
        120 + n * 55,
        155 + n * 55,
        115 + n * 40,
        random(18, 42)
      );

      fondo.ellipse(
        x + i,
        pyFinal + random(-2, 2),
        random(4, 13),
        random(1.5, 6)
      );
    }
  }

  // borde orgánico verde por acumulación de pigmento
  for (let i = 0; i < arriba.length; i += 2) {
    let p = arriba[i];

    fondo.noStroke();
    fondo.fill(0, 70, 38, random(25, 70));

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
    fondo.fill(0, 70, 38, random(25, 70));

    fondo.ellipse(
      p.x + random(-2, 2),
      p.y + random(-1, 1),
      random(4, 12),
      random(1, 4)
    );
  }

  fondo.noStroke();
}