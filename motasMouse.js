let tiempoInicioMotas = 0;

function iniciarMotasMouse() {
    tiempoInicioMotas = millis();
}

function pintarMotasMouse(x, y) {
    let tiempoPresionado = millis() - tiempoInicioMotas;

    if (paleta === 0) {
        pintarMotasMarronesPorTiempo(x, y, tiempoPresionado);
    }

    if (paleta === 1) {
        pintarMotasAmarillasPorTiempo(x, y, tiempoPresionado);
    }

    if (paleta === 2) {
        pintarMotasVerdesPorTiempo(x, y, tiempoPresionado);
    }

    if (paleta === 3) {
        pintarMotasVerdesPorTiempo(x, y, tiempoPresionado); // provisoria
    }

    capaAplicada = true;
}

function pintarMotasMarronesPorTiempo(x, y, t) {
    microGranoMarronLocal(x, y);

    if (t > 600) {
        grupoMotasMarronesLocal(x, y);
    }

    if (t > 2000 && frameCount % 14 === 0) {
        motaMarronGrandeLocal(x, y);
    }
}

function pintarMotasAmarillasPorTiempo(x, y, t) {
    microGranoAmarilloLocal(x, y);

    if (t > 600) {
        grupoMotasAmarillasLocal(x, y);
    }

    if (t > 2000 && frameCount % 14 === 0) {
        motaAmarillaGrandeLocal(x, y);
    }
}

function pintarMotasVerdesPorTiempo(x, y, t) {
    microGranoVerdeLocal(x, y);

    if (t > 600) {
        grupoMotasVerdesLocal(x, y);
    }

    if (t > 2000 && frameCount % 14 === 0) {
        motaVerdeGrandeLocal(x, y);
    }
}