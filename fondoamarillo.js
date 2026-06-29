function generarFondoAmarillo() {
  fondo.clear();
  pintarFragmentoFondoAmarillo(width / 2, height / 2, true);
}

function pintarFragmentoFondoAmarillo(cx, cy, completo = false) {

  fondo.noStroke();

  let paso = 2;
  let radio = 100;

  let xMin = completo ? 0 : max(0, cx - radio);
  let xMax = completo ? width : min(width, cx + radio);

  let yMin = completo ? 0 : max(0, cy - radio);
  let yMax = completo ? height : min(height, cy + radio);

  // Base amarilla
  for (let y = yMin; y < yMax; y += paso) {
    for (let x = xMin; x < xMax; x += paso) {

      if (!completo && dist(x, y, cx, cy) > radio) continue;

      let macro = noise(x * 0.002, y * 0.002);
      let medio = noise(x * 0.012, y * 0.012);
      let fino = noise(x * 0.045, y * 0.045);

      let n = macro * 0.55 + medio * 0.35 + fino * 0.10;

      let r = map(n, 0, 1, 118, 210);
      let g = map(n, 0, 1, 95, 165);
      let b = map(n, 0, 1, 42, 70);

      if (completo) {
        fondo.fill(r, g, b);
      } else {
        let a = map(dist(x, y, cx, cy), 0, radio, 255, 20);
        fondo.fill(r, g, b, a);
      }

      fondo.rect(x, y, paso, paso);
    }
  }

  // Veladuras doradas
  let pasoVeladura = 4;

  for (let y = yMin; y < yMax; y += pasoVeladura) {
    for (let x = xMin; x < xMax; x += pasoVeladura) {

      if (!completo && dist(x, y, cx, cy) > radio) continue;

      let nube = noise(x * 0.006 + 400, y * 0.006 + 400);

      if (nube > 0.55) {
        fondo.fill(
          230,
          175,
          35,
          map(nube, 0.55, 1, 6, 32)
        );

        fondo.rect(x, y, pasoVeladura, pasoVeladura);
      }
    }
  }

  // Manchas grisáceas
  let cantidadManchas = completo ? 80 : 6;

  for (let i = 0; i < cantidadManchas; i++) {

    let x, y;

    if (completo) {
      x = random(width);
      y = random(height);
    } else {
      x = random(cx - radio, cx + radio);
      y = random(cy - radio, cy + radio);

      if (dist(x, y, cx, cy) > radio) continue;
    }

    fondo.fill(110, 125, 115, random(18, 45));

    fondo.ellipse(
      x,
      y,
      random(60, 180),
      random(20, 80)
    );
  }

  // Grano fino
  let cantidadGrano = completo ? 11000 : 700;

  for (let i = 0; i < cantidadGrano; i++) {

    let x, y;

    if (completo) {
      x = random(width);
      y = random(height);
    } else {
      x = random(cx - radio, cx + radio);
      y = random(cy - radio, cy + radio);

      if (dist(x, y, cx, cy) > radio) continue;
    }

    if (random() < 0.58) {
      fondo.fill(45, 34, 20, random(12, 42));
    } else {
      fondo.fill(230, 185, 70, random(8, 30));
    }

    fondo.rect(x, y, 1, 1);
  }
}