class View {

    renderProduct(producto) {
        const productUI = document.createElement('tr');
        productUI.setAttribute('id', 'prod-' + producto.id);
        productUI.setAttribute('class', 'text-center');
        productUI.innerHTML = `
        <td>${producto.id}</td>
        <td>${producto.name}</td>
        <td>${producto.category}</td>
        <td>${producto.units}</td>
        <td>${producto.price} u/€</td>
        <td>${producto.productImport()} €</td>
        `
        const tbodyUI = document.querySelector('#almacen tbody');
        tbodyUI.appendChild(productUI);
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
        importeUI.textContent = `
        ${totalImport} €`;
    }
}

module.exports = View;