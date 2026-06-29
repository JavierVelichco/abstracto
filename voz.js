//-------------CONFIGURACION INICIAL-----------------
let AMP_MIN = 0.001;
let AMP_MAX = 0.13;

let NOTA_MIN = 48;
let NOTA_MAX = 70;

let calibrandoAmp = true;
let monitor = false;

let umbralRuido = 0.1;
let umbralDuracionSonido = 1000;

//-------------SONIDO GENERAL-----------------
let mic;
let audioIniciado = false;

//-------------AMPLITUD-----------------
let pisoAmp = Infinity;
let techoAmp = -Infinity;

let amp = 0;
let intensidad = 0;

//----------ANALISIS FRECUENCIA------
let pitch;
const model_url =
  "https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/";

let frec = 0;
let notaMidi = 0;
let altura = 0;
let difAltura = 0;
let hayPitch = false;

//--------GESTORES-------
let gestorAmp;
let gestorFrec;

//-------ESTADOS Y EVENTOS DE SONIDO-----
let haySonido = false;
let antesHabiaSonido = false;
let empezoElSonido = false;
let terminoElSonido = false;

//-------TEMPORIZADORES----
let marcaInicioSonido = 0;
let marcaFinSonido = 0;
let durSonido = 0;
let durSilencio = 0;
let sonidoLargo = false;
let marcaUltimoPitch = 0;
let timeoutSinPitch = 300;

let umbralGolpe = 0.50;


//=================================
//        INICIALIZAR VOZ
//=================================
function inicializarVoz() {
  mic = new p5.AudioIn();

  gestorAmp = new GestorSenial(AMP_MIN, AMP_MAX);
  gestorFrec = new GestorSenial(NOTA_MIN, NOTA_MAX);
}


//=================================
//        ACTUALIZAR VOZ
//=================================
function actualizarVoz() {
  if (!audioIniciado) {
    return;
  }

  amp = mic.getLevel();

  if (calibrandoAmp) {
    pisoAmp = min(pisoAmp, amp);
    techoAmp = max(techoAmp, amp);
  }

  gestorAmp.actualizar(amp);

  intensidad = gestorAmp.filtrada;
  altura = gestorFrec.filtrada;

  difAltura = hayPitch ? gestorFrec.derivada * 10 : 0;

  haySonido = intensidad > umbralRuido;

  empezoElSonido = haySonido && !antesHabiaSonido;
  terminoElSonido = !haySonido && antesHabiaSonido;

  if (empezoElSonido) {
    marcaInicioSonido = millis();
    durSilencio = millis() - marcaFinSonido;
    sonidoLargo = false;
  }

  if (haySonido) {
    durSonido = millis() - marcaInicioSonido;
    sonidoLargo = durSonido >= umbralDuracionSonido;
  }

  if (terminoElSonido) {
    durSonido = millis() - marcaInicioSonido;
    marcaFinSonido = millis();
    sonidoLargo = false;
  }

  if (!haySonido) {
    durSilencio = millis() - marcaFinSonido;
  }

  if (monitor) {
    monitoreoVoz();
  }

  antesHabiaSonido = haySonido;
}


//=================================
//        INICIAR AUDIO
//=================================
async function iniciarAudio() {
  if (audioIniciado) {
    return;
  }

  try {
    await userStartAudio();

    mic.start(
      () => {
        audioIniciado = true;

        document.getElementById("btnAudio").style.display = "none";

        marcaInicioSonido = millis();
        marcaFinSonido = millis();
        marcaUltimoPitch = millis();

        startPitch();
      },
      (error) => {
        console.error("No se pudo iniciar el microfono", error);
      }
    );
  } catch (error) {
    console.error("No se pudo habilitar el contexto de audio", error);
  }
}


//=================================
//        DETECCION DE FRECUENCIA
//=================================
function startPitch() {
  pitch = ml5.pitchDetection(
    model_url,
    getAudioContext(),
    mic.stream,
    modelLoaded
  );
}

function modelLoaded() {
  getPitch();
}

function getPitch() {
  pitch.getPitch(function (err, frequency) {
    if (err) {
      console.error("Error en getPitch:", err);
      setTimeout(getPitch, 120);
      return;
    }

    if (frequency) {
      frec = frequency;
      notaMidi = freqToMidi(frequency);
      hayPitch = true;
      marcaUltimoPitch = millis();
      gestorFrec.actualizar(notaMidi);
    } else {
      frec = 0;
      hayPitch = millis() - marcaUltimoPitch <= timeoutSinPitch;
    }

    getPitch();
  });
}


//=================================
//        MONITOREO OPCIONAL
//=================================
function monitoreoVoz() {
  push();

  background(0);
  fill(255);
  textSize(20);
  textAlign(LEFT, BASELINE);

  text("AMP: " + amp.toFixed(3), 50, 50);
  text("FREC: " + frec.toFixed(2), 50, 100);
  text("NOTA: " + notaMidi.toFixed(2), 50, 150);
  text("INTENSIDAD: " + intensidad.toFixed(2), 50, 200);
  text("ALTURA: " + altura.toFixed(2), 50, 250);
  text("DIF ALTURA: " + difAltura.toFixed(2), 50, 300);
  text("DUR SONIDO: " + (durSonido / 1000).toFixed(2) + " s", 50, 350);
  text("DUR SILENCIO: " + (durSilencio / 1000).toFixed(2) + " s", 50, 400);
  text("SONIDO LARGO: " + (sonidoLargo ? "SI" : "NO"), 50, 450);
  text("HAY SONIDO: " + (haySonido ? "SI" : "NO"), 50, 500);
  text("HAY PITCH: " + (hayPitch ? "SI" : "NO"), 50, 550);

  gestorAmp.dibujar(width - 500, 50);
  gestorFrec.dibujar(width - 500, 200);

  pop();
}


//=================================
//        TECLAS DE CALIBRACION
//=================================
function controlarTeclasVoz() {
  if (key === "c" || key === "C") {
    calibrandoAmp = !calibrandoAmp;
    console.log("AMP_MIN =", pisoAmp);
    console.log("AMP_MAX =", techoAmp);
    console.log(`let AMP_MIN = ${pisoAmp}; let AMP_MAX = ${techoAmp};`);
  }

  if (key === "a" || key === "A") {
    if (isFinite(pisoAmp) && isFinite(techoAmp) && techoAmp > pisoAmp) {
      gestorAmp.minimo = pisoAmp;
      gestorAmp.maximo = techoAmp;
      console.log("Rango aplicado a gestorAmp:", gestorAmp.minimo, gestorAmp.maximo);
    } else {
      console.warn("No hay calibración válida todavía para aplicar.");
    }
  }

  if (key === "m" || key === "M") {
    monitor = !monitor;
  }
}