'use strict'

// Aquí importaremos la clase del controlador e instanciaremos uno
const Controller = require('./controller/controller.class')

const myController = new Controller()
myController.init()

// A continuación crearemos una función manejadora para cada formulario
window.addEventListener('load', () => {

  // función manejadora del formulario 'new-prod'
  document.getElementById('new-prod').addEventListener('submit', (event) => {
    event.preventDefault()
    const id = document.getElementById('newprod-id').value
    const name = document.getElementById('newprod-name').value
    const price = document.getElementById('newprod-price').value
    const category = document.getElementById('newprod-cat').value
    const units = document.getElementById('newprod-units').value  
    myController.addProductToStore({ id, name, price, category, units })
    document.getElementById('new-prod').reset();
  })

  document.getElementById('new-cat').addEventListener('submit', (event) => {
    event.preventDefault()

    // Aquí el código para obtener los datos del formulario
    const name = document.getElementById('newcat-name').value
    const description = document.getElementById('newcat-desc').value
    // ...
    
    // Aquí llamamos a la función del controlador que añade productos (addProductToStore)
    // pasándole como parámetro esos datos
    myController.addCategoryToStore({ name, description })   
    // Sintaxis de ES2015 que equivale a 
    //
    // myController.addProductToStore(
    //   { 
    //     name: name,
    //     price: price 
    //   }
    // )
    document.getElementById('new-cat').reset();
  })


  document.getElementById('del-cat').addEventListener('submit', (event) => {
    event.preventDefault()

    myController.deleteCategoryFromStore(document.getElementById('delcat-id').value)
  })
  document.getElementById('del-cat').reset();
})
