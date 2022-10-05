const Category = require('./category.class');
const Product = require('./product.class');
const datosIni = require('../datosIni.json');

class Store {
    constructor(id, name) {
        this.id = id
        this.name = name
        this.products = []
        this.categories = []
    }

    getCategoryById(id) {
        let getCategory = this.categories.find(category => category.id === id);
        if(!getCategory) {
            throw 'La categoria con ese id no existe';
        }
        return getCategory;
    }

    getCategoryByName(name) {
        let getCategory = this.categories.find(category => category.name.toLocaleUpperCase() === name.toLocaleUpperCase());
        if(!getCategory) {
            throw 'La categoria con ese nombre no existe';
        }
        return getCategory;
    }

    getProductById(id) {
        let getProduct = this.products.find(product => product.id === id);
        if(!getProduct) {
            throw 'El producto con ese id no existe';
        }
        return getProduct;
    }

    getProductsByCategory(id) {
        let getProducts = this.products.filter(product => product.category == id);
        return getProducts;
    }

    addCategory(name, descripcion) {
        if(!name) {
            throw 'No se ha introducido el nombre';
        } else {
            try {
                this.getCategoryByName(name);
            } catch {
                let newId = this.getNextId(this.categories);
                let category = new Category (newId, name, descripcion);
                this.categories.push(category);
                return category;
            } 
            throw 'Ya existe una categoría con ese nombre';
        }
    }   

    addProduct(payload) {
        const unidades = parseInt(payload.units);
        const precio = parseInt(payload.price);
        const category = parseInt(payload.category);
        if(!payload.name) {
            throw 'No se ha introducido el nombre';
        }
        if(!category) {
            throw 'No has indicado la categoria';
        } else {
            this.getCategoryById(category);
        }

        if(!precio) {
            throw 'No se ha introducido ningn precio';

        } else if(isNaN(precio) || precio < 0) {
            throw 'No se ha introducido un numero entero';
        }

        if(unidades) {
            if(isNaN(unidades) || unidades <= 0 || !Number.isInteger(unidades)) {
                throw 'No se ha introducido las unidades correctamente';
            }
        }
        let newId = this.getNextId(this.products);
        let product = new Product (newId, payload.name, payload.category, payload.price, payload.units);
        this.products.push(product);
        return product;

    }

    delCategory(id) {
        const idToComprobe = parseInt(id);
        let categoria = this.getCategoryById(idToComprobe);
        let productCategory = this.getProductsByCategory(idToComprobe);
        if(productCategory.length > 0) {
            throw 'Esta categoria tiene productos';
        }
        let categoryIndex = this.categories.indexOf(categoria);
        this.categories.splice(categoryIndex,1);
        return categoria;
    }

    delProduct(id) {
        const idToComprobe = parseInt(id);
        let producto = this.getProductById(idToComprobe);
        if(producto.units > 0) {
            throw 'Hay existencias del producto';
        }
        let productIndex = this.products.indexOf(producto);
        this.products.splice(productIndex,1);
        return producto;
    }

    totalImport() {
        return this.products.reduce((total, product) => total += product.productImport(),0);
    }

    orderByUnitsDesc() {
        return this.products.sort((product1, product2) => product2.units - product1.units);
    }

    orderByName() {
        return this.products.sort((product1, product2) => product1.name.localeCompare(product2.name));
    }

    underStock(unidades) {
        return this.products.filter(producto => producto.units < unidades);
    }

    toString() {
        return "Almacén " + this.id + " => " + this.products.length + " productos: " + this.totalImport + " €" 
        + this.products.forEach((product) => product.toString);
    }

    initDatos() {
        let categorias = datosIni.categories;
        categorias.forEach((category) => {
            this.categories.push(new Category(category.id, category.name,category.description))
        })
        let productos = datosIni.products;
        productos.forEach((producto) => {
            this.products.push(new Product(producto.id, producto.name, producto.category, producto.price, producto.units))
        })
    }

    getNextId(array) {
        return array.reduce((max, item) => (max > item.id)? max : item.id, 0) + 1;
    }
}

module.exports = Store