
import { Router } from "express"
import fs from 'fs'
import { type } from "os"

const router = Router()

const jsonPath = '../Carts.json'

class Carts{
    static carts = []

    constructor(id){
        this.id = id
        this.products = []
    }
}


router.post('/', async (req, res) => {
    try {
        const dataJSON = await fs.promises.readFile(jsonPath, { encoding: 'utf-8'}, (err, data) => {
            return data
        })
        Carts.carts = JSON.parse(dataJSON)

        const id = Carts.carts.length +1

        const newCart = new Carts(id)
        Carts.carts.push(newCart)

        const dataToWrite = JSON.stringify(Carts.carts, null, 2)
        await fs.promises.writeFile(jsonPath, dataToWrite, 'utf-8')

        res.status(200).send(`Su carrito con ID:${id} ha sido creado`)
        } catch (err){
             res.status(400).send(err.message)
        } 
})

router.get('/:cid', async (req, res) => {
    try {
        const dataJSON = await fs.promises.readFile(jsonPath, { encoding: 'utf-8'}, (err, data) => {
            return data
        })
        Carts.carts = JSON.parse(dataJSON)

        const id = parseInt(req.params.cid)
        
        const idSearch = Carts.carts.some((cart) => {
            return cart.id === id
        })
        if(idSearch){
            const cart = Carts.carts.find((Carts) => Carts.id === id).products
            res.status(200).send(cart)
        } else {
            res.status(400).send(`El Carrito con el id: ${id} no encontrado, ID no valida`)
        }

      } catch (err) {
        res.status(400).send(err.message)
      }
})

router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const dataJSON = await fs.promises.readFile(jsonPath, { encoding: 'utf-8'}, (err, data) => {
            return data
        })
        Carts.carts = JSON.parse(dataJSON)

        const cartId = parseInt(req.params.cid)
        const productId = parseInt(req.params.pid)

        if(cartId < 1 || productId < 1){
            res.status(400).send(`ID no valido`)
        } else{
            const idSearch = Carts.carts.some((cart) => {
                return cart.id === cartId
            })
            
            if(idSearch){
                const cart = Carts.carts.find((Carts) => Carts.id === cartId)
                const existente = cart.products.find((products) => products.id === productId)

                if(existente){
                        existente.quantity++
                        res.status(200).send(`Se añadio stock de 1 al producto con ID:${productId}`)
                    }else {
                        const product = { id: productId, quantity: 1}
                        cart.products.push(product)
                        res.status(200).send(`Se agrego el producto con id: ${productId}`)
                    } 

                    const dataToWrite = JSON.stringify(Carts.carts, null, 2)
                    await fs.promises.writeFile(jsonPath, dataToWrite, 'utf-8')
                } else {
                    res.status(400).send(`El carrito con ID:${cartId} no se encontro, ID no valido`)
                }
        }
        
        } catch (err){
            res.status(400).send(err.message)
        } 
})

export default router