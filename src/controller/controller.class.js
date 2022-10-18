const Store = require('../model/store.class');
const View = require('../view/view.class');


class Controller {
    constructor() {
        this.store = new Store(1, 'Almacen ACME')
        this.view = new View()
    }

    init() {
        this.store.initDatos();
        this.store.categories.forEach((category) => this.view.renderCategory(category));
        this.store.categories.forEach((category) => this.view.renderCategoryTable(category));
        this.store.products.forEach((product) => this.view.renderProduct(product, this.deleteProductFromStore.bind(this), this.addUnit.bind(this), this.delUnit.bind(this)));
        this.view.renderStoreImport(this.store.totalImport());
        this.view.ocultarTodo();
        this.initMenu();
    }

    initMenu() {
        document.getElementById('Pag-prod').addEventListener('click', () => {
            this.view.ocultarTodo();
        })
        document.getElementById('Pag-cat').addEventListener('click', () => {
            this.view.mostrarCategorias();
        })
        document.getElementById('Pag-addProd').addEventListener('click', () => {
            this.view.mostrarAddProducto();
        })
        document.getElementById('Pag-addCat').addEventListener('click', () => {
            this.view.mostrarAddCategoria();
        })
    }

    addProductToStore(dataForm) {
        if(dataForm.id) {
            this.modProduct(dataForm);
            return;
        }
        try {
            const prod = this.store.addProduct(dataForm);
            this.view.renderProduct(prod, this.deleteProductFromStore.bind(this), this.addUnit.bind(this), this.delUnit.bind(this));
            this.view.renderStoreImport(this.store.totalImport());
            this.view.ocultarTodo();
        } catch(error) {
            this.view.renderMessege(error);
        }
    }

    addCategoryToStore(payload) {
        try {
            if(payload.description === "") {
                let undefined;
                payload.description = undefined;
            }
            const cat = this.store.addCategory(payload.name,payload.description);
            this.view.renderCategory(cat);
            this.view.renderCategoryTable(cat);
            this.view.mostrarCategorias();
        } catch(error) {
            this.view.renderMessege(error);
        }
    }

    modProduct(dataForm) {
        try {
            const prod = this.store.modProduct(dataForm);
            this.view.rendermodProd(prod);
            this.view.renderStoreImport(this.store.totalImport());
            this.view.cambiarTitulo();
            this.view.ocultarTodo();
        } catch(error) {
            this.view.renderMessege(error);
        }
    }

    deleteProductFromStore(id) {
        try {
            const product = this.store.getProductById(Number(id));
            if(confirm(`Desea borrar el producto ${product.name}`)) {
                const product = this.store.delProduct(id);
                this.view.renderDelProduct(product);
            }
        } catch(error) {
            this.view.renderMessege(error);
        }
    }

    deleteCategoryFromStore(id) {
        try {
            const category = this.store.delCategory(id);
            this.view.renderDelCategory(category);
        } catch(error) {
            this.view.renderMessege(error);
        }
    }

    addUnit(producto) {
        let prod = this.store.addUnit(producto);
        this.view.renderUnits(prod);
        this.view.renderStoreImport(this.store.totalImport());
    }

    delUnit(producto) {
        try {
            let prod = this.store.delUnit(producto);
            this.view.renderUnits(prod);
            this.view.renderStoreImport(this.store.totalImport());
        } catch(error) {
            this.view.renderMessege(error);
        }
    }
}

module.exports = Controller;