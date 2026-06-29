let fondo;
let motas = [];
let estado = 0;
let paleta = 0;
let capaAplicada = false;
const INICIO = 0;
const FONDO = 1;
const VELADURA1 = 2;
const MOTAS = 3;
const VELADURA2 = 4;
const FRANJAS = 5;
const CERRADA = 6;
let ultimoTrazo = 0;
let intervaloTrazo = 350;
let tiempoInicioPaleta = 0;
let duracionConfirmarPaleta = 1200;
let estadoCambiadoPorVoz = false;
let guardadoPorVoz = false;
let pausadoDespuesDeGuardar = false;
let tiempoFinPausa = 0;
let duracionPausaGuardado = 3000;

function setup() {
  let canvas = createCanvas(700, 900);
  canvas.parent("canvas-container");

  fondo = createGraphics(width, height);

  textoFranjasHTML = select("#textoFranjas");
  barraFranjasHTML = select("#barraFranjas");
  ayudaFranjasHTML = select("#ayudaFranjas");

  inicializarVoz();
  limpiarTodo();
  actualizarIndicadorPaleta();
}


function draw() {
  background(0);
  image(fondo, 0, 0);

  actualizarFranjasControl();
  actualizarPanel();
  actualizarVoz();
  actualizarVumetro();
  if (pausadoDespuesDeGuardar) {
  mostrarMensajeReinicio();

  if (millis() > tiempoFinPausa) {
    pausadoDespuesDeGuardar = false;
    limpiarTodo();
  }

  return;
}

  elegirPaletaConVoz();

  if (estado !== FRANJAS) {
  cambiarEstadoConVoz();
}

guardarConVoz();

  if (
    haySonido &&
    estado !== INICIO &&
    estado !== CERRADA &&
    millis() - ultimoTrazo > intervaloTrazo
  ) {
    ultimoTrazo = millis();

    let cantidad = floor(map(intensidad, 0, 1, 1, 8));

    for (let i = 0; i < cantidad; i++) {
      pintarConVoz();
    }
  }

  if (estado === FRANJAS && terminoElSonido && dibujandoTramoFranja) {
    let y = guiaFranjas[franjaActual];
    dibujarTramoFranja(inicioTramoFranja, cursorFranjaX, y);
    dibujandoTramoFranja = false;
    capaAplicada = true;
  }


}

function keyPressed() {
  controlarTeclasVoz();

  if (key === "0") limpiarTodo();

  if (key === "q" || key === "Q") {
    paleta = 0;
    actualizarIndicadorPaleta();
  }

  if (key === "w" || key === "W") {
    paleta = 1;
    actualizarIndicadorPaleta();
  }

  if (key === "e" || key === "E") {
    paleta = 2;
    actualizarIndicadorPaleta();
  }

  if (key === "r" || key === "R") {
    paleta = 3;
    actualizarIndicadorPaleta();
  }

  // ENTER: pasa al siguiente estado.
  // Si no pintaste nada todavía, aplica una capa mínima antes de avanzar.
  if (keyCode === ENTER) {
  if (estado === INICIO) {
    estado = FONDO;
    aplicarFondo();
    capaAplicada = true;
    return;
  }

  avanzarEstado();
}

  if ((key === "s" || key === "S") && estado === CERRADA) {
    saveCanvas("obra_por_voz", "png");
    limpiarTodo();
  }
}

function aplicarCapaActual() {
  if (estado === INICIO) {
    estado = FONDO;
    aplicarFondo();
    capaAplicada = true;
    return;
  }

  if (estado === FONDO) {
    aplicarFondo();
    capaAplicada = true;
    return;
  }

  if (estado === VELADURA1 || estado === VELADURA2) {
    aplicarVeladura();
    capaAplicada = true;
    return;
  }

  if (estado === MOTAS) {
    aplicarMotas();
    capaAplicada = true;
    return;
  }

  if (estado === FRANJAS) {
    controlarFranjasConVoz();
    return;
  }
}



function avanzarEstado() {
  if (estado === INICIO) {
    estado = FONDO;
    capaAplicada = false;
    return;
  }

  if (capaAplicada === false) {
    return;
  }

  if (estado === FONDO) {
    estado = VELADURA1;
    capaAplicada = false;
    return;
  }

  if (estado === VELADURA1) {
    estado = MOTAS;
    capaAplicada = false;
    return;
  }

  if (estado === MOTAS) {
    estado = VELADURA2;
    capaAplicada = false;
    return;
  }

  if (estado === VELADURA2) {
    estado = FRANJAS;
    capaAplicada = false;
    iniciarEtapaFranjas();
    return;
  }

if (estado === FRANJAS) {

    if (!franjasTerminadas()) {
        return;
    }

    estado = CERRADA;
    capaAplicada = true;
    return;
}
}

function limpiarTodo() {

  limpiar();

  estado = INICIO;
  capaAplicada = false;
  pinceladasFondo = 0;
}

function dibujarInterfaz() {
  push();
  noStroke();
  fill(0, 160);
  rect(15, 15, 290, 115, 14);

  fill(255);
  textSize(14);
  textAlign(LEFT, TOP);

  text(
    "Estado: " + nombreEstado() +
    "\nPaleta: " + nombrePaleta() +
    "\nAcción: " + accionActual() +
    "\nQ/W/E/R: cambiar paleta",
    30,
    28
  );

  pop();
}

function nombreEstado() {
  if (estado === INICIO) return "INICIO / canvas limpio";
  if (estado === FONDO) return "FONDO";
  if (estado === VELADURA1) return "VELADURA 1";
  if (estado === MOTAS) return "MOTAS";
  if (estado === VELADURA2) return "VELADURA 2";
  if (estado === FRANJAS) return "FRANJAS";
  if (estado === CERRADA) return "OBRA CERRADA";
}

function nombrePaleta() {
  if (paleta === 0) return "marrón";
  if (paleta === 1) return "amarillo / óxido";
  if (paleta === 2) return "verde";
  if (paleta === 3) return "cobalto";
}

function accionActual() {

  if (estado === INICIO)
    return "Voz: elegir paleta | Sonido sostenido: comenzar";

  if (estado === FONDO)
    return "Voz o mouse: construir fondo | ENTER: pasar a veladura 1";

  if (estado === VELADURA1)
    return "Voz o mouse: aplicar primera veladura | ENTER: pasar a motas";

  if (estado === MOTAS)
    return "Voz o mouse: pintar motas | ENTER: pasar a segunda veladura";

  if (estado === VELADURA2)
    return "Voz o mouse: integrar la pintura | ENTER: pasar a franjas";

  if (estado === FRANJAS)
    return "Voz o mouse: pintar franjas | ENTER: cerrar obra";

  if (estado === CERRADA)
    return "S: guardar | 0: nueva obra";
}

function aplicarFondo() {
  generarFondoBase();
}


function aplicarVeladura() {
  switch (paleta) {
    case 0:
      generarVeladurasMarrones();
      break;

    case 1:
      generarVeladurasAmarillas();
      break;

    case 2:
      generarVeladurasVerdes();
      break;

    case 3:
      generarVeladurasCobalto();
      break;
  }
}

function aplicarMotas() {
  switch (paleta) {
    case 0:
      generarMotasYManchas();
      break;
    case 1:
      generarMotasAmarillas();
      break;
    case 2:
      generarMotasVerdes();
      break;
    case 3:
      generarMotasYManchas();
      break;
  }
}

function aplicarFranjas() {
  switch (paleta) {
    case 0:
      generarFranjasmarrones();
      break;
    case 1:
      generarFranjasAmarillas();
      break;
    case 2:
      generarFranjasVerdes();
      break;
    case 3:
      generarFranjasCobalto();
      break;
  }
}

function actualizarPanel() {
  document.getElementById("estadoTexto").innerText = nombreEstado();
  document.getElementById("paletaTexto").innerText = nombrePaleta();
  document.getElementById("accionTexto").innerText = accionActual();
}

function pintarConVoz() {
  let x = random(width);
  let y = random(height);

  if (estado === FONDO) {
    pintarFondoMouse(x, y);
    return;
  }

  if (estado === VELADURA1 || estado === VELADURA2) {
    pintarVeladuraMouse(x, y, x + random(-80, 80), y + random(-80, 80));
    capaAplicada = true;
    return;
  }

  if (estado === MOTAS) {
    pintarMotasMouse(x, y);
    capaAplicada = true;
    return;
  }

  if (estado === FRANJAS) {
    controlarFranjasConVoz();
    return;
  }
}

function controlarFranjasConVoz() {
  if (modoFranjas === "elegirCantidad") {
    cargaCantidadFranjas += map(intensidad, 0, 1, 0.004, 0.02);
    cargaCantidadFranjas = constrain(cargaCantidadFranjas, 0, 1);

    cantidadFranjasElegida = round(
      map(cargaCantidadFranjas, 0, 1, minimoFranjas, maximoFranjas)
    );

    return;
  }

  if (modoFranjas === "esperarInicio") {
    prepararGuiasFranjas();
    modoFranjas = "pintarFranjas";
    cursorFranjaX = 0;
    franjaActual = 0;
    dibujandoTramoFranja = false;
    return;
  }

  if (modoFranjas === "pintarFranjas") {
    if (dibujandoTramoFranja === false) {
      dibujandoTramoFranja = true;
      inicioTramoFranja = cursorFranjaX;
    }
  }
}

function actualizarVumetro() {

  let porcentaje = constrain(intensidad * 100, 0, 100);

  document.getElementById("barraVoz").style.width =
    porcentaje + "%";

  document.getElementById("valorVoz").innerHTML =
    intensidad.toFixed(2);

  document.getElementById("umbral").style.left =
    (umbralGolpe * 220) + "px";
}



function actualizarIndicadorPaleta() {

  document.querySelectorAll(".muestra")
    .forEach(m => m.classList.remove("activa"));

  let nombre = "";

  switch (paleta) {

    case 0:
      document.querySelector(".marron").classList.add("activa");
      nombre = "Marrones";
      break;

    case 1:
      document.querySelector(".amarillo").classList.add("activa");
      nombre = "Amarillo / Óxido";
      break;

    case 2:
      document.querySelector(".verde").classList.add("activa");
      nombre = "Verdes";
      break;

    case 3:
      document.querySelector(".cobalto").classList.add("activa");
      nombre = "Cobalto";
      break;
  }

  document.getElementById("paletaActiva").textContent =
    "Paleta activa: " + nombre;
}

function elegirPaletaConVoz() {
  if (estado !== INICIO) return;
  if (!audioIniciado) return;

  if (empezoElSonido) {
    tiempoInicioPaleta = millis();

    paleta++;
    if (paleta > 3) paleta = 0;

    actualizarIndicadorPaleta();
  }

  if (
    haySonido &&
    millis() - tiempoInicioPaleta > duracionConfirmarPaleta
  ) {
    avanzarEstado();
  }
}

function cambiarEstadoConVoz() {
  if (estado === INICIO || estado === CERRADA) return;

    if (estado === FRANJAS && !franjasTerminadas()) {
    return;
}

  if (sonidoLargo && capaAplicada && !estadoCambiadoPorVoz) {
    avanzarEstado();
    estadoCambiadoPorVoz = true;
  }

  if (!haySonido) {
    estadoCambiadoPorVoz = false;
  }

}

function guardarConVoz() {
  if (estado !== CERRADA) return;

  if (sonidoLargo && !guardadoPorVoz) {
    saveCanvas("obra_por_voz", "png");

    guardadoPorVoz = true;
    pausadoDespuesDeGuardar = true;
    tiempoFinPausa = millis() + duracionPausaGuardado;
  }

  if (!haySonido) {
    guardadoPorVoz = false;
  }
}

function mostrarMensajeReinicio() {
  push();
  fill(0, 180);
  rect(0, 0, width, height);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(24);
  text(
    "Obra guardada\nReiniciando...",
    width / 2,
    height / 2
  );
  pop();
}