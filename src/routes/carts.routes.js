
import { Router } from "express"
import fs from 'fs'
import { type } from "os"

const router = Router()

const jsonPath = '../Carts.json'

class Carts{
    static carts = []
    static id = 1

    constructor(){
        this.id = Carts.id++
        this.products = []
    }

    static async addCart() {
        try {       
            const newCart = new Carts()
            Carts.carts.push(newCart)
            const dataToWrite = JSON.stringify(Carts.carts, null, 2)
            await fs.promises.writeFile(jsonPath, dataToWrite, 'utf-8')
            return (`Su carrito ha sido creado`)
            } catch (err){
                console.error(err.message)
            } 
        }

        static async getCartById(id) {
            try {
                const dataJSON = await fs.promises.readFile(jsonPath, { encoding: 'utf-8'}, (err, data) => {
                    return data
                })
                Carts.carts = JSON.parse(dataJSON)
                const cart = Carts.carts.find((Carts) => Carts.id === id).products
                if (cart){
                    return cart
                } else {
                    return (`El Carrito con el id: ${id} no encontrado, ID no valida`)
                }
              } catch (error) {
                console.error(error.message)
              }
        }

        static async addProduct(cartId, productId) {
            try {
                const dataJSON = await fs.promises.readFile(jsonPath, { encoding: 'utf-8'}, (err, data) => {
                    return data
                })
                Carts.carts = JSON.parse(dataJSON)
                
                const cart = Carts.carts.find((Carts) => Carts.id === cartId)
                const existente = cart.products.find((products) => products.productId === productId)
                console.log(existente)

               if(existente){
                    existente.quantity++
                } else {
                const product = { productId: productId, quantity: 1}
                cart.products.push(product)
                } 

                const dataToWrite = JSON.stringify(Carts.carts, null, 2)
                await fs.promises.writeFile(jsonPath, dataToWrite, 'utf-8')

                return (`Se agrego el producto con id: ${productId}`)
                
                } catch (err){
                    console.error(err.message)
                } 
            }
    }


router.post('/', async (req, res) => {
    try{
        const cart = await Carts.addCart()
        res.status(200).send(cart)
    } catch(err){
        res.status(400).send(err.message)
    }
})

router.get('/:cid', async (req, res) => {
    try{
        const id = parseInt(req.params.cid)
        console.log(id)
        const cart = await Carts.getCartById(id)
        res.status(200).send(cart)
    } catch(err){
        res.status(400).send(err.message)
    }
})

router.post('/:cid/products/:pid', async (req, res) => {
    try{
        const cartId = parseInt(req.params.cid)
        const productId = parseInt(req.params.pid)
        if(cartId < 1 || productId < 1){
            res.status(400).send(`ID no valido`)
        } else{
        const productAdd = await Carts.addProduct(cartId, productId)
        res.status(200).send(productAdd)
        }
    } catch(err){
        res.status(400).send(err.message)
    }
})

export default router