let memoriaMotas = [];


function generarMotasYManchas() {
  fondo.noStroke();

  // manchas oscuras grandes, pocas y orgánicas
  for (let i = 0; i < 45; i++) {
    let x = random(width);
    let y = random(height);
    let r = random(12, 42);

    for (let capa = 0; capa < 3; capa++) {
      fondo.fill(26, 20, 14, random(40, 90));
      fondo.ellipse(
        x + random(-3, 3),
        y + random(-3, 3),
        r * random(0.8, 1.5),
        r * random(0.7, 1.3)
      );
    }

    fondo.fill(14, 10, 7, random(25, 60));
    fondo.ellipse(
      x + random(-4, 4),
      y + random(-4, 4),
      r * random(0.35, 0.75),
      r * random(0.35, 0.75)
    );
  }

  //  for (let i = 0; i < 22; i++) {
  //    let cx = random(width);
  //    let cy = random(height);
  //    let r = random(14, 30);
  //    let trozos = floor(random(10, 18));

  //    for (let m = 0; m < trozos; m++) {
  //      let ox = cx + randomGaussian() * r * 0.4;
  //      let oy = cy + randomGaussian() * r * 0.4;
  //      fondo.fill(26, 20, 14, random(20, 45));
  //      fondo.ellipse(ox, oy, r * random(0.5, 1.1), r * random(0.4, 0.9));
  //    }

  //    fondo.fill(14, 10, 7, random(20, 45));
  //    fondo.ellipse(
  //      cx + random(-3, 3), cy + random(-3, 3),
  //      r * random(0.3, 0.55), r * random(0.3, 0.5)
  //    );
  //  }

  // grupos de motas (sin contorno duro: varias elipses chicas superpuestas)
  for (let grupo = 0; grupo < 55; grupo++) {
    let cx = random(width);
    let cy = random(height);
    let cantidad = floor(random(6, 22));

    for (let i = 0; i < cantidad; i++) {
      let x = cx + randomGaussian() * random(18, 45);
      let y = cy + randomGaussian() * random(18, 45);

      if (x < 0 || x > width || y < 0 || y > height) continue;

      let r = random(3, 13);

      for (let capa = 0; capa < 4; capa++) {
        fondo.fill(26, 20, 14, random(15, 45));
        fondo.ellipse(
          x + random(-1.5, 1.5),
          y + random(-1.5, 1.5),
          r * random(0.7, 1.3),
          r * random(0.7, 1.3)
        );
      }

      // centro apenas visible (igual que tenías)
      fondo.fill(145, 130, 95, random(25, 75));
      fondo.ellipse(
        x + random(-1.2, 1.2),
        y + random(-1.2, 1.2),
        r * random(0.25, 0.55),
        r * random(0.25, 0.55)
      );
    }
  }

  // micrograno fino (igual que tenías, ya estaba bien)
  for (let i = 0; i < 1800; i++) {
    if (random() < 0.65) {
      fondo.fill(25, 24, 18, random(18, 55));
    } else {
      fondo.fill(170, 150, 105, random(12, 35));
    }

    fondo.ellipse(random(width), random(height), random(0.6, 2.2), random(0.6, 2.2));
  }
}

function generarMotasAmarillas() {

  // manchas oscuras grandes
  for (let i = 0; i < 45; i++) {
    let x = random(width);
    let y = random(height);
    let r = random(14, 55);

    fondo.noStroke();
    fondo.fill(20, 40, 34, random(70, 150));
    fondo.ellipse(x, y, r * random(0.8, 1.6), r * random(0.7, 1.4));

    fondo.fill(5, 16, 14, random(35, 95));
    fondo.ellipse(
      x + random(-3, 3),
      y + random(-3, 3),
      r * random(0.35, 0.75),
      r * random(0.35, 0.75)
    );
  }

  // motas con anillo
  for (let grupo = 0; grupo < 85; grupo++) {
    let cx = random(width);
    let cy = random(height);
    let cantidad = floor(random(8, 26));

    for (let i = 0; i < cantidad; i++) {
      let x = cx + randomGaussian() * random(18, 55);
      let y = cy + randomGaussian() * random(18, 55);

      if (x < 0 || x > width || y < 0 || y > height) continue;

      let r = random(3, 16);

      fondo.noFill();
      fondo.stroke(30, 45, 36, random(80, 170));
      fondo.strokeWeight(random(0.8, 2.4));
      fondo.ellipse(x, y, r * random(0.75, 1.35), r * random(0.75, 1.35));

      fondo.noStroke();
      fondo.fill(190, 155, 65, random(35, 95));
      fondo.ellipse(
        x + random(-1.5, 1.5),
        y + random(-1.5, 1.5),
        r * random(0.25, 0.6),
        r * random(0.25, 0.6)
      );
    }
  }
}

function generarMotasVerdes() {

  for (let grupo = 0; grupo < 42; grupo++) {

    let cx = random(width);
    let cy = random(height);

    let cantidad = floor(random(8, 24));

    for (let i = 0; i < cantidad; i++) {

      let x = cx + randomGaussian() * random(18, 70);
      let y = cy + randomGaussian() * random(18, 70);

      if (x < 0 || x > width || y < 0 || y > height) continue;

      let r = random(2, 20);

      fondo.noStroke();

      // halo difuso
      fondo.fill(70, 95, 70, random(10, 32));
      fondo.ellipse(
        x,
        y,
        r * random(1.5, 2.4),
        r * random(1.5, 2.4)
      );

      // cuerpo principal
      fondo.fill(35, 55, 50, random(45, 105));
      fondo.ellipse(
        x + random(-1, 1),
        y + random(-1, 1),
        r * random(0.8, 1.25),
        r * random(0.8, 1.25)
      );

      // núcleo oscuro solo en algunas
      if (r > 7 && random() < 0.65) {
        fondo.fill(15, 25, 22, random(35, 90));
        fondo.ellipse(
          x + random(-1, 1),
          y + random(-1, 1),
          r * random(0.3, 0.6),
          r * random(0.3, 0.6)
        );
      }
    }
  }

  // algunas manchas grandes aisladas
  for (let i = 0; i < 22; i++) {
    let x = random(width);
    let y = random(height);
    let r = random(16, 48);

    fondo.noStroke();

    fondo.fill(20, 35, 30, random(35, 85));
    fondo.ellipse(
      x,
      y,
      r * random(0.8, 1.4),
      r * random(0.8, 1.4)
    );

    fondo.fill(8, 18, 15, random(20, 55));
    fondo.ellipse(
      x + random(-2, 2),
      y + random(-2, 2),
      r * random(0.35, 0.65),
      r * random(0.35, 0.65)
    );
  }
}

function grupoMotasMarronesLocal(cx, cy) {
  let escala = intensidadPorInsistencia(cx, cy);
  fondo.noStroke();
  if (random() < 0.35) {
    motaMarronGrandeLocal(cx, cy);
  }

  let cantidad = floor(random(6, 22));

  for (let i = 0; i < cantidad; i++) {
    let x = cx + randomGaussian() * random(18, 45) * escala;
    let y = cy + randomGaussian() * random(18, 45) * escala;

    if (x < 0 || x > width || y < 0 || y > height) continue;

    let r = random(3, 13) * escala;

    for (let capa = 0; capa < 4; capa++) {
      fondo.fill(26, 20, 14, random(15, 45));
      fondo.ellipse(
        x + random(-1.5, 1.5),
        y + random(-1.5, 1.5),
        r * random(0.7, 1.3),
        r * random(0.7, 1.3)
      );
    }

    fondo.fill(145, 130, 95, random(25, 75));
    fondo.ellipse(
      x + random(-1.2, 1.2),
      y + random(-1.2, 1.2),
      r * random(0.25, 0.55),
      r * random(0.25, 0.55)
    );
  }
}

function grupoMotasAmarillasLocal(cx, cy) {
  let escala = intensidadPorInsistencia(cx, cy);
  let cantidad = floor(random(8, 26));
  if (random() < 0.35) {
    motaAmarillaGrandeLocal(cx, cy);
  }

  for (let i = 0; i < cantidad; i++) {
    let x = cx + randomGaussian() * random(18, 55) * escala;
    let y = cy + randomGaussian() * random(18, 55) * escala;

    if (x < 0 || x > width || y < 0 || y > height) continue;

    let r = random(3, 16) * escala;

    fondo.noFill();
    fondo.stroke(30, 45, 36, random(80, 170));
    fondo.strokeWeight(random(0.8, 2.4));
    fondo.ellipse(
      x,
      y,
      r * random(0.75, 1.35),
      r * random(0.75, 1.35)
    );

    fondo.noStroke();
    fondo.fill(190, 155, 65, random(35, 95));
    fondo.ellipse(
      x + random(-1.5, 1.5),
      y + random(-1.5, 1.5),
      r * random(0.25, 0.6),
      r * random(0.25, 0.6)
    );
  }
}

function grupoMotasVerdesLocal(cx, cy) {
  let cantidad = floor(random(8, 24));
  let escala = intensidadPorInsistencia(cx, cy);
  if (random() < 0.35) {
    motaVerdeGrandeLocal(cx, cy);
  }

  for (let i = 0; i < cantidad; i++) {
    let x = cx + randomGaussian() * random(18, 70) * escala;
    let y = cy + randomGaussian() * random(18, 70) * escala;

    if (x < 0 || x > width || y < 0 || y > height) continue;

    let r = random(2, 20) * escala;

    fondo.noStroke();

    fondo.fill(70, 95, 70, random(10, 32));
    fondo.ellipse(
      x,
      y,
      r * random(1.5, 2.4),
      r * random(1.5, 2.4)
    );

    fondo.fill(35, 55, 50, random(45, 105));
    fondo.ellipse(
      x + random(-1, 1),
      y + random(-1, 1),
      r * random(0.8, 1.25),
      r * random(0.8, 1.25)
    );

    if (r > 7 && random() < 0.65) {
      fondo.fill(15, 25, 22, random(35, 90));
      fondo.ellipse(
        x + random(-1, 1),
        y + random(-1, 1),
        r * random(0.3, 0.6),
        r * random(0.3, 0.6)
      );
    }
  }
}

function motaMarronGrandeLocal(cx, cy) {
  let r = random(12, 42);

  for (let capa = 0; capa < 3; capa++) {
    fondo.fill(26, 20, 14, random(40, 90));
    fondo.ellipse(
      cx + random(-3, 3),
      cy + random(-3, 3),
      r * random(0.8, 1.5),
      r * random(0.7, 1.3)
    );
  }

  fondo.fill(14, 10, 7, random(25, 60));
  fondo.ellipse(
    cx + random(-4, 4),
    cy + random(-4, 4),
    r * random(0.35, 0.75),
    r * random(0.35, 0.75)
  );
}

function motaAmarillaGrandeLocal(cx, cy) {
  let r = random(14, 55);

  fondo.noStroke();
  fondo.fill(20, 40, 34, random(70, 150));
  fondo.ellipse(
    cx,
    cy,
    r * random(0.8, 1.6),
    r * random(0.7, 1.4)
  );

  fondo.fill(5, 16, 14, random(35, 95));
  fondo.ellipse(
    cx + random(-3, 3),
    cy + random(-3, 3),
    r * random(0.35, 0.75),
    r * random(0.35, 0.75)
  );
}

function motaVerdeGrandeLocal(cx, cy) {
  let r = random(16, 48);

  fondo.noStroke();

  fondo.fill(20, 35, 30, random(35, 85));
  fondo.ellipse(
    cx,
    cy,
    r * random(0.8, 1.4),
    r * random(0.8, 1.4)
  );

  fondo.fill(8, 18, 15, random(20, 55));
  fondo.ellipse(
    cx + random(-2, 2),
    cy + random(-2, 2),
    r * random(0.35, 0.65),
    r * random(0.35, 0.65)
  );
}

function intensidadPorInsistencia(cx, cy) {
  let radioMemoria = 85;
  let intensidad = 1;

  for (let i = 0; i < memoriaMotas.length; i++) {
    let m = memoriaMotas[i];

    if (dist(cx, cy, m.x, m.y) < radioMemoria) {
      intensidad += 0.25;
    }
  }

  memoriaMotas.push({ x: cx, y: cy });

  if (memoriaMotas.length > 120) {
    memoriaMotas.shift();
  }

  return constrain(intensidad, 1, 2.4);
}

function microGranoMarronLocal(cx, cy) {
  for (let i = 0; i < 35; i++) {
    let x = cx + randomGaussian() * 22;
    let y = cy + randomGaussian() * 22;

    if (x < 0 || x > width || y < 0 || y > height) continue;

    if (random() < 0.65) {
      fondo.fill(25, 24, 18, random(18, 55));
    } else {
      fondo.fill(170, 150, 105, random(12, 35));
    }

    fondo.noStroke();
    fondo.ellipse(
      x,
      y,
      random(1.2, 3.2),
      random(1.2, 3.2)
    );
  }
}

function microGranoAmarilloLocal(cx, cy) {
  for (let i = 0; i < 35; i++) {
    let x = cx + randomGaussian() * 24;
    let y = cy + randomGaussian() * 24;

    if (x < 0 || x > width || y < 0 || y > height) continue;

    if (random() < 0.58) {
      fondo.fill(45, 34, 20, random(12, 42));
    } else {
      fondo.fill(230, 185, 70, random(8, 30));
    }

    fondo.noStroke();
    fondo.ellipse(
      x,
      y,
      random(0.6, 2.2),
      random(0.6, 2.2)
    );
  }
}

function microGranoVerdeLocal(cx, cy) {
  for (let i = 0; i < 35; i++) {
    let x = cx + randomGaussian() * 24;
    let y = cy + randomGaussian() * 24;

    if (x < 0 || x > width || y < 0 || y > height) continue;

    fondo.noStroke();

    if (random() < 0.65) {
      fondo.fill(20, 35, 30, random(12, 35));
    } else {
      fondo.fill(70, 95, 70, random(8, 28));
    }

    fondo.ellipse(
      x,
      y,
      random(0.6, 2.2),
      random(0.6, 2.2)
    );
  }
}