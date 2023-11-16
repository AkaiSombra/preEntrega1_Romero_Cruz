
import { Router } from "express"
import fs from 'fs'
import { type } from "os"
import { parse } from "path"
import { pid, title } from "process"

const router = Router()

const jsonPath = '../ProductManager.json'

class ProductManager{
    static products = []

    constructor(id, title, description, code, price, status, stock, category, thumbnail){
        this.id = id
        this.title = title
        this.description = description
        this.code = code
        this.price = price
        this.status = status
        this.stock = stock
        this.category = category
        this.thumbnail = thumbnail
    }    
  }

router.get('/', async (req, res) => {
    try {
        const dataJSON = await fs.promises.readFile(jsonPath, { encoding: 'utf-8'}, (err, data) => {
            return data
        }) 
        ProductManager.products = JSON.parse(dataJSON)
        res.status(200).send(ProductManager.products)
      } catch(error){
        res.status(400).send(error.message)
      }
})

router.get('/:pid', async (req, res) => {
    try {
        const dataJSON = await fs.promises.readFile(jsonPath, { encoding: 'utf-8'}, (err, data) => {
            return data
        })
        ProductManager.products = JSON.parse(dataJSON)
        const id = parseInt(req.params.pid)
        const product = ProductManager.products.find((ProductManager) => ProductManager.id === id)
        if (product){
            res.status(200).send(product)
        } else {
            res.status(400).send(`Producto con el id: ${id} no encontrado, ID no valida`)
        }
      } catch (error) {
        res.status(400).send(error.message)
      }
})

router.post('/', async (req, res) => {
    try {
        const dataJSON = await fs.promises.readFile(jsonPath, { encoding: 'utf-8'}, (err, data) => {
            return data
        }) 
        ProductManager.products = JSON.parse(dataJSON)

        const product = req.body
        let id = ProductManager.products.length + 1
        const idSearch = ProductManager.products.some((products) => {
            return products.id === id
        })

        if(idSearch){
            id +=1
        }
        const thumbnail = product.thumbnail || ''

        if (!product.title || !product.description || !product.code || !product.price || !product.status|| !product.stock || !product.category) {
            return res.status(400).send("Todos los campos son obligatorios.")
        }
    
        const existingProduct = ProductManager.products.some((products) => {
            return products.code === product.code
        })
        if (existingProduct) {
            res.status(400).send(`El producto con el código ${product.code} ya existe.`)
        } else{
            const newProduct = new ProductManager(id, product.title, product.description, product.code, product.price, product.status, product.stock, product.category, thumbnail)
            ProductManager.products.push(newProduct)
            const dataToWrite = JSON.stringify(ProductManager.products, null, 2)
            await fs.promises.writeFile(jsonPath, dataToWrite, 'utf-8')
            res.status(200).send(`Producto agregado con ID: ${newProduct.id}`)
        }
        } catch (err){
            res.status(400).send(err.message)
        } 
})

router.put('/:pid', async (req, res) => {  
    try {
        const dataJSON = await fs.promises.readFile(jsonPath, { encoding: 'utf-8'}, (err, data) => {
            return data
        })
        ProductManager.products = JSON.parse(dataJSON)

        const pid = parseInt(req.params.pid)
        const updatedProductProps = req.body

        const productIndex = ProductManager.products.findIndex((product) => product.id === pid)
        if (productIndex === -1) {
            return res.status(400).send("Producto no encontrado. ID no válido.")
          }
        const existingProduct = ProductManager.products[productIndex];
        const updatedProduct = { ...existingProduct, ...updatedProductProps };
        updatedProduct.id = pid
        ProductManager.products[productIndex] = updatedProduct

        const dataToWrite = JSON.stringify(ProductManager.products, null, 2)
        await fs.promises.writeFile(jsonPath, dataToWrite, 'utf-8')
        res.status(200).send(`El producto con ID:${pid} ha sido actualizado correctamente`)
      } catch (error) {
        res.status(400).send(error.message)
      }
})

router.delete('/:pid', async (req, res) => {
    try{
        const dataJSON = await fs.promises.readFile(jsonPath, { encoding: 'utf-8'}, (err, data) => {
            return data
        })
        ProductManager.products = JSON.parse(dataJSON)

        const pid = parseInt(req.params.pid)

        const productIndex = ProductManager.products.findIndex((product) => product.id === pid);
        if (productIndex === -1) {
            return res.status(400).send(("Producto no encontrado. ID no válido."))
        }

        ProductManager.products.splice(productIndex, 1);

        const dataToWrite = JSON.stringify(ProductManager.products, null, 2)
        await fs.promises.writeFile(jsonPath, dataToWrite, 'utf-8')

        res.status(200).send(`El producto con id ${pid} ha sido borrado exitosamente`)
    } catch(err){
        res.status(400).send(err.message)
    }
})

export default router