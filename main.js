// Variables
const carrito = document.querySelector("#carrito");
const listaCursos = document.querySelector("#lista-cursos");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.querySelector("#vaciar-carrito");
let articulosCarrito = [];
const modal = document.querySelector(".ventana-modal");
const openModal = document.getElementById("abrir-modal");
const closeModal = document.getElementById("cerrar-modal");
let contador = document.getElementById("contador");

cargarEventListeners ();
function cargarEventListeners () {
    //Cuando agregas un curso presionando "Agregar al carrito"
    listaCursos.addEventListener("click", agregarCurso);

    //Elimina cursos del carrito
    carrito.addEventListener("click", eliminarCurso)

    //Vaciar carrito
    vaciarCarritoBtn.addEventListener("click", () => {
        
        articulosCarrito = [];
        limpiarHTML();
        actualizarContador();
    });

    //Muestra los cursos del localStorage
    document.addEventListener("DOMContentLoaded", () => {
        articulosCarrito = JSON.parse (localStorage.getItem("carrito")) || [];
        contador.innerText = localStorage.getItem("contador");
        carritoHTML();
        actualizarContador();
    })
}

//Ventana modal
openModal.addEventListener("click", () => {
    modal.classList.toggle("modal-show");
});
closeModal.addEventListener("click", () => {
    modal.classList.toggle("modal-show")
})


//Funciones

function agregarCurso(e) {
    e.preventDefault();
    if(e.target.classList.contains("card-btn")) {
        // const cursoSeleccionado = e.target.parentElement;
        leerDatosCursos(e.target.parentElement);
    }
    Toastify({
        text: "Curso añadido con éxito!",
        duration: 3000,
        gravity: "bottom",
        position: "right",
        style: {
            backgroundImage: "linear-gradient(to right, #ef233c, #f44655, #f6606d, #f77784, #f68d99)",
            color: "#fff",
        }
      }).showToast();
}

//Elimina un curso del carrito
function eliminarCurso (e) {
    if(e.target.classList.contains("eliminar-del-carrito")) {
        const cursoId = e.target.getAttribute("data-id");
        
        //Elimina del arreglo de articulosCarrito por el data-id
        articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId);
        carritoHTML();
        actualizarContador();
    }
}



// Lee el contenido del HTML al que le dimos click y extrae la información del curso
function leerDatosCursos (curso) {
    // Voy a crear un objeto con el contenido del curso seleccionado
    const infoCurso = {
        imagen: curso.querySelector("img").src,
        titulo: curso.querySelector("h4").textContent,
        precio: curso.querySelector("h5").textContent,
        id: curso.querySelector("button").getAttribute("data-id"),
        cantidad: 1,
    }

    //Revisa si un elemento ya existe en el carrito
    const existe = articulosCarrito.some( curso => curso.id === infoCurso.id );
    if(existe){
        const cursos = articulosCarrito.map (curso => {
            if (curso.id === infoCurso.id) {
                curso.cantidad++;
                return curso;
            } else {
                return curso;
            }
        })
        articulosCarrito = [...cursos];
    } else {
        //Agrega elementos al arreglo del carrito
        articulosCarrito = [...articulosCarrito, infoCurso];
    };

    

    carritoHTML();
    actualizarContador();
}



//Muestra el carrito de compras en el HTML
function carritoHTML () {

    limpiarHTML();

    articulosCarrito.forEach(curso => {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>
            <img src="${curso.imagen}" width="120px" height="120px">
        </td>    
        <td>${curso.titulo}</td>
        <td>${curso.precio}</td>
        <td>${curso.cantidad}</td>
        <td>
        <i class="bi bi-x-circle ms-auto eliminar-del-carrito" data-id="${curso.id}"></i>
        </td>
        `;
        // Agrega el HTML del carrito en el tbody
        contenedorCarrito.appendChild(row);
    });
    
    //Agrega el carrito de compras al storage
    sincronizarStorage();

}

function sincronizarStorage () {
    localStorage.setItem("carrito", JSON.stringify(articulosCarrito));
    localStorage.setItem("contador", articulosCarrito.length);
} 

//Elimina los cursos del tbody

function limpiarHTML () {
    while(contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}


function actualizarContador () {
    contador.innerText = articulosCarrito.length;
}