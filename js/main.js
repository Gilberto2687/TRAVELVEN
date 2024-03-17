
const btnSearch = document.querySelector("#btnSearch"),
inputIngreso = document.querySelector("#ingreso"),
contenedor = document.querySelector("#contenedor");

const paquetes = [
  { id: 1, destino: "cataratas de Iguazu", mes: "Febrero", transporte:"terrestre" , precio: 400 , img:"cataratas1.jpg", },
          
  { id: 2, destino: "cataratas de Iguazu", mes: "Febrero", transporte:"area" , precio: 600 , img:"cataratas2.webp",},
  
  { id: 3, destino: "Bariloche", mes: "Febrero", transporte:"terrestre" , precio: 500 , img:"bariloche1.jpg",},
  
  { id: 4, destino: "Bariloche", mes: "Febrero", transporte:"area" , precio: 700 , img:"Bariloche2.jpg",},
  
  { id: 5, destino: "Merlo, San Luis", mes: "Marzo", transporte:"terrestre" , precio: 300 , img:"merlo1.jpg", },
  
  { id: 6, destino: "Merlo, San Luis", mes: "Marzo", transporte:"area" , precio: 450 , img:"merlo2.jpg", },
  
  { id: 7, destino: "Mendoza", mes: "Marzo", transporte:"area" , precio: 470 , img:"mendoza1.jpg", },

  { id: 8, destino: "Mendoza", mes: "Marzo", transporte:"area" , precio: 650 , img:"mendoza2.jpg", },

  { id: 9, destino: "Brasil", mes: "Marzo", transporte:"Crucero" , precio: 1500 , img:"brasil.jpg", },
];

//Funciones de búsqueda
btnSearch.addEventListener("click", function() {
  const filtro = inputIngreso.value.trim().toLowerCase();
  if (filtro === "") {
      // Si el campo de búsqueda está vacío, mostrar todos los servicios nuevamente
      crearHtml(paquetes);
  } else {
      const paquetesFiltrados = filtrarPaquetes(paquetes, filtro);
      if (paquetesFiltrados.length === 0) {
          // Si no se encontraron servicios que coincidan con el filtro, mostrar un mensaje de error
          contenedor.innerHTML = "No se encontraron resultados.";
      } else {
          // Mostrar los servicios filtrados
          crearHtml(paquetesFiltrados);
      }
  }
});

// Función para filtrar paquetes por mes y tipo de transporte
function filtrarPaquetes(paquetes, filtro) {
  return paquetes.filter(paquete => {
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

// Función para crear estructura html
function crearHtml(arr) {
  const cardContainer = document.querySelector('.card-container');
  cardContainer.innerHTML = ""; // Limpiar el contenedor antes de agregar las tarjetas
  //validar qué pasa cuando no recibo ningun array
  if (arr.length === 0) {
    console.log("El array está vacío.");
    return;
  }

  for (const el of arr) {
    const {img, destino, precio, id, transporte, mes}= el
    const html = `<div class="card">
            <img src=" ./img/${img}" alt="${destino}">
            <hr>
            <h3>${destino}</h3>
            <h3>${transporte}</h3>
            <h3>${mes}</h3>
            <h3>Precio: $${precio} </h3>
            <div class="card-action">
              <button class="btn btn-success" id="${id}">Agregar</button>
            </div>
          </div>`;
    //se la agrego al contenedor
    cardContainer.innerHTML += html;
  }
  const btnAgregar = document.querySelectorAll('.btn.btn-success');
  btnAgregar.forEach(btn => {
    btn.addEventListener('click', agregarAlCarrito);
  }); 
}
crearHtml(paquetes)

const btnAgregar = document.querySelectorAll('.btn.btn-success');
const listaCarrito = document.querySelector('#lista-carrito');
const totalCarrito = document.querySelector('#total');
let carrito = [];

function mostrarMensajeAgregado(card) {
  const mensajeAgregado = document.getElementById('mensaje-agregado');
  card.insertAdjacentElement('afterend', mensajeAgregado);
  mensajeAgregado.style.display = 'block';
  
  // Ocultar el mensaje después de unos segundos
  setTimeout(function() {
    mensajeAgregado.style.display = 'none';
  }, 2000); 
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
}

// Agregar eventos de clic a los botones "Agregar al carrito"
btnAgregar.forEach(btn => {
  btn.addEventListener('click', agregarAlCarrito);
});

const btnPagar = document.querySelector('#btnPagar');
const formularioPago = document.querySelector('#formulario-pago form');

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
});
function mostrarMensajePagoExitoso() {
  const mensajePagoExitoso = document.getElementById('mensaje-pago-exitoso');
  mensajePagoExitoso.style.display = 'block';
  
  // Ocultar el mensaje después de unos segundos
  setTimeout(function() {
    mensajePagoExitoso.style.display = 'none';
  }, 3000);
}
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
  if (carrito.length === 0) {
    alert('Tu carrito está vacío. Agrega productos antes de proceder al pago.');
    return;
  }
  const mail = document.getElementById('mail').value;
  const nombreApellido = document.getElementById('nombre-apellido').value;
  const numeroTarjeta = document.getElementById('numero-tarjeta').value;
  const fechaVencimiento = document.getElementById('fecha-vencimiento').value;
  const codigoSecreto = document.getElementById('codigo-secreto').value;

  if (!validarNumeroTarjeta(numeroTarjeta)) {
    alert('Por favor, ingrese un número de tarjeta válido (16 dígitos).');
    return;
  }

  if (!validarCVV(codigoSecreto)) {
    alert('Por favor, ingrese un CVV válido (3 dígitos).');
    return;
  }

  if (!validarFechaVencimiento(fechaVencimiento)) {
    alert('Por favor, ingrese una fecha de vencimiento válida (MM/AA).');
    return;
  }
  // Mostrar mensaje de pago exitoso
  mostrarMensajePagoExitoso();
  
  // Limpiar el carrito después del pago exitoso
  carrito = [];
  actualizarCarrito();
});
