class View {

    ocultarTodo() {
        document.getElementById('listado-categorias').classList.add('oculto');
        document.getElementById('add-producto').classList.add('oculto');
        document.getElementById('add-categoria').classList.add('oculto');
        document.getElementById('listado-productos').classList.remove('oculto');
    }

    mostrarCategorias() {
        document.getElementById('listado-categorias').classList.remove('oculto');
        document.getElementById('listado-productos').classList.add('oculto');
        document.getElementById('add-producto').classList.add('oculto');
        document.getElementById('add-categoria').classList.add('oculto');
    }

    mostrarAddProducto() {
        document.getElementById('listado-categorias').classList.add('oculto');
        document.getElementById('listado-productos').classList.add('oculto');
        document.getElementById('add-producto').classList.remove('oculto');
        document.getElementById('add-categoria').classList.add('oculto');
    }

    mostrarAddCategoria() {
        document.getElementById('listado-categorias').classList.add('oculto');
        document.getElementById('listado-productos').classList.add('oculto');
        document.getElementById('add-producto').classList.add('oculto');
        document.getElementById('add-categoria').classList.remove('oculto');
    }

    renderProduct(producto, callback, callback2, callback3) {
        const productUI = document.createElement('tr');
        productUI.setAttribute('id', 'prod-' + producto.id);
        productUI.setAttribute('class', 'text-center');
        productUI.innerHTML = `
        <td>${producto.id}</td>
        <td>${producto.name}</td>
        <td>${producto.category}</td>
        <td id = 'unit-${producto.id}'>${producto.units}</td>
        <td>${producto.price} u/€</td>
        <td id = 'import-${producto.id}'>${producto.productImport()} €</td>
        <td>
        <button id='addunit-${producto.id}' class="btn btn-warning">
        <span class="material-icons">arrow_drop_up</span>
        </button>
        <button id='delunit-${producto.id}' class="btn btn-success">
        <span class="material-icons">arrow_drop_down</span>
        </button>
        <button id='editprod-${producto.id}' class="btn btn-info">
        <span class="material-icons">edit</span>
        </button>
        <button id='delprod-${producto.id}' class="btn btn-danger">
        <span class="material-icons">delete_forever</span>
        </button>
        </td>
        `
        const tbodyUI = document.querySelector('#almacen tbody');
        tbodyUI.appendChild(productUI);
        document.getElementById('addunit-' + producto.id).addEventListener('click', () => {
            callback2(producto);
        })
        document.getElementById('delunit-' + producto.id).addEventListener('click', () => {
            callback3(producto);
        })
        document.getElementById('editprod-' + producto.id).addEventListener('click', () => {
            this.mostrarAddProducto();
            this.modProduct(producto);
        })
        document.getElementById('delprod-' + producto.id).addEventListener('click', () => {
            callback(producto.id)
        })
    }

    renderCategoryTable(category) {
        const catUI = document.createElement('tr');
        catUI.setAttribute('id', 'cat-' + category.id);
        catUI.setAttribute('class', 'text-center');
        catUI.innerHTML = `
        <td>${category.id}</td>
        <td>${category.name}</td>
        <td>${category.description}</td>
        `
        const tbodyUI = document.querySelector('#almacen2 tbody');
        tbodyUI.appendChild(catUI);
    }

    rendermodProd(producto) {
        let elementos = document.getElementById('prod-' + producto.id).children;
        elementos[1].textContent =`${producto.name}`;
        elementos[2].textContent = `${producto.category}`;
        elementos[3].textContent = `${producto.units}`;
        elementos[4].textContent = `${producto.price} u/€`;
        elementos[5].textContent = `${producto.productImport()} €`;
    }

    renderUnits(producto) {
        let nodo = document.getElementById('unit-' + producto.id);
        nodo.textContent = `${producto.units}`;
        let nodoImport = document.getElementById('import-' + producto.id);
        nodoImport.textContent = `${producto.productImport().toFixed(2)} €`;
    }

    modProduct(producto) {
        const titulo = document.querySelector('#new-prod legend');
        titulo.textContent = `Modificar producto`;
        document.getElementById('newprod-id').value = producto.id;
        document.getElementById('newprod-name').value = `${producto.name}`;
        document.getElementById('newprod-cat').value = producto.category;
        document.getElementById('newprod-units').value = producto.units;
        document.getElementById('newprod-price').value = producto.price;
        const boton = document.getElementById('newprod-submit');
        boton.textContent = `Modificar`;
    }

    cambiarTitulo() {
        const titulo = document.querySelector('#new-prod legend');
        titulo.textContent = `Añadir producto`;
        const boton = document.getElementById('newprod-submit');
        boton.textContent = `Añadir`;
    }

    renderCategory(category) {
        const categoryUI = document.createElement('option');
        categoryUI.setAttribute('value', category.id);
        categoryUI.setAttribute('id', 'cat-' + category.id);
        categoryUI.innerHTML = `${category.name}`;
        const select = document.querySelector('#newprod-cat');
        select.appendChild(categoryUI);
    }

    renderDelProduct(product) {
        const productNodo = document.getElementById('prod-' + product.id);
        productNodo.remove();
    }

    renderDelCategory(category) {
        const categoryNodo = document.getElementById('cat-' + category.id);
        categoryNodo.remove();
    }

    renderMessege(text) {
        const textUI = document.createElement('div');
        textUI.setAttribute('class', 'alert alert-danger alert-dismissible');
        textUI.setAttribute('role', 'alert');
        textUI.innerHTML = `
        ${text}
        `
        const mensajes = document.getElementById('messages');
        mensajes.appendChild(textUI);

        setInterval(() => {
            textUI.remove();
        }, 2000);
    }

    renderStoreImport(totalImport) {
        const importeUI = document.getElementById('importe');
        importeUI.textContent = `${totalImport.toFixed(2)} €`;
    }
}

module.exports = View;