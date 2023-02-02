let contenedorCarrito = document.getElementById("mainCarrito__contenedorCarrito")
let carrito = []
let subtotales = []
let productos = JSON.parse(localStorage.getItem("productos"))
let faltapagar = true
let Total = document.getElementById("total")
let precioTotal = 0
let botonFinalizar = document.getElementById("finalizar")
//revisa si hay productos en el carrito
if (localStorage.getItem("carrito")) {
    botonFinalizar.id = "finalizarSi"
    //renderiza el carrito
    function renderizarCarrito() {
        carrito = JSON.parse(localStorage.getItem("carrito"))
        contenedorCarrito.innerHTML = ""
        Total.innerText = ""
        subtotales = []
        //titulos de las categorias
        contenedorCarrito.innerHTML = `
        <div id="titulo">
            <h2 class="tituloElementoCarrito__img">Img.</h2>
            <h2 class="tituloNombre">Nombre</h2>
            <h2 class="tituloSubtotal">Subtotal</h2>
            <h2 class="tituloStock">Stock</h2>
            <h2 class="tituloPrecioUnitario">C/U</h2>
            <div class="tituloCruz">
            <button class="tituloCruz__vaciarCarrito" id="botonVaciar"><img src="./../../img/carritoEliminar.png" alt="vaciar carrito" title="Vaciar carrito" class="tituloCruz__vaciarCarrito__img"></button>
            </div>
            <div class="input">
            </div>
        </div>
            `
        for (let i = 0; i < carrito.length; i++) {
            const producto = carrito[i];
            const { id, alt, comprar, stock, imgUrl, precio, nombre } = producto
            contenedorCarrito.innerHTML += `
            <div id="elementoCarrito${id}"class="elementoCarrito">
            <img src="${imgUrl}" alt="${alt}" class="elementoCarrito__img">
                    <h3 class="nombre">${nombre}</h3>
                    <p id="precioN${id}" class="subtotal">${precio * comprar}$</p>
                    <p class="stock">${stock}</p>
                    <p id="precioUniN${id}" class="precioUnitario">${precio}$</p>
                    <div class="input">
                    <button type="button" class="btn btn-primary" id="restaN${id}" title="Resta un producto">-</button>
                    <input type="number" value="${comprar}" id="cantidadN${id}" min="1" max="${stock}" class="inputNumber">
                    <button type="button" class="btn btn-primary" id="sumaN${id}" title="Suma un producto">+</button>
                    </div>
                    <button id="cruzN${id}" class="botonCruz"><img id="cruzN${id}__img"class="botonCruz__img"src="./../../img/quitar.png" alt="cruz para quitar elemento del carrito" title="Quitar elemento del carrito"></button>
            </div>
            `

        }
        for (let i = 0; i < carrito.length; i++) {
            const producto = carrito[i]
            const { id, comprar, stock, precio } = producto
            //el input de la cantidad a comprar
            let cant = document.getElementById("cantidadN" + id)
            let subtotal = document.getElementById("precioN" + id)
            document.getElementById("sumaN" + id).addEventListener("click", suma1)
            document.getElementById("restaN" + id).addEventListener("click", resta1)
            function suma1() {
                if (stock > cant.value && cant.value >= 0) {
                    cant.value++
                    cambioDePrecio()
                }
            }
            function resta1() {
                if (stock >= cant.value && cant.value > 1) {
                    cant.value--
                    cambioDePrecio()
                }
            }
            //funcion si ocurre un cambio de precio los valores del subtotal y el total cambien
            function cambioDePrecio() {
                let productoCambiado = productos.find(producto => producto.id === carrito[i].id)
                producto.comprar=Number(cant.value)
                productoCambiado.disponible=stock-cant.value
                productoCambiado.comprar=producto.comprar
                localStorage.setItem("carrito", JSON.stringify(carrito))
                localStorage.setItem("productos", JSON.stringify(productos))
                subtotal.innerText = cant.value * precio + "$"
                subtotales[i] = parseInt(subtotal.innerText)
                Total.innerText = "Total: " + subtotales.reduce((acumulador, producto) => acumulador + parseInt(producto), 0) + "$"
                precioTotal = parseInt(Total.innerText)
            }
            subtotal.innerText = cant.value * precio + "$"
            subtotales.push(subtotal.innerText)
            cant.addEventListener("change", revisaSiCambia)
            //revisa que el valor ingresado por el usuario sea correcto
            function revisaSiCambia() {
                if (cant.value <= stock && cant.value > 0) {
                    cambioDePrecio()
                } else {
                    alert("Ingrese un valor entre 1 y " + stock)
                    cant.value = comprar
                    cambioDePrecio()
                }
            }
            //agarra la cruz roja que esta al lado de cada elemento ye elimina el prodructo del carrito
            document.getElementById("cruzN" + id).addEventListener("click", eliminarProducto)
            function eliminarProducto() {
                let elementoEliminado = productos.find(producto1 => producto1.id === id)
                elementoEliminado.disponible = elementoEliminado.stock
                //cambia los valores del producto eliminado del carrito volviendolo a como era antes de ser agregado al carrito
                localStorage.setItem("productos", JSON.stringify(productos))
                carrito.splice(carrito.indexOf(elementoEliminado), 1)
                localStorage.setItem("carrito", JSON.stringify(carrito))
                Toastify({
                    text: "Producto eliminado correctamente",
                    duration: 3000,
                    stopOnFocus: true,
                    gravity: "bottom",
                    position: "right",
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                    },
                }).showToast();
                //si no hay nada en el carrito aparece que no hay productos
                if (carrito.length === 0) {
                    contenedorCarrito.innerHTML = `<h2>No hay productos en el carrito</h2>`
                    botonFinalizar.id = "noMostrar"
                    Total.innerText = ""
                    localStorage.removeItem("carrito")
                } else {
                    renderizarCarrito()
                }
            }
        }
        //boton vaciar carrito
        document.getElementById("botonVaciar").addEventListener("click", vaciarCarrito)
        function vaciarCarrito() {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger'
                },
                buttonsStyling: false
            })
            swalWithBootstrapButtons.fire({
                title: '¿Estas seguro de vaciar el carrito?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, por favor',
                cancelButtonText: 'No, gracias',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        icon: 'success',
                        title: "Carrito vaciado correctamente",
                        showConfirmButton: false,
                        timer: 1500
                    })
                    setTimeout(() =>
                    //al terminar la compra a los productos comprados se le resta la cantidad de productos comprados al stock de estos y recarga la pagina para que aparezca que no hay productos en el carrito
                    {
                        for (let i = 0; i < carrito.length; i++) {
                            let elementoEliminado = productos.find(producto => producto.id === carrito[i].id)
                            elementoEliminado.disponible = elementoEliminado.stock
                        }
                        localStorage.setItem("productos", JSON.stringify(productos))
                        localStorage.removeItem("carrito")
                        location.reload()
                    }, 1500)
                }
            })
        }
        //variable del precio total que es la suma de todos los subtotales
        precioTotal = subtotales.reduce((acumulador, producto) => acumulador + parseInt(producto), 0)
        Total.innerText = "Total: " + precioTotal + "$"
        botonFinalizar.addEventListener("click", finalizarCompra)
        function finalizarCompra() {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger'
                },
                buttonsStyling: false
            })
            swalWithBootstrapButtons.fire({
                title: '¿Estas seguro de finalizar tu compra?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, por favor',
                cancelButtonText: 'No, gracias',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Compra finalizada correctamente',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    setTimeout(() =>
                    //al terminar la compra a los productos comprados se le resta la cantidad de productos comprados al stock de estos y recarga la pagina para que aparezca que no hay productos en el carrito
                    {
                        for (let i = 0; i < carrito.length; i++) {
                            let comprado = productos.find(producto => producto.id === carrito[i].id)
                            let cant = document.getElementById("cantidadN" + carrito[i].id)
                            comprado.stock -= cant.value
                        }
                        localStorage.setItem("productos", JSON.stringify(productos))
                        localStorage.removeItem("carrito")
                        location.reload()
                    }, 1500)

                }
            })
        }
    }
    renderizarCarrito()
} else {
    contenedorCarrito.innerHTML = `<h2>No hay productos en el carrito</h2>`
    Total.innerText = ""
    botonFinalizar.id = "noMostrar"
}