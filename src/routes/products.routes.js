
import { Router } from "express"
import fs from 'fs'
import { parse } from "path"
import { pid } from "process"

const router = Router()

const jsonPath = '../ProductManager.json'

class ProductManager{
    static products = []
    static id = 1

    constructor(title, description, code, price, status, stock, category, thumbnail){
        this.id = ProductManager.id++
        this.title = title
        this.description = description
        this.code = code
        this.price = price
        this.status = status
        this.stock = stock
        this.category = category
        this.thumbnail = thumbnail
    }

    static async addProduct(title, description, code, price, status, stock, category, thumbnail) {
        try {
            if (!title || !description || !code || !price || !status|| !stock || !category || !thumbnail) {
                return ("Todos los campos son obligatorios.")
            }
        
            const existingProduct = ProductManager.products.find((ProductManager) => ProductManager.code === code)
            if (existingProduct) {
                return (`El producto con el código ${code} ya existe.`)
            }
        
            const newProduct = new ProductManager(title, description, code, price, status, stock, category, thumbnail)
            ProductManager.products.push(newProduct)
            const dataToWrite = JSON.stringify(ProductManager.products, null, 2)
            await fs.promises.writeFile(jsonPath, dataToWrite, 'utf-8')
            console.log(`Producto agregado con ID: ${newProduct.id}`)
            } catch (err){
                console.error(err.message)
            } 
        }

    static async getProducts() {
        try {
            const dataJSON = await fs.promises.readFile(jsonPath, { encoding: 'utf-8'}, (err, data) => {
                return data
            }) 
            ProductManager.products = JSON.parse(dataJSON)
            return ProductManager.products
          } catch (error) {
            console.error(error.message)
          }
      }

      static async getProductById(id) {
        try {
            const dataJSON = await fs.promises.readFile(jsonPath, { encoding: 'utf-8'}, (err, data) => {
                return data
            })
            ProductManager.products = JSON.parse(dataJSON)
            const product = ProductManager.products.find((ProductManager) => ProductManager.id === id)
            if (product){
                return product
            } else {
                return (`Producto con el id: ${id} no encontrado, ID no valida`)
            }
          } catch (error) {
            console.error(error.message)
          }
    }

    static async updateProduct(id, updatedProduct) {
        try {
            const dataJSON = await fs.promises.readFile(jsonPath, { encoding: 'utf-8'}, (err, data) => {
                return data
            })
            ProductManager.products = JSON.parse(dataJSON)

            const productIndex = ProductManager.products.findIndex((product) => product.id === id)
            if (productIndex === -1) {
                console.error("Producto no encontrado. ID no válido.")
                return;
              }

            updatedProduct.id = id
            ProductManager.products[productIndex] = updatedProduct

            const dataToWrite = JSON.stringify(ProductManager.products, null, 2)
            await fs.promises.writeFile(jsonPath, dataToWrite, 'utf-8')
          } catch (error) {
            console.error(error.message)
          }
    }

    static async deleteProduct(id) {
        try{
            const dataJSON = await fs.promises.readFile(jsonPath, { encoding: 'utf-8'}, (err, data) => {
                return data
            })
            ProductManager.products = JSON.parse(dataJSON)
            const productIndex = ProductManager.products.findIndex((product) => product.id === id);
            if (productIndex === -1) {
                console.error("Producto no encontrado. ID no válido.");
                return;
            }
            ProductManager.products.splice(productIndex, 1);
            console.log(`Producto con ID ${id} ha sido eliminado.`);

            const dataToWrite = JSON.stringify(ProductManager.products, null, 2)
            await fs.promises.writeFile(jsonPath, dataToWrite, 'utf-8')
        } catch(err){
            console.error(err.message)
        }
    }    
  }

router.get('/', async (req, res) => {
    try{
        const products = await ProductManager.getProducts()
        res.status(200).send(products)
    } catch(err){
        res.status(400).send(err.message)
    }
})

router.get('/:pid', async (req, res) => {
    try{
        const id = parseInt(req.params.pid)
        const products = await ProductManager.getProductById(id)
        res.status(200).send(products)
    } catch(err){
        res.status(400).send(err.message)
    }
})

router.post('/', async (req, res) => {
    try{
        const product = req.body
        await ProductManager.addProduct(product.title, product.description, product.code, product.price, product.status, product.stock, product.category, product.thumbnail)
        res.status(200).send(`El producto ha sido agregado con exito`)
    } catch(err){
        res.status(400).send(err.message)
    }
})

router.put('/:pid', async (req, res) => {
    try{
        const pid = parseInt(req.params.pid)
        const edit = req.body
        await ProductManager.updateProduct(pid, edit)
        res.status(200).send(`El producto con id ${pid} ha sido actualizado correctamente`)
    } catch(err){
        res.status(400).send(err.message)
    }
})

router.delete('/:pid', async (req, res) => {
    try{
        const pid = parseInt(req.params.pid)
        await ProductManager.deleteProduct(pid)
        res.status(200).send(`El producto con id ${pid} ha sido borrado exitosamente`)
    } catch(err){
        res.status(400).send(err.message)
    }
})

export default router