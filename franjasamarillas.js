function generarFranjasAmarillas() {
  let cantidad = floor(random(10, 13));

  let margenSuperior = 15;
  let margenInferior = 15;

  let espacio =
    (height - margenSuperior - margenInferior) /
    (cantidad - 1);

  for (let i = 0; i < cantidad; i++) {
    let y =
      margenSuperior +
      i * espacio +
      random(-espacio * 0.14, espacio * 0.14);

    let tipo = random([
      "larga",
      "larga",
      "larga",
      "media",
      "media",
      "lateral",
      "doble"
    ]);

    let alto = random(26, 42);

    if (tipo === "larga") {
      hacerFranjaAmarilla(
        random(-90, -30),
        y,
        width + random(80, 170),
        alto,
        "larga"
      );
    }

    if (tipo === "media") {
      hacerFranjaAmarilla(
        random(width * 0.10, width * 0.35),
        y,
        random(360, 650),
        alto * random(0.85, 1.05),
        "centro"
      );
    }

    if (tipo === "lateral") {
      if (random() < 0.5) {
        hacerFranjaAmarilla(
          -90,
          y,
          random(240, 430),
          alto,
          "izq"
        );
      } else {
        hacerFranjaAmarilla(
          random(width * 0.62, width * 0.82),
          y,
          random(240, 450),
          alto,
          "der"
        );
      }
    }

    if (tipo === "doble") {
      hacerFranjaAmarilla(
        -90,
        y,
        random(180, 330),
        alto,
        "izq"
      );

      hacerFranjaAmarilla(
        random(width * 0.58, width * 0.78),
        y + random(-4, 4),
        random(180, 360),
        alto,
        "der"
      );
    }
  }
}

function hacerFranjaAmarilla(x, y, largo, grosor, zona = "centro") {
  fondo.noStroke();

  let pasos = int(largo / 4);
  let semilla = random(10000);

  let frecuencia1 = random(0.25, 0.65);
  let frecuencia2 = random(1.1, 2.1);
  let fase1 = random(TWO_PI);
  let fase2 = random(TWO_PI);

  function centroEn(t) {
    let curvaGrande = sin(t * TWO_PI * frecuencia1 + fase1) * grosor * 0.18;
    let curvaChica = sin(t * TWO_PI * frecuencia2 + fase2) * grosor * 0.08;
    let ruido = map(
      noise(t * 2.3, semilla),
      0,
      1,
      -grosor * 0.20,
      grosor * 0.20
    );

    return y + curvaGrande + curvaChica + ruido;
  }

  function diametroEn(t) {
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

    let fadeInicio = constrain(map(t, 0, 0.08, fadeMin, 1), 0, 1);
    let fadeFinal = constrain(map(t, 0.92, 1, 1, fadeMin), 0, 1);

    if (zona === "izq") fadeInicio = 1;
    if (zona === "der") fadeFinal = 1;

    if (zona === "larga") {
      fadeInicio = 1;
      fadeFinal = 1;
    }

    let fade = fadeInicio * fadeFinal;

    let bultoLento = map(noise(t * 0.9, semilla + 500), 0, 1, 0.60, 1.65);
    let bultoMedio = map(noise(t * 3.2, semilla + 800), 0, 1, 0.78, 1.25);
    let mordida = map(noise(t * 8.5, semilla + 1200), 0, 1, 0.82, 1.12);

    return grosor *
      ensancheLateral *
      bultoLento *
      bultoMedio *
      mordida *
      fade;
  }

  function mezclaGrisPorLateral(px) {
    let borde = min(px / width, (width - px) / width);
    return constrain(map(borde, 0, 0.24, 1, 0), 0, 1);
  }

  function colorFranja(px, n, alpha) {
    let mezclaGris = mezclaGrisPorLateral(px);

    let amarilloR = 210 + n * 35;
    let amarilloG = 155 + n * 45;
    let amarilloB = 18 + n * 20;

    let grisR = 165 + n * 25;
    let grisG = 165 + n * 20;
    let grisB = 150 + n * 18;

    let r = lerp(amarilloR, grisR, mezclaGris);
    let g = lerp(amarilloG, grisG, mezclaGris);
    let b = lerp(amarilloB, grisB, mezclaGris);

    fondo.fill(r, g, b, alpha);
  }

  // sombra continua
  for (let i = 0; i < pasos; i++) {
    let t = i / (pasos - 1);
    let px = x + t * largo;
    let centro = centroEn(t);
    let d = diametroEn(t);

    let mezclaGris = mezclaGrisPorLateral(px);

    let r = lerp(70, 80, mezclaGris);
    let g = lerp(48, 75, mezclaGris);
    let b = lerp(18, 75, mezclaGris);

    fondo.fill(r, g, b, 90);
    fondo.ellipse(px, centro, d * 1.45, d * 1.12);
  }

  // cuerpo por acumulación de capas
  for (let capa = 0; capa < 15; capa++) {
    let offsetY = map(capa, 0, 14, -grosor * 0.22, grosor * 0.22);

    for (let i = 0; i < pasos; i++) {
      let t = i / (pasos - 1);
      let px = x + t * largo;
      let centro = centroEn(t);
      let d = diametroEn(t);

      let n = noise(t * 1.3, semilla + 2000 + capa * 20);

      colorFranja(px, n, random(95, 165));

      fondo.ellipse(
        px + random(-1.5, 1.5),
        centro + offsetY + random(-2, 2),
        d * random(1.05, 1.35),
        d * random(0.65, 0.92)
      );
    }
  }

  // veladura gris cálida cerca de laterales
  for (let i = 0; i < largo * 0.45; i++) {
    let px = random(x, x + largo);
    let t = constrain((px - x) / largo, 0, 1);
    let centro = centroEn(t);
    let d = diametroEn(t);

    let mezclaGris = mezclaGrisPorLateral(px);

    if (mezclaGris > 0.15) {
      fondo.fill(
        175,
        175,
        165,
        random(12, 38) * mezclaGris
      );

      fondo.ellipse(
        px,
        centro + random(-d * 0.36, d * 0.36),
        random(8, 28),
        random(3, 10)
      );
    }
  }

  // brillos amarillos centrales
  for (let i = 0; i < largo * 0.28; i++) {
    let px = random(x, x + largo);
    let t = constrain((px - x) / largo, 0, 1);
    let centro = centroEn(t);
    let d = diametroEn(t);

    let mezclaGris = mezclaGrisPorLateral(px);

    if (mezclaGris < 0.55) {
      fondo.fill(
        240,
        195,
        35,
        random(12, 38) * (1 - mezclaGris)
      );

      fondo.ellipse(
        px,
        centro + random(-d * 0.32, d * 0.32),
        random(10, 34),
        random(3, 11)
      );
    }
  }

  // granulado interno
  for (let i = 0; i < largo * 0.8; i++) {
    let px = random(x, x + largo);
    let t = constrain((px - x) / largo, 0, 1);
    let centro = centroEn(t);
    let d = diametroEn(t);

    let mezclaGris = mezclaGrisPorLateral(px);

    if (random() < 0.55) {
      fondo.fill(
        lerp(80, 95, mezclaGris),
        lerp(55, 90, mezclaGris),
        lerp(20, 80, mezclaGris),
        random(18, 55)
      );
    } else {
      fondo.fill(
        lerp(230, 180, mezclaGris),
        lerp(185, 178, mezclaGris),
        lerp(55, 160, mezclaGris),
        random(10, 32)
      );
    }

    fondo.ellipse(
      px,
      centro + random(-d * 0.42, d * 0.42),
      random(1, 3),
      random(1, 3)
    );
  }

  fondo.noStroke();
}