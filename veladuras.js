function dentroDeMancha(x, y, cx, cy, radio, semilla) {
  let ang = atan2(y - cy, x - cx);

  let radioDeformado =
    radio *
    map(
      noise(
        cos(ang) * 0.9 + semilla,
        sin(ang) * 0.9 + semilla
      ),
      0,
      1,
      0.65,
      1.25
    );

  radioDeformado *= map(
    noise(x * 0.03 + semilla, y * 0.03 + semilla),
    0,
    1,
    0.85,
    1.15
  );

  return dist(x, y, cx, cy) < radioDeformado;
}






function recorrerTrazoVeladura(x1, y1, x2, y2, funcionVeladura) {
  let pasos = 8;

  for (let i = 0; i < pasos; i++) {
    let t = i / (pasos - 1);
    let x = lerp(x1, x2, t);
    let y = lerp(y1, y2, t);

    funcionVeladura(x, y);
  }
}



function pintarVeladuraMouse(x1, y1, x2, y2) {
  let distancia = dist(x1, y1, x2, y2);
  let pasos = max(1, floor(distancia / 10));

  for (let i = 0; i <= pasos; i++) {
    let t = i / pasos;
    let x = lerp(x1, x2, t);
    let y = lerp(y1, y2, t);

    if (paleta === 0) pintarVeladuraMarron(x, y);
    if (paleta === 1) pintarVeladuraAmarilla(x, y);
    if (paleta === 2) pintarVeladuraVerde(x, y);
    if (paleta === 3) pintarVeladuraCobalto(x, y);
  }

  capaAplicada = true;
}

// Basada en generarVeladurasSuaves()
function pintarVeladuraMarron(cx, cy) {
  fondo.noStroke();

  let radio = 42;

  for (let y = cy - radio; y < cy + radio; y += 4) {
    for (let x = cx - radio; x < cx + radio; x += 4) {
      if (x < 0 || x > width || y < 0 || y > height) continue;
      if (!dentroDeMancha(x, y, cx, cy, radio, 500)) continue;

      let nube = noise(x * 0.006 + 500, y * 0.006 + 500);
      let a = map(nube, 0, 1, 0.5, 3);

      fondo.fill(38, 34, 28, a);
      fondo.rect(x, y, 4, 4);
    }
  }
}

// Variante cálida de la veladura suave
function pintarVeladuraAmarilla(cx, cy) {
  fondo.noStroke();

  let radio = 44;

  for (let y = cy - radio; y < cy + radio; y += 4) {
    for (let x = cx - radio; x < cx + radio; x += 4) {
      if (x < 0 || x > width || y < 0 || y > height) continue;
      if (!dentroDeMancha(x, y, cx, cy, radio, 400)) continue;

      let nube = noise(x * 0.006 + 400, y * 0.006 + 400);
      let a = map(nube, 0, 1, 0.5, 3);

      fondo.fill(175, 145, 75, a);
      fondo.rect(x, y, 4, 4);
    }
  }

  if (random() < 0.025) {
    fondo.fill(105, 112, 104, random(1, 3));
    fondo.ellipse(
      cx + random(-15, 15),
      cy + random(-10, 10),
      random(35, 80),
      random(12, 30)
    );
  }
}

// Basada en generarVeladurasVerdes()
function pintarVeladuraVerde(cx, cy) {
  fondo.noStroke();

  let radio = 46;

  // humedad / verdín principal
  for (let y = cy - radio; y < cy + radio; y += 4) {
    for (let x = cx - radio; x < cx + radio; x += 4) {
      if (x < 0 || x > width || y < 0 || y > height) continue;
      if (!dentroDeMancha(x, y, cx, cy, radio, 1000)) continue;


      let n = noise(x * 0.004 + 1000, y * 0.004 + 1000);
      let a = map(n, 0, 1, 0.5, 4);

      fondo.fill(48, 78, 46, a);
      fondo.rect(x, y, 4, 4);
    }
  }

  // zonas más oscuras de verdín
  for (let y = cy - radio; y < cy + radio; y += 5) {
    for (let x = cx - radio; x < cx + radio; x += 5) {
      if (x < 0 || x > width || y < 0 || y > height) continue;
      if (!dentroDeMancha(x, y, cx, cy, radio, 1800)) continue;

      let n = noise(x * 0.008 + 3000, y * 0.008 + 3000);
      let a = map(n, 0, 1, 0.5, 2.5);

      fondo.fill(32, 55, 36, a);
      fondo.rect(x, y, 5, 5);
    }
  }
}

// Variante fría de la veladura suave
function pintarVeladuraCobalto(cx, cy) {
  fondo.noStroke();

  let radio = 44;

  for (let y = cy - radio; y < cy + radio; y += 4) {
    for (let x = cx - radio; x < cx + radio; x += 4) {
      if (x < 0 || x > width || y < 0 || y > height) continue;
      if (!dentroDeMancha(x, y, cx, cy, radio, 1000)) continue;

      let nube = noise(x * 0.006 + 1800, y * 0.006 + 1800);
      let a = map(nube, 0, 1, 0.5, 3);

      fondo.fill(45, 72, 112, a);
      fondo.rect(x, y, 4, 4);
    }
  }
}






