const Store = require('../model/store.class');
const View = require('../view/view.class');


class Controller {
    constructor() {
        this.store = new Store(1, 'Almacen ACME')
        this.view = new View()
    }

    setListeners() {
        const inputID = document.getElementById('newprod-id');
        const inputNombre = document.getElementById('newprod-name');
        inputNombre.addEventListener('blur', () => {
            if(this.store.checkName(inputNombre.value, inputID.value)) {
                inputNombre.setCustomValidity("El nombre ya existe");
            } else {
                inputNombre.setCustomValidity("");
            }
            inputNombre.nextElementSibling.textContent = inputNombre.validationMessage;
        })
        const inputCat = document.getElementById('newprod-cat');
        inputCat.addEventListener('blur', () => {
            inputCat.nextElementSibling.textContent = inputCat.validationMessage;
        })
        const inputUnits = document.getElementById('newprod-units');
        inputUnits.addEventListener('blur', () => {
            inputUnits.nextElementSibling.textContent = inputUnits.validationMessage;
        })
        const inputPrice = document.getElementById('newprod-price');
        inputPrice.addEventListener('blur', () => {
            inputPrice.nextElementSibling.textContent = inputPrice.validationMessage;
        })
        document.getElementById('new-prod').addEventListener('submit', (event) => {
            event.preventDefault();
        
            inputNombre.nextElementSibling.textContent = inputNombre.validationMessage;
            
            inputCat.nextElementSibling.textContent = inputCat.validationMessage;
            
            inputUnits.nextElementSibling.textContent = inputUnits.validationMessage;

            inputPrice.nextElementSibling.textContent = inputPrice.validationMessage;

        })
    }

    async init() {
        try {
            await this.store.loadData()
        } catch (error) {
            this.view.renderMessege('Error cargando los datos: ' + error)
        }
        this.store.categories.forEach((category) => this.view.renderCategory(category));
        this.store.categories.forEach((category) => this.view.renderCategoryTable(category));
        this.store.products.forEach((product) => this.view.renderProduct(product, this.deleteProductFromStore.bind(this), this.addUnit.bind(this), this.delUnit.bind(this)));
        this.view.renderStoreImport(this.store.totalImport());
        this.view.ocultarTodo();
        this.initMenu();
        this.setListeners();
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

    async addProductToStore(dataForm) {
        if(document.getElementById('new-prod').checkValidity()) {
            if(dataForm.id) {
                this.modProduct(dataForm);
                return;
            }
            try {
                const prod = await this.store.addProduct(dataForm);
                this.view.renderProduct(prod, this.deleteProductFromStore.bind(this), this.addUnit.bind(this), this.delUnit.bind(this));
                this.view.renderStoreImport(this.store.totalImport());
                this.view.ocultarTodo();
            } catch(error) {
                this.view.renderMessege(error);
            }
        }
    }

    async addCategoryToStore(payload) {
        try {
            if(payload.description === "") {
                let undefined;
                payload.description = undefined;
            }
            const cat = await this.store.addCategory(payload.name,payload.description);
            this.view.renderCategory(cat);
            this.view.renderCategoryTable(cat);
            this.view.mostrarCategorias();
        } catch(error) {
            this.view.renderMessege(error);
        }
    }

    async modProduct(dataForm) {
        if(document.getElementById('new-prod').checkValidity()) {
            try {
                const prod = await this.store.modProduct(dataForm);
                this.view.rendermodProd(prod);
                this.view.renderStoreImport(this.store.totalImport());
                this.view.cambiarTitulo();
                this.view.ocultarTodo();
            } catch(error) {
                this.view.renderMessege(error);
            }
        }
    }

    async deleteProductFromStore(id) {
        try {
            const product = this.store.getProductById(Number(id));
            if(confirm(`Desea borrar el producto ${product.name}`)) {
                const product = await this.store.delProduct(id);
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

    async addUnit(producto) {
        let prod = await this.store.addUnit(producto);
        this.view.renderUnits(prod);
        this.view.renderStoreImport(this.store.totalImport());
    }

    async delUnit(producto) {
        try {
            let prod = await this.store.delUnit(producto);
            this.view.renderUnits(prod);
            this.view.renderStoreImport(this.store.totalImport());
        } catch(error) {
            this.view.renderMessege(error);
        }
    }
}

module.exports = Controller;