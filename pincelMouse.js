function mouseDragged() {
    pintarConMouse();
}

function mousePressed() {
    if (estado === MOTAS) {
        iniciarMotasMouse();
    }

    pintarConMouse();
}

function pintarConMouse() {
    if (estado === INICIO || estado === CERRADA) return;
    if (estado === FRANJAS) return;

    if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;

    if (estado === FONDO) {
        pintarFondoMouse(mouseX, mouseY);
        return;
    }

    if (estado === VELADURA1 || estado === VELADURA2) {
        pintarVeladuraMouse(pmouseX, pmouseY, mouseX, mouseY);
        capaAplicada = true;
        return;
    }

    if (estado === MOTAS) {
        pintarMotasMouse(mouseX, mouseY);
        capaAplicada = true;
        return;
    }
}

