const Category = require('./category.class');
const Product = require('./product.class');
const SERVER = 'http://localhost:3000';


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

    async addCategory(name, description) {
        if(!name) {
            throw 'No se ha introducido el nombre';
        } else {
            try {
                this.getCategoryByName(name);
            } catch {
                const cat = await this.addCategoryToBD({name, description})
                let category = new Category (cat.id, cat.name, cat.description);
                this.categories.push(category);
                return category;
            } 
            throw 'Ya existe una categoría con ese nombre';
        }
    }   

    async addProduct(payload) {
        const units = parseInt(payload.units);
        const price = parseInt(payload.price);
        const category = parseInt(payload.category);
        const name = payload.name;
        if(!payload.name) {
            throw 'No se ha introducido el nombre';
        }
        if(!category) {
            throw 'No has indicado la categoria';
        } else {
            this.getCategoryById(category);
        }

        if(!price) {
            throw 'No se ha introducido ningn precio';

        } else if(isNaN(price) || price < 0) {
            throw 'No se ha introducido un numero entero';
        }

        if(units) {
            if(isNaN(units) || units <= 0 || !Number.isInteger(units)) {
                throw 'No se ha introducido las unidades correctamente';
            }
        }
        const producto = await this.addProductToBD({name, category, price, units})
        let product = new Product (producto.id, producto.name, producto.category, producto.price, producto.units);
        this.products.push(product);
        return product;
    }

    async modProduct(payload) {
        const id = parseInt(payload.id);
        const units = parseInt(payload.units);
        const price = parseInt(payload.price);
        const category = parseInt(payload.category);
        const name = payload.name;

        if(!id) {
            throw 'No se ha encontrado la id';
        }
        if(!payload.name) {
            throw 'No se ha introducido el nombre';
        }
        if(!category) {
            throw 'No has indicado la categoria';
        } else {
            this.getCategoryById(category);
        }
        if(!price) {
            throw 'No se ha introducido ningn precio';

        } else if(isNaN(price) || price < 0) {
            throw 'No se ha introducido un numero entero';
        }
        if(units) {
            if(isNaN(units) || units <= 0 || !Number.isInteger(units)) {
                throw 'No se ha introducido las unidades correctamente';
            }
        }
        const producto = await this.modProductInBD({id, name, category, units, price})
        let product = this.getProductById(id);
        product.name = producto.name;
        product.category = producto.category;
        product.price = producto.price;
        product.units = producto.units;
        return product;
    }

    async addUnit(payload) {
        const id = payload.id;
        const units = payload.units + 1;
        const producto = await this.modUnitsInBD(id, units);
        let prod = this.getProductById(payload.id);
        prod.units = producto.units;
        return prod;
    }

    async delUnit(payload) {
        const id = payload.id;
        const units = payload.units - 1;
        const producto = await this.modUnitsInBD(id, units);
        let prod = this.getProductById(payload.id);
        prod.units = producto.units;
        if(prod.units < 0) {
            throw 'No se puede poner menos de 0 unidades';
        }
        return prod;
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

    async delProduct(id) {
        const idToComprobe = parseInt(id);
        let producto = this.getProductById(idToComprobe);
        if(producto.units > 0) {
            throw 'Hay existencias del producto';
        }
        await this.delProductInBD(id);
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

    async loadData() {
        try {
            const response = await fetch(SERVER + '/categories')
            if (!response.ok) {
                throw `Error ${response.status} de la BBDD: ${response.statusText}`
            }
            const categorias = await response.json()
            categorias.forEach(category => this.categories.push(new Category(category.id, category.name,category.description)))
        } catch (error) {
            throw 'ErrorServer:' + error;
        }
        try {
            const response = await fetch(SERVER + '/products')
            if (!response.ok) {
                throw `Error ${response.status} de la BBDD: ${response.statusText}`
            }
            const products = await response.json()
            products.forEach(product => this.products.push(new Product(product.id, product.name, product.category, product.price, product.units)))
        } catch (error) {
            throw 'ErrorServer:' + error;
        }
    }

    async addCategoryToBD(cat) {
        try {
            const response = await fetch(SERVER + '/categories', {
                method: 'POST',
                body: JSON.stringify(cat),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (!response.ok) {
                throw `Error ${response.status} de la BBDD: ${response.statusText}`
            }
            const categoria = await response.json()
            return categoria;
        } catch (error) {
            throw 'Error' + error;
        }
    }

    async addProductToBD(producto) {
        try {
            const response = await fetch(SERVER + '/products', {
                method: 'POST',
                body: JSON.stringify(producto),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (!response.ok) {
                throw `Error ${response.status} de la BBDD: ${response.statusText}`
            }
            const product = await response.json()
            return product;
        } catch (error) {
            throw 'Error' + error;
        }
    }

    async delProductInBD(id) {
        try {
            const response = await fetch(SERVER + '/products/' + id, {
                method: 'DELETE'
            })
            if (!response.ok) {
                throw `Error ${response.status} de la BBDD: ${response.statusText}`
            }
        } catch (error) {
            throw 'Error' + error;
        }
    }

    async modProductInBD(producto) {
        try {
            const response = await fetch(SERVER + '/products/' + producto.id, {
                method: 'PUT',
                body: JSON.stringify(producto),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (!response.ok) {
                throw `Error ${response.status} de la BBDD: ${response.statusText}`
            }
            const product = await response.json()
            return product;
        } catch (error) {
            throw 'Error' + error;
        }
    }

    async modUnitsInBD(id, units) {
        try {
            const response = await fetch(SERVER + '/products/' + id, {
                method: 'PATCH',
                body: JSON.stringify({
                    units : units
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (!response.ok) {
                throw `Error ${response.status} de la BBDD: ${response.statusText}`
            }
            const product = await response.json()
            return product;
        } catch (error) {
            throw 'Error' + error;
        }
    }

    checkName(name, id) {
        return this.products.some(product => product.name === name && product.id != id);
    }

    getNextId(array) {
        return array.reduce((max, item) => (max > item.id)? max : item.id, 0) + 1;
    }
}

module.exports = Store