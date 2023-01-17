const DateTime = luxon.DateTime
console.log(DateTime.local().year)
fetch("./../../productos.json")
    .then(response => response.json())
    .then(productos => TodoElPrograma(productos))
function TodoElPrograma(productos) {
    let carrito = []
    //el contenedos utilidades es el que anida el buscador, el ver categorias y el boton del carrito
    let utiliadesIndex = document.getElementById("utilidades")
    let tituloIndex = document.getElementById("h1")
    let contenedorProductos = document.getElementById("mainpro")
    let proFiltradoCate = []
    let clickeados = 0
    let buscador = document.getElementById("search")
    //un boton para restablecer la pagina a los valores iniciales
    let reini = document.getElementById("reinicio")
    reini.addEventListener("click", reinicio)
    function reinicio() {
        fetch("./../../productos.json")
            .then(response => response.json())
            .then(productos => TodoElPrograma(productos))
        localStorage.clear()
        location.reload()
    }
    if (localStorage.getItem("carrito")) {
        carrito = JSON.parse(localStorage.getItem("carrito"))
    }
    if (localStorage.getItem("productos")) {
        productos = JSON.parse(localStorage.getItem("productos"))
    } else {
        localStorage.setItem("productos", JSON.stringify(productos))
    }

    renderizarProductos(productos)

    //renderizar el html del array seleccionado
    function renderizarProductos(arrayDeProductos) {
        contenedorProductos.innerHTML = ""
        //el if revisa si el array esta vacio para que cuando se use el buscador y no se encuentre lo que busco aparezca "No se encontro la busqueda
        if (arrayDeProductos.length !== 0) {
            for (let i = 0; i < arrayDeProductos.length; i++) {
                const producto = arrayDeProductos[i];
                contenedorProductos.innerHTML += `
        <div class="mainpro__hijo" id="producto__id:${producto.id}">
            <img src="${producto.imgUrl}" alt="medias de color azul" class="mainpro__hijo__img">
            <h3>${producto.nombre}</h3>
            <p>${producto.precio}$</p>
            <button type="button" class="btn btn-primary" id="producto__N:${i}__boton">Ver producto</button>
        </div>`
            }
        } else {
            contenedorProductos.innerHTML += `<h3 class="noSeEncontro">No se encontro la busqueda</h3>`
        }
        //le pone el evento click a los botones de agregar carrito
        for (let i = 0; i < arrayDeProductos.length; i++) {
            const producto = productos[i]
            //determina la variable del objeto producto para ver cuantos de ese tipo hay disponibles y si no hay disponibles no deja agregar mas ya que estan todos en el carrito
            if (typeof (producto.disponible) === "undefined") {
                producto.disponible = producto.stock
            }
            let verProductoBoton = document.getElementById("producto__N:" + i + "__boton")
            if (producto.stock === 0) {
                verProductoBoton.innerText = "Sin Stock"
            } else {
                verProductoBoton.addEventListener("click", verProducto)
            }
            //script para visualizar productos a comprar
            function verProducto() {
                //al ver el producto seleccionado las utilidades el titulo y el boton reinicio no se muestran
                utiliadesIndex.id = "noMostrar"
                tituloIndex.id = "noMostrar"
                reini.id = "noMostrar"
                //determina producto en compra
                let compra = producto
                //muestra el producto seleccionado
                contenedorProductos.innerHTML =
                    `<div class="comprarProductoHijo" id="producto${compra.id}">
                <img src="${compra.imgUrl}" alt="medias de color azul" class="comprarProductoHijo__img">
                <section class="comprarProductoHijo__section">
                <h2>${compra.nombre}</h2>
                <p>Precio: ${compra.precio}$</p>
                <p id="disponibleTexto">Disponibles: ${compra.disponible} unidades</p>
                <button type="button" class="btn btn-primary" id="resta">-</button>
                <input type="number" value="0" id="stock" min="0" max="${compra.disponible}">
                <button type="button" class="btn btn-primary" id="suma">+</button>
                <button type="submit" class="btn btn-primary" id="carrito">Añadir al carrito</button>
                <button type="button" class="btn btn-primary" id="volver">Volver</button>
                </section>
                </div>`
                document.getElementById("volver").addEventListener("click", volver)
                function volver() {
                    renderizarProductos(productos)
                    utiliadesIndex.id = "utilidades"
                    tituloIndex.id = "h1"
                    reini.id = "reinicio"
                }
                //boton carrito
                let botonCarrito = document.getElementById("carrito")
                let disponibleTexto = document.getElementById("disponibleTexto")
                botonCarrito.addEventListener("click", agregarAlCarrito)
                document.getElementById("suma").addEventListener("click", suma1)
                document.getElementById("resta").addEventListener("click", resta1)
                let stock = document.getElementById("stock")
                function suma1() {
                    if (compra.disponible > stock.value && stock.value >= 0) {
                        stock.value++
                    }
                }
                function resta1() {
                    if (compra.disponible >= stock.value && stock.value > 1) {
                        stock.value--
                    }
                }
                function agregarAlCarrito() {
                    if (compra.disponible === 0) {
                        alert("No puedes agregar más items de este producto\nEstan todos los disponibles en el carrito")
                    } else {
                        if (compra.disponible >= stock.value && stock.value >= 1) {
                            if (compra.disponible === 0) {
                                compra.sinStock = true
                                Swal.fire({
                                    icon: "error",
                                    title: "SIN STOCK DISPONIBLE DEL PRODUCTO",
                                    text: "Estan todos los disponibles en el carrito",
                                })
                                utiliadesIndex.id = "utilidades"
                                tituloIndex.id = "h1"
                                reini.id = "reinicio"
                                renderizarProductos(productos)
                            } else {
                                //se hace la resta de la cantidad que el usuario puso y los disponibles
                                compra.disponible -= stock.value
                                //revisa si hay un producto repetido en el carrito para ver si agregar uno nuevo o cambiar los valores
                                if (carrito.find(producto => producto.id === compra.id)) {
                                    let repetido = carrito[carrito.indexOf(carrito.find(producto => producto.id === compra.id))]
                                    repetido.disponible = compra.disponible
                                    repetido.comprar += Number(stock.value)
                                } else {
                                    carrito.push({ ...compra, comprar: Number(stock.value) })
                                }
                                localStorage.setItem("carrito", JSON.stringify(carrito))
                                Toastify({
                                    text: "Se agrego tu compra satisfactoriamente al carrito",
                                    duration: 3000,
                                    stopOnFocus: true,
                                    gravity: "bottom",
                                    position: "right",
                                    style: {
                                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                                    },
                                }).showToast();
                                //revisa si hay disponibles en la compra para que el usuario no compre mas del producto
                                disponibleTexto.innerText = "disponibles: " + compra.disponible
                                localStorage.setItem("productos", JSON.stringify(productos))
                                stock.value = 0
                            }
                        } else {
                            Swal.fire({
                                icon: "error",
                                title: "Error al ingresar datos",
                                text: "El valor ingresado debe ser entre 1 y " + compra.disponible || compra.stock,
                            })
                            stock.value = 0
                        }
                    }
                }

            }
        }
    }
    //Buscador por categoria y nombre del producto
    buscador.addEventListener("change", renderizarProductosBuscados)
    function renderizarProductosBuscados() {
        //revisa si hay alguno de los producto esta afectado por el ver categorias ya que se determina un nueva variable llamada agregar
        if (productos.find(producto => producto.agregar === true)) {
            //el buscador busca por categoria y nombre
            renderizarProductos(productos.filter(producto => (producto.nombre.toLowerCase().includes(buscador.value.toLowerCase()) || producto.categoria.includes(buscador.value.toLowerCase())) && producto.agregar === true))
        } else {
            renderizarProductos(productos.filter(producto => producto.nombre.toLowerCase().includes(buscador.value.toLowerCase()) || producto.categoria.includes(buscador.value.toLowerCase())))
        }
    }

    //filtrador por categorias
    for (let i = 1; i < 6; i++) {
        //agarra la checkbox
        let checkMostrarPorCate = document.getElementById("categoria" + i + "__Checkbox")
        let cate = document.getElementById("categoria" + i)
        checkMostrarPorCate.addEventListener("change", renderizarCate)
        function renderizarCate() {
            //revisa el click en el checkbox
            if (checkMostrarPorCate.checked) {
                clickeados++
                renderizarFiltrados(true)
            } else {
                clickeados--
                //revisa si hay algun checkbox clickeado ya que si no hay ninguno renderiza todo
                if (clickeados < 1) {
                    for (const producto of productos) {
                        producto.agregar = false
                    }
                    renderizarProductos(productos.filter(producto => (producto.nombre.toLowerCase().includes(buscador.value.toLowerCase()) || producto.categoria.includes(buscador.value.toLowerCase())) && producto.agregar === false))
                } else {
                    renderizarFiltrados(false)
                }
            }
            //funcion para filtrar por la categoria seleccionada por el usuario
            function renderizarFiltrados(agregarSiNo) {
                //filtra por el texto que hay en la lista categorias en el html
                proFiltradoCate = productos.filter(producto => producto.categoria === cate.innerText.toLowerCase())
                for (const filtrado of proFiltradoCate) {
                    //si el checkbox esta clickeado determina que se agreguen y si no que no se agreguen
                    filtrado.agregar = agregarSiNo
                }
                renderizarProductos(productos.filter(producto => (producto.nombre.toLowerCase().includes(buscador.value.toLowerCase()) || producto.categoria.includes(buscador.value.toLowerCase())) && producto.agregar === true))
            }
        }
    }
}