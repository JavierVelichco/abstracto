let textoFranjasHTML;
let barraFranjasHTML;
let ayudaFranjasHTML;

let dibujandoTramoFranja = false;
let inicioTramoFranja = 0;

let modoFranjas = "elegirCantidad";
let cargaCantidadFranjas = 0;
let cantidadFranjasElegida = 0;

let minimoFranjas = 8;
let maximoFranjas = 12;

let guiaFranjas = [];
let franjaActual = 0;

let cursorFranjaX = 0;
let velocidadCursorFranja = 2;

function configurarRangoFranjas() {
    minimoFranjas = 8;
    maximoFranjas = 12;
}

function iniciarEtapaFranjas() {
    configurarRangoFranjas();

    modoFranjas = "elegirCantidad";
    cargaCantidadFranjas = 0;
    cantidadFranjasElegida = minimoFranjas;

    guiaFranjas = [];
    franjaActual = 0;
    cursorFranjaX = 0;
    dibujandoTramoFranja = false;
}

function actualizarFranjasControl() {
    actualizarPanelFranjasHTML();
    if (estado !== FRANJAS) return;

    if (modoFranjas === "elegirCantidad") {
        actualizarEleccionCantidadFranjas();
        return;
    }

    if (modoFranjas === "esperarInicio") {
        dibujarGuiasFranjas();
        dibujarMensajeInicioFranjas();

        if (mouseIsPressed || empezoElSonido) {
            modoFranjas = "pintarFranjas";
            cursorFranjaX = 0;
            franjaActual = 0;
            dibujandoTramoFranja = false;
        }

        return;
    }

    if (modoFranjas === "pintarFranjas") {
        actualizarPinturaFranjas();
        dibujarGuiasFranjas();
        dibujarCursorFranja();
        return;
    }
}



function actualizarEleccionCantidadFranjas() {
    if (mouseIsPressed) {
        cargaCantidadFranjas += 0.012;
        cargaCantidadFranjas = constrain(cargaCantidadFranjas, 0, 1);

        cantidadFranjasElegida = round(
            map(cargaCantidadFranjas, 0, 1, minimoFranjas, maximoFranjas)
        );
    } else if (cargaCantidadFranjas > 0) {
        prepararGuiasFranjas();
        modoFranjas = "esperarInicio";
    }
}

function prepararGuiasFranjas() {
    guiaFranjas = [];

    let margenSuperior = -1;
    let margenInferior = height + 1;

    let espacio = (margenInferior - margenSuperior) / (cantidadFranjasElegida - 1);

    for (let i = 0; i < cantidadFranjasElegida; i++) {
        let y = margenSuperior + i * espacio;
        guiaFranjas.push(y);
    }

    franjaActual = 0;
    cursorFranjaX = 0;
}

function actualizarPinturaFranjas() {
    if (franjaActual >= guiaFranjas.length) {
        estado = CERRADA;
        capaAplicada = true;
        return;
    }

    let y = guiaFranjas[franjaActual];

    let activandoFranja =
        mouseIsPressed || haySonido;

    if (activandoFranja && dibujandoTramoFranja === false) {
        dibujandoTramoFranja = true;
        inicioTramoFranja = cursorFranjaX;
    }

    if (!activandoFranja && dibujandoTramoFranja === true) {
        let finTramo = cursorFranjaX;
        dibujarTramoFranja(inicioTramoFranja, finTramo, y);

        dibujandoTramoFranja = false;
        capaAplicada = true;
    }

    cursorFranjaX += velocidadCursorFranja;

    if (cursorFranjaX > width) {
        if (dibujandoTramoFranja === true) {
            dibujarTramoFranja(inicioTramoFranja, width, y);
            dibujandoTramoFranja = false;
            capaAplicada = true;
        }

        cursorFranjaX = 0;
        franjaActual++;
    }
}

function calcularZonaFranja(x, largo) {
    let zona = "centro";
    let margenLateral = 90;

    if (x <= margenLateral && x + largo >= width - margenLateral) {
        zona = "larga";
    } else if (x <= margenLateral) {
        zona = "izq";
    } else if (x + largo >= width - margenLateral) {
        zona = "der";
    }

    return zona;
}

function dibujarTramoFranja(x1, x2, y) {
    let x = min(x1, x2);
    let largo = abs(x2 - x1);

    if (largo < 18) return;

    let alto = random(22, 40);
    let zona = calcularZonaFranja(x, largo);

    if (paleta === 0) {
        hacerFranja(
            x,
            y,
            largo,
            alto,
            random(0.009, 0.018),
            random(8, 18),
            zona
        );
    }

    if (paleta === 1) {
        hacerFranjaAmarilla(x, y, largo, alto, zona);
    }

    if (paleta === 2) {
        hacerFranjaVerde(x, y, largo, alto, zona);
    }

    if (paleta === 3) {
        hacerFranjaCobalto(x, y, largo, alto, zona);
    }
}

function dibujarBarraCantidadFranjas() {
    push();

    noStroke();

    fill(255, 35);
    rect(width + 20, 80, 18, 260, 9);

    fill(255, 210);
    let h = map(cargaCantidadFranjas, 0, 1, 0, 260);
    rect(width + 20, 340 - h, 18, h, 9);

    fill(255);
    textSize(13);
    textAlign(LEFT, TOP);

    text(
        "Franjas: " + cantidadFranjasElegida +
        "\n\nMantené presionado\npara elegir cantidad.\n\nSoltá para confirmar.",
        width + 50,
        80
    );

    pop();
}

function dibujarMensajeInicioFranjas() {
    push();

    noStroke();
    fill(0, 150);
    rect(40, height / 2 - 55, width - 80, 110, 18);

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(17);
    text(
        "Cantidad elegida: " + cantidadFranjasElegida +
        "\nHacé click para empezar a dibujar la primera franja",
        width / 2,
        height / 2
    );

    pop();
}

function dibujarGuiasFranjas() {
    push();

    stroke(255, 45);
    strokeWeight(1);

    for (let i = 0; i < guiaFranjas.length; i++) {
        line(0, guiaFranjas[i], width, guiaFranjas[i]);
    }

    pop();
}

function dibujarCursorFranja() {
    if (franjaActual >= guiaFranjas.length) return;

    push();

    noStroke();
    fill(255, 190);
    ellipse(cursorFranjaX, guiaFranjas[franjaActual], 10, 10);

    pop();
}

function actualizarPanelFranjasHTML() {
    if (!textoFranjasHTML || !barraFranjasHTML || !ayudaFranjasHTML) return;

    textoFranjasHTML.html("Franjas: " + cantidadFranjasElegida);

    let porcentaje = cargaCantidadFranjas * 100;
    barraFranjasHTML.style("width", porcentaje + "%");

    if (modoFranjas === "elegirCantidad") {
        ayudaFranjasHTML.html("Mantené presionado para cargar cantidad. Soltá para confirmar.");
    }

    if (modoFranjas === "esperarInicio") {
        ayudaFranjasHTML.html("Cantidad confirmada. Hacé click para empezar a dibujar.");
    }

    if (modoFranjas === "pintarFranjas") {
        ayudaFranjasHTML.html("Dibujando franja " + (franjaActual + 1) + " de " + cantidadFranjasElegida);
    }
}