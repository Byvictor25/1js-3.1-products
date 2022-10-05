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
        this.store.products.forEach((product) => this.view.renderProduct(product));
        this.view.renderStoreImport(this.store.totalImport());
    }

    addProductToStore(dataForm) {
        try {
            const prod = this.store.addProduct(dataForm);
            this.view.renderProduct(prod);
            this.view.renderStoreImport(this.store.totalImport());
        } catch(error) {
            this.view.renderMessege(error);
        }
    }

    addCategoryToStore(payload) {
        try {
            const cat = this.store.addCategory(payload.name,payload.description);
            this.view.renderCategory(cat);
        } catch(error) {
            this.view.renderMessege(error);
        }
    }

    deleteProductFromStore(id) {
        try {
            const product = this.store.delProduct(id);
            this.view.renderDelProduct(product);
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
}

module.exports = Controller;