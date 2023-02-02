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
                const producto = arrayDeProductos[i]
                let {id,imgUrl,precio,nombre,alt}=producto
                contenedorProductos.innerHTML += `
        <div class="mainpro__hijo" id="producto__id:${id}">
            <img id="agreger-${id}" class="mainpro__hijo-imgAgrega"src="./../../img/AgregaUno.png" alt="Agrega un producto al carrito" title="Agrega un producto al carrito">
            <img src="${imgUrl}" alt="${alt}" class="mainpro__hijo__img">
            <h3>${nombre}</h3>
            <p>${precio}$</p>
            <button type="button" class="btn btn-primary" id="producto__N:${i}__boton">Ver producto</button>
        </div>`
            }
        } else {
            contenedorProductos.innerHTML += `<h3 class="noSeEncontro">No se encontro la búsqueda</h3>`
        }
        //le pone el evento click a los botones de agregar carrito
        for (let i = 0; i < arrayDeProductos.length; i++) {
            const producto = productos[i]
            if (typeof (producto.disponible) === "undefined") {
                producto.disponible = producto.stock
            }
            let {disponible,id,imgUrl,precio,nombre,stock}=producto
            //determina la variable del objeto producto para ver cuantos de ese tipo hay disponibles y si no hay disponibles no deja agregar mas ya que estan todos en el carrito
            let verProductoBoton = document.getElementById("producto__N:" + i + "__boton")
            if (stock === 0) {
                verProductoBoton.innerText = "Sin Stock"
            } else {
                verProductoBoton.addEventListener("click", verProducto)
            }
            //agrega uno al carrito
            let botonAgregar=document.getElementById("agreger-"+id)
            botonAgregar.addEventListener("click",()=>{
                agregarAlCarrito(1)
            })
            function agregarAlCarrito(ValorAAgregar) {
                if (disponible === 0) {
                    Swal.fire({
                        icon: "error",
                        title: "SIN STOCK DISPONIBLE DEL PRODUCTO",
                        text: "Estan todos los disponibles en el carrito",
                    })
                    sinStock = true
                } else {
                    if (disponible >= ValorAAgregar && ValorAAgregar >= 1) {
                        //se hace la resta de la cantidad que el usuario puso y los disponibles
                        disponible -= ValorAAgregar
                        producto.disponible=disponible
                        //revisa si hay un producto repetido en el carrito para ver si agregar uno nuevo o cambiar los valores
                        if (carrito.find(producto => id === producto.id)) {
                            let repetido = carrito[carrito.indexOf(carrito.find(producto => id === producto.id))]
                            repetido.disponible = disponible
                            repetido.comprar += Number(ValorAAgregar)
                        } else {
                            carrito.push({ ...producto, comprar: Number(ValorAAgregar) })
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
                        }).showToast()
                        localStorage.setItem("productos", JSON.stringify(productos))
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Error al ingresar datos",
                            text: "El valor ingresado debe ser entre 1 y " + disponible || stock,
                        })
                    }
                }
            }
            //script para visualizar productos a comprar
            function verProducto() {
                //al ver el producto seleccionado las utilidades el titulo y el boton reinicio no se muestran
                utiliadesIndex.id = "noMostrar"
                tituloIndex.id = "noMostrar"
                reini.id = "noMostrar"
                //muestra el producto seleccionado
                contenedorProductos.innerHTML =
                    `<div class="comprarProductoHijo" id="producto${id}">
                <img src="${imgUrl}" alt="medias de color azul" class="comprarProductoHijo__img">
                <section class="comprarProductoHijo__section">
                <h2>${nombre}</h2>
                <p>Precio: ${precio}$</p>
                <p id="disponibleTexto">Disponibles: ${disponible} unidades</p>
                <button type="button" class="btn btn-primary" id="resta">-</button>
                <input type="number" value="0" id="compra" min="0" max="${disponible}">
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
                botonCarrito.addEventListener("click", ()=>{
                    agregarAlCarrito(compra.value)
                    compra.value = 0
                    disponibleTexto.innerText = "disponibles: " + disponible
                })
                document.getElementById("suma").addEventListener("click", suma1)
                document.getElementById("resta").addEventListener("click", resta1)
                let compra = document.getElementById("compra")
                function suma1() {
                    if (disponible > compra.value && compra.value >= 0) {
                        compra.value++
                    }
                }
                function resta1() {
                    if (disponible >= compra.value && compra.value > 1) {
                        compra.value--
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