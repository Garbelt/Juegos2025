function evaluarLayoutAdaptativo() {

  // Solo si el juego permite adaptación
  if (!document.body.classList.contains("panel-adaptativo")) return;

  const contenedor = document.querySelector(".container");
  if (!contenedor) return;

  const anchoReal = contenedor.offsetWidth;

  // Umbral ajustable
  const anchoCritico = 850;

  if (anchoReal < anchoCritico) {
    document.body.classList.add("panel-below");
  } else {
    document.body.classList.remove("panel-below");
  }

}

window.addEventListener("load", evaluarLayoutAdaptativo);
window.addEventListener("resize", evaluarLayoutAdaptativo);