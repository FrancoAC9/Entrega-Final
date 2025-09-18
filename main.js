const tarifasPesoRosBsAs = [
  { limite: 100, tarifa: 10000 },
  { limite: 150, tarifa: 8500 },
  { limite: 200, tarifa: 7000 },
  { limite: 250, tarifa: 6500 },
  { limite: 300, tarifa: 6000 },
  { limite: 350, tarifa: 5500 },
  { limite: 400, tarifa: 5000 },
  { limite: 450, tarifa: 4500 },
  { limite: 500, tarifa: 4000 },
  { limite: 550, tarifa: 3500 },
  { limite: 600, tarifa: 3000 },
  { limite: 650, tarifa: 2500 },
  { limite: 700, tarifa: 2000 },
  { limite: 750, tarifa: 1500 },
  { limite: 800, tarifa: 1000 },
  { limite: 850, tarifa: 900 },
  { limite: 900, tarifa: 800 },
  { limite: 950, tarifa: 700 },
  { limite: 1000, tarifa: 600 },
];
const tarifasPesoRosCba = [
  { limite: 100, tarifa: 12000 },
  { limite: 150, tarifa: 10000 },
  { limite: 200, tarifa: 8500 },
  { limite: 250, tarifa: 8000 },
  { limite: 300, tarifa: 7500 },
  { limite: 350, tarifa: 7000 },
  { limite: 400, tarifa: 6500 },
  { limite: 450, tarifa: 6000 },
  { limite: 500, tarifa: 5500 },
  { limite: 550, tarifa: 5000 },
  { limite: 600, tarifa: 4500 },
  { limite: 650, tarifa: 4000 },
  { limite: 700, tarifa: 3500 },
  { limite: 750, tarifa: 3000 },
  { limite: 800, tarifa: 2500 },
  { limite: 850, tarifa: 2000 },
  { limite: 900, tarifa: 1500 },
  { limite: 950, tarifa: 1000 },
  { limite: 1000, tarifa: 800 },
];
const tarifasPesoBsAsCba = [
  { limite: 100, tarifa: 15000 },
  { limite: 150, tarifa: 12000 },
  { limite: 200, tarifa: 10000 },
  { limite: 250, tarifa: 9000 },
  { limite: 300, tarifa: 8500 },
  { limite: 350, tarifa: 8000 },
  { limite: 400, tarifa: 7500 },
  { limite: 450, tarifa: 7000 },
  { limite: 500, tarifa: 6500 },
  { limite: 550, tarifa: 6000 },
  { limite: 600, tarifa: 5500 },
  { limite: 650, tarifa: 5000 },
  { limite: 700, tarifa: 4500 },
  { limite: 750, tarifa: 4000 },
  { limite: 800, tarifa: 3500 },
  { limite: 850, tarifa: 3000 },
  { limite: 900, tarifa: 2500 },
  { limite: 950, tarifa: 2000 },
  { limite: 1000, tarifa: 1500 },
];

let costoBaseRosBsAs = 2000;
let costoBaseRosCba = 3000;
let costoBaseBsAsCba = 5000;

let tarifasData = null;

axios
  .get("https://jsonplaceholder.typicode.com/users")
  .then((resp) => {
    console.log("usuarios:", resp.data);
  })
  .catch((err) => console.error("Error al cargar usuarios:", err));

async function cargarTarifas() {
  const response = await fetch("./tarifas.json");
  tarifasData = await response.json();
  console.log("Tarifas cargadas:", tarifasData);
}

cargarTarifas();

function cotizarTransporte(origen, destino, peso) {
  if (!tarifasData) {
    return "Las tarifas aún no se cargaron. Intente nuevamente.";
  }
  let costoTotal = 0;

  if (
    (origen === "rosario" && destino === "buenos aires") ||
    (origen === "buenos aires" && destino === "rosario")
  ) {
    let tarifa = tarifasPesoRosBsAs.find((t) => peso <= t.limite);
    if (!tarifa)
      return "El peso excede el límite máximo de 1000 kg para esta ruta.";
    costoTotal = costoBaseRosBsAs + tarifa.tarifa;
    historialTransporte(origen, destino, peso, costoTotal);
    return `El costo total del transporte es: $${costoTotal}`;
  } else if (
    (origen === "rosario" && destino === "cordoba") ||
    (origen === "cordoba" && destino === "rosario")
  ) {
    let tarifa = tarifasPesoRosCba.find((t) => peso <= t.limite);
    if (!tarifa)
      return "El peso excede el límite máximo de 1000 kg para esta ruta.";
    costoTotal = costoBaseRosCba + tarifa.tarifa;
    historialTransporte(origen, destino, peso, costoTotal);
    return `El costo total del transporte es: $${costoTotal}`;
  } else if (
    (origen === "buenos aires" && destino === "cordoba") ||
    (origen === "cordoba" && destino === "buenos aires")
  ) {
    let tarifa = tarifasPesoBsAsCba.find((t) => peso <= t.limite);
    if (!tarifa)
      return "El peso excede el límite máximo de 1000 kg para esta ruta.";
    costoTotal = costoBaseBsAsCba + tarifa.tarifa;
    historialTransporte(origen, destino, peso, costoTotal);
    return `El costo total del transporte es: $${costoTotal}`;
  } else {
    return "Ruta no válida";
  }
}

function historialTransporte(origen, destino, peso, costoTotal) {
  let nuevaCotizacion = {
    fecha: new Date().toLocaleString(),
    origen: origen,
    destino: destino,
    peso: peso,
    costo: costoTotal,
  };
  let historial = JSON.parse(localStorage.getItem("historialTransporte")) || [];
  historial.push(nuevaCotizacion);
  localStorage.setItem("historialTransporte", JSON.stringify(historial));
}

let btnCalcularCosto = document.getElementById("calcular");
btnCalcularCosto.addEventListener("click", function () {
  const origen = document.getElementById("origen").value;
  const destino = document.getElementById("destino").value;
  const peso = document.getElementById("peso").value;

  const resultado = cotizarTransporte(origen, destino, peso);

  document.getElementById("resultado").textContent = resultado;
});

let encabezado = document.getElementById("encabezado");
encabezado.style.color = "#3d70a3ff";
encabezado.style.textAlign = "center";
encabezado.style.fontFamily = "Arial, sans-serif";
encabezado.style.marginTop = "20px";
encabezado.style.marginBottom = "20px";
encabezado.style.textShadow = "2px 2px 4px #b1b6fcff";

let ciudadDeOrigen = document.getElementById("ciudadDeOrigen");
ciudadDeOrigen.style.color = "#9b1515ff";
ciudadDeOrigen.style.textAlign = "center";
ciudadDeOrigen.style.fontFamily = "Arial, sans-serif";
ciudadDeOrigen.style.fontSize = "25px";
ciudadDeOrigen.style.marginTop = "10px";
ciudadDeOrigen.style.marginBottom = "10px";
ciudadDeOrigen.style.textShadow = "1px 1px 2px #e05a82ff";

let ciudadDeDestino = document.getElementById("ciudadDeDestino");
ciudadDeDestino.style.color = "#9b1515ff";
ciudadDeDestino.style.textAlign = "center";
ciudadDeDestino.style.fontFamily = "Arial, sans-serif";
ciudadDeDestino.style.fontSize = "25px";
ciudadDeDestino.style.marginTop = "10px";
ciudadDeDestino.style.marginBottom = "10px";
ciudadDeDestino.style.textShadow = "1px 1px 2px #e05a82ff";

let pesoEnKg = document.getElementById("pesoEnkg");
pesoEnKg.style.color = "#9b1515ff";
pesoEnKg.style.textAlign = "center";
pesoEnKg.style.fontFamily = "Arial, sans-serif";
pesoEnKg.style.fontSize = "25px";
pesoEnKg.style.marginTop = "10px";
pesoEnKg.style.marginBottom = "10px";
pesoEnKg.style.textShadow = "1px 1px 2px #e05a82ff";

let resultado = document.getElementById("resultado");
resultado.style.color = "#3d70a3ff";
resultado.style.textAlign = "center";
resultado.style.fontFamily = "Arial, sans-serif";
resultado.style.marginTop = "50px";
resultado.style.marginBottom = "50px";
resultado.style.textShadow = "2px 2px 4px #b1b6fcff";
resultado.style.fontSize = "25px";
