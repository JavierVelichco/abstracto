function generarFondoBase() {
  fondo.clear();
  pintarFragmentoFondoBase(width / 2, height / 2, true);
}
function pintarFragmentoFondoBase(cx, cy, completo = false) {

  fondo.noStroke();

  let paso = 2;
  let radio = 100;

  let xMin = completo ? 0 : max(0, cx - radio);
  let xMax = completo ? width : min(width, cx + radio);

  let yMin = completo ? 0 : max(0, cy - radio);
  let yMax = completo ? height : min(height, cy + radio);

  for (let y = yMin; y < yMax; y += paso) {

    for (let x = xMin; x < xMax; x += paso) {

      if (!completo) {
        if (dist(x, y, cx, cy) > radio) continue;
      }

      let macro = noise(x * 0.002, y * 0.002);
      let medio = noise(x * 0.014, y * 0.014);

      let n = macro * 0.65 + medio * 0.35;

      let r = map(n, 0, 1, 92, 145);
      let g = map(n, 0, 1, 82, 115);
      let b = map(n, 0, 1, 54, 80);

      if (completo) {
        fondo.fill(r, g, b);
      } else {
        let a = map(dist(x, y, cx, cy), 0, radio, 255, 20);
        fondo.fill(r, g, b, a);
      }

      fondo.rect(x, y, paso, paso);
    }
  }

  let cantidadGrano = completo ? 6500 : 500;

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

    if (random() < 0.55) {
      fondo.fill(45, 38, 25, random(10, 35));
    } else {
      fondo.fill(175, 150, 95, random(8, 25));
    }

    fondo.rect(x, y, 1, 1);
  }
}