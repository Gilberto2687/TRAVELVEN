const API_URL = "./db/db.json";
const btnSearch = document.querySelector("#btnSearch"),
inputIngreso = document.querySelector("#ingreso"),
contenedor = document.querySelector("#contenedor");

let paquetesDB=[];
fetch(API_URL)
.then(response=> response.json())
.then(data=>{
  console.log(data);
  paquetesDB=data
  console.log(paquetesDB);
  renderPaquetes(paquetesDB)
})

//Funciones de búsqueda
btnSearch.addEventListener("click", function() {
  const filtro = inputIngreso.value.trim().toLowerCase();
  if (filtro === "") {
      // Si el campo de búsqueda está vacío, mostrar todos los servicios nuevamente
      renderPaquetes(paquetesDB);
  } else {
      const paquetesFiltrados = filtrarPaquetes(paquetesDB, filtro);
      if (paquetesFiltrados.length === 0) {
          // Si no se encontraron servicios que coincidan con el filtro, mostrar un mensaje de error
          contenedor.innerHTML = "No se encontraron resultados.";
      } else {
          // Mostrar los servicios filtrados
          renderPaquetes(paquetesFiltrados);
      }
  }
});

// Función para filtrar paquetes por mes y tipo de transporte
function filtrarPaquetes(paquetesDB, filtro) {
  return paquetesDB.filter(paquete => {
    // Filtrar por mes
    if (paquete.mes.toLowerCase() === filtro) {
      return true;
    }
    // Filtrar por tipo de transporte
    if (paquete.transporte.toLowerCase() === filtro) {
      return true;
    }
    return false;
  });
}
const renderPaquetes = (arr) => {
  const cardContainer = document.querySelector("#contenedor"); // Obtener el contenedor de las tarjetas
  cardContainer.innerHTML = ""; // Limpiar el contenedor antes de agregar las tarjetas
  for (const el of arr) {
    const {img, destino, precio, id, transporte, mes}= el;
    const cardHTML = `<div class="card">
      <img src="./img/${img}" alt="${destino}">
      <hr>
      <h3>${destino}</h3>
      <h3>${transporte}</h3>
      <h3>${mes}</h3>
      <h3>Precio: $${precio} </h3>
      <div class="card-action">
        <button class="btn btn-success" id="${id}">Agregar</button>
      </div>
    </div>`;
    // Agregar el html de la tarjeta al contenedor
    cardContainer.innerHTML += cardHTML;
  }
};

const btnAgregar = document.querySelectorAll('.btn.btn-success');
btnAgregar.forEach(btn => {
  btn.addEventListener('click', agregarAlCarrito);
});

const listaCarrito = document.querySelector('#lista-carrito');
const totalCarrito = document.querySelector('#total');
let carrito = [];

function mostrarMensajeAgregado(card) {
  Swal.fire({
    title: "Paquete Agregado",
    text: "Tu paquete ya esta cargado en el carrito",
    icon: "success",
    showConfirmButton: false,
    timer: 2000 // Tiempo en milisegundos (2 segundos en este caso)
  });
}

// Función para agregar paquete al carrito
function agregarAlCarrito(e) {
  const card = e.target.closest('.card'); // Obtener la card
  const id = card.dataset.id; // Obtener el ID del paquete
  const nombre = card.querySelector('h3').textContent; // Obtener el nombre del paquete
  const precio = parseFloat(card.querySelector('h3:last-of-type').textContent.replace('Precio: $', '')); // Obtener el precio del paquete

  // Crear objeto paquete
  const paquete = {
    id: id,
    nombre: nombre,
    precio: precio,
  };

  // Agregar paquete al carrito
  carrito.push(paquete);

  // Actualizar carrito
  actualizarCarrito();

  mostrarMensajeAgregado(card);
}

// Función para actualizar el carrito
function actualizarCarrito() {
  // Limpiar carrito
  listaCarrito.innerHTML = '';

  // Recorrer paquetes en el carrito
  carrito.forEach(paquete => {
    const elemento = document.createElement('li');
    elemento.textContent = `${paquete.nombre} - Precio: $${paquete.precio}`;
    listaCarrito.appendChild(elemento);
  });

  // Calcular total del carrito
  const total = carrito.reduce((total, paquete) => total + paquete.precio, 0);

  // Mostrar total del carrito
  totalCarrito.textContent = `Total: $${total.toFixed(2)}`;

  // Guardar carrito en localStorage
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Agregar evento DOMContentLoaded al final del archivo
document.addEventListener('DOMContentLoaded', function() {
  // Cargar carrito desde localStorage si existe
  if(localStorage.getItem('carrito')) {
    carrito = JSON.parse(localStorage.getItem('carrito'));
    actualizarCarrito();
  }
});

// Agregar eventos de clic a los botones "Agregar al carrito"
btnAgregar.forEach(btn => {
  btn.addEventListener('click', agregarAlCarrito);
});

const btnPagar = document.querySelector('#btnPagar');
const formularioPago = document.querySelector('#formulario-pago form');
// Función para mostrar mensaje de pago exitoso
function mostrarMensajePagoExitoso() {
  Swal.fire({
    title: "Pago exitoso",
    text: "Gracias por elegirnos",
    icon: "success",
    showConfirmButton: false,
    timer: 3000 // Tiempo en milisegundos (3 segundos en este caso)
  });
}
function verificarDatos() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simular la verificación de datos (en este caso, simplemente resolvemos la promesa)
      resolve();
    }, 2000); // Esperar 2 segundos (2000 milisegundos)
  });
}

// Manejar evento de clic en el botón de pagar
document.getElementById('btnPagar').addEventListener('click', function() {
  // Obtener el monto total del carrito
  const total = parseFloat(totalCarrito.textContent.replace('Total: $', ''));
  
  // Llenar el campo del monto en el formulario de pago
  const campoMonto = document.createElement('input');
  campoMonto.setAttribute('type', 'hidden');
  campoMonto.setAttribute('name', 'monto');
  campoMonto.setAttribute('value', total);
  formularioPago.appendChild(campoMonto);
  
  // Mostrar el formulario de pago
  document.getElementById('formulario-pago').style.display = 'block';

  // Simular verificación de datos
  verificarDatos()
    .then(() => {
      // Mostrar mensaje de pago exitoso después de verificar los datos
    })
    .catch(error => {
      // Manejar errores si la verificación falla
      console.error('Error al verificar datos:', error);
    });
});

function validarNumeroTarjeta(numero) {
  return /^\d{16}$/.test(numero); // Comprueba que sean exactamente 16 dígitos
}

// Función para validar el CVV
function validarCVV(cvv) {
  return /^\d{3}$/.test(cvv); // Comprueba que sean exactamente 3 dígitos
}

// Función para validar la fecha de vencimiento
function validarFechaVencimiento(fecha) {
  return /^(0[1-9]|1[0-2])\/\d{2}$/.test(fecha); // Comprueba el formato MM/AA
}
// Manejar envío del formulario de pago
formularioPago.addEventListener('submit', function(event) {
  // Evitar el envío predeterminado del formulario
  event.preventDefault();
  
  // Obtener los datos del formulario
  const formData = new FormData(formularioPago);
  
  // Enviar los datos al servidor utilizando Fetch
  fetch(API_URL, {
    method: 'POST',
    body: formData
  })
  .then(response => {
    // Verificar si la solicitud fue exitosa
    if (response.ok) {
      // Mostrar mensaje de pago exitoso
      mostrarMensajePagoExitoso();
      
      // Limpiar el carrito después del pago exitoso
      carrito = [];
      actualizarCarrito();
    } else {
      // Si la respuesta no fue exitosa, lanzar un error
      throw new Error('Hubo un problema al procesar la solicitud.');
    }
  })
  .catch(error => {
    // Manejar errores de la solicitud
    console.error('Error al procesar la solicitud:', error);
    // Mostrar un mensaje de error al usuario
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Hubo un problema al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.",
    });
  });
});
document.addEventListener('DOMContentLoaded', function() {
  getData(API_URL);
})
//async await
document.addEventListener('DOMContentLoaded', function() {
  getData(API_URL);
});
const getData = async (API_URL) => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    const paquetesDB = data; // Declarar paquetesDB dentro de getData
    renderPaquetes(paquetesDB); // Pasar paquetesDB como argumento a renderPaquetes
  } catch (error) {
    console.error('Error al obtener los datos:', error);
  }
};