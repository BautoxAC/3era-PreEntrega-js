let contenedorCarrito = document.getElementById("mainCarrito__contenedorCarrito")
let carrito = []
let total = []
let productos = JSON.parse(localStorage.getItem("productos"))
let faltapagar = true
let elementoTotal = document.getElementById("total")
let precioTotal = 0
let botonFinalizar = document.getElementById("finalizar")
//revisa si hay productos en el carrito
if (localStorage.getItem("carrito")) {
    botonFinalizar.id = "finalizarSi"
    //renderiza el carrito
    function renderizarCarrito() {
        carrito = JSON.parse(localStorage.getItem("carrito"))
        contenedorCarrito.innerHTML = ""
        elementoTotal.innerText = ""
        total = []
        //titulos de las categorias
        contenedorCarrito.innerHTML = `
        <div id="titulo">
            <h2 class="tituloElementoCarrito__img">Img.</h2>
            <h2 class="tituloNombre">Nombre</h2>
            <h2 class="tituloSubtotal">Subtotal</h2>
            <h2 class="tituloStock">Stock</h2>
            <h2 class="tituloPrecioUnitario">C/U</h2>
            <div class="tituloCruz">
            </div>
            <div class="input">
            </div>
        </div>
            `
        for (const producto of carrito) {
            contenedorCarrito.innerHTML += `
            <div id="elementoCarrito${producto.id}"class="elementoCarrito">
            <img src="${"./." + producto.imgUrl}" alt="medias de color azul" class="elementoCarrito__img">
                    <h3 class="nombre">${producto.nombre}</h3>
                    <p id="precioN${producto.id}" class="subtotal">${producto.precio * producto.comprar}$</p>
                    <p class="stock">${producto.stock}</p>
                    <p id="precioUniN${producto.id}" class="precioUnitario">${producto.precio}$</p>
                    <div class="input">
                    <button type="button" class="btn btn-primary" id="restaN${producto.id}">-</button>
                    <input type="number" value="${producto.comprar}" id="cantidadN${producto.id}" min="1" max="${producto.stock}" class="inputNumber">
                    <button type="button" class="btn btn-primary" id="sumaN${producto.id}">+</button>
                    </div>
                    <img id="cruzN${producto.id}"class="cruz"src="./../../img/quitar.png" alt="cruz para quitar elemento del carrito" title="quitar elemento del carrito">
            </div>
            `
        }
        for (let i = 0; i < carrito.length; i++) {
            //funcion si ocurre un cambio de prcio los valores del subtotal y el total cambien
            function cambioDePrecio() {
                precio.innerText = cant.value * producto.precio + "$"
                total[i] = parseInt(precio.innerText)
                elementoTotal.innerText = "Total: " + total.reduce((acumulador, producto) => acumulador + parseInt(producto), 0) + "$"
                precioTotal = parseInt(elementoTotal.innerText)
            }
            const producto = carrito[i]
            //el input de la cantidad a comprar
            let cant = document.getElementById("cantidadN" + producto.id)
            //valor del subtotal
            let precio = document.getElementById("precioN" + producto.id)
            document.getElementById("sumaN" + producto.id).addEventListener("click", suma1)
            document.getElementById("restaN" + producto.id).addEventListener("click", resta1)
            function suma1() {
                if (producto.stock > cant.value && cant.value >= 0) {
                    cant.value++
                    cambioDePrecio()
                }
            }
            function resta1() {
                if (producto.stock >= cant.value && cant.value > 1) {
                    cant.value--
                    cambioDePrecio()
                }
            }
            precio.innerText = cant.value * producto.precio + "$"
            total.push(precio.innerText)
            cant.addEventListener("change", cambioPrecio)
            //revisa que el valor ingresado por el usuario sea correcto
            function cambioPrecio() {
                if (cant.value <= producto.stock && cant.value > 0) {
                    cambioDePrecio()
                } else {
                    alert("Ingrese un valor entre 1 y " + producto.stock)
                    cant.value = producto.comprar
                    cambioDePrecio()
                }
            }
            //agarra la cruz roja que esta al lado de cada elemento ye elimina el prodructo del carrito
            document.getElementById("cruzN" + producto.id).addEventListener("click", eliminarProducto)
            function eliminarProducto() {
                let elementoEliminado = productos.find(producto1 => producto1.id === producto.id)
                elementoEliminado.disponible = elementoEliminado.stock
                //cambia los valores del producto eliminado del carrito volviendolo a como era antes de ser agregado al carrito
                localStorage.setItem("productos", JSON.stringify(productos))
                carrito.splice(carrito.indexOf(elementoEliminado), 1)
                localStorage.setItem("carrito", JSON.stringify(carrito))
                //si no hay nada en el carrito aparece que no hay productos
                if (carrito.length === 0) {
                    contenedorCarrito.innerHTML = `<h2>No hay productos en el carrito</h2>`
                    botonFinalizar.id = "noMostrar"
                    elementoTotal.innerText = ""
                    localStorage.removeItem("carrito")
                } else {
                    renderizarCarrito()
                }
            }
        }
        //variable del prcio total que es la suma de todos los subtotales
        precioTotal = total.reduce((acumulador, producto) => acumulador + parseInt(producto), 0)
        elementoTotal.innerText = "Total: " + precioTotal + "$"
        botonFinalizar.addEventListener("click", finalizarCompra)
        function finalizarCompra() {
            do {
                let pago = Number(prompt("Debe pagar: " + precioTotal + "$"))
                //Si paga menos de la cantidad que debe
                if (pago < precioTotal) {
                    precioTotal = precioTotal - pago
                    faltapagar = true
                    //si paga mas de lo que debe se le da vuelto
                } else if (pago > precioTotal) {
                    let vuelto = precioTotal - pago
                    alert("Su vuelto es de: " + (-vuelto) + "$")
                    alert("Disfrute su compra")
                    faltapagar = false
                    break
                } else if (pago === precioTotal) {
                    //si paga igual
                    pago = precioTotal - pago
                    alert("Disfrute su compra")
                    faltapagar = false
                    break
                } else {
                    alert("ERROR")
                    faltapagar = true
                }
            } while (faltapagar === true)
            //al terminar la compra a los productos comprados se le resta la cantidad de productos comprados al stock de estos y recarga la pagina para que aparezca que no hay productos en el carrito
            for (let i = 0; i < carrito.length; i++) {
                let comprado = productos.find(producto => producto.id === carrito[i].id)
                let cant = document.getElementById("cantidadN" + carrito[i].id)
                comprado.stock -= cant.value
            } 
            localStorage.setItem("productos", JSON.stringify(productos))
            localStorage.removeItem("carrito")
            location.reload()
        }
    }
    renderizarCarrito()
} else {
    contenedorCarrito.innerHTML = `<h2>No hay productos en el carrito</h2>`
    elementoTotal.innerText = ""
    botonFinalizar.id = "noMostrar"
}