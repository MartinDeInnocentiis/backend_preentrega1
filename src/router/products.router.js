import express from "express";
import { Router } from "express";
import { ProductManager } from "../classes/ProductManager.js";


const router = Router();
let products = [];
const prodMngr = new ProductManager("products.json"); //INSTACIAMOS LA CLASS ProductManager

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
//CREAMOS UNA RUTA LLAMADA PRODUCTS QUE DEVUELVE UNA LISTA DE PRODUCTOS, QUE VIENE DESDE LA INSTANCIA prodMngr DE LA CLASS ProductManager
router.get("/", async (req, res) => {
    const { limit } = req.query;
    try {
        let response = await prodMngr.getProducts();
        if (limit) {
            let tempArray = response.filter((dat, index) => index < limit);

            res.json({ data: tempArray, limit: limit, quantity: tempArray.length });
        } else {
            res.json({ data: response, limit: false, quantity: response.length }); 
        }
    } catch (err) {
        console.log(err);
    }
});

//CREAMOS RUTA DINAMICA QUE DEVUELVE UN PRODUCTO SEGÚN SU NUMERO DE ID
router.get("/:pid", async (req, res) => {
    const { pid } = req.params;

    let product = await prodMngr.getProductById(parseInt(pid));

    if (product && product.id) {
        res.json({ message: "Success.", data: product });
    } else {
        res.json({
            message: "ERROR: Product is not found.",
        });
    }
});

router.post("/", async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnail } = req.body;
    const product = {};
    if (!title || !description || !code || !price || !stock || !category) {
        res.json({ message: "Complete all the fields!" })
    } else {
        product.title = title;
        product.description = description;
        product.code = code;
        product.price = price;
        product.staus = !status || typeof status !== "boolean" ? true : status;
        product.stock = stock;
        product.category = category;
        product.thumbnail = !thumbnail ? "" : thumbnail;

        try {
            const response = await prodMngr.addProduct(product);
            res.json({ message: "Product added to cart", data: response });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Server Error."
            });
        }
    }
});

router.put(":/pid", async (req, res) => {
    const { pid } = req.params;
    const { title, description, code, price, status, stock, category, thumbnail } = req.body;
    const productTemp = {};
    let product = await prodMngr.getProductById(parseInt(pid));
    if (product) {

        if (!title, !description, !code, !price, !status, !stock, !category, !thumbnail) {
            res.json({ message: "Complete all fields" });
        }

        productTemp.title = title;
        productTemp.description = description;
        productTemp.code = code;
        productTemp.price = price;
        productTemp.status = status;
        productTemp.stock = stock;
        productTemp.category = category;
        productTemp.thumbnail = thumbnail;

        let result = await prodMngr.updateProductById(parseInt(pid), productTemp);
        res.json({ message: "Product Updated.", data: result });
    } else {
        res.json({
            message: "ERROR: Can´t update the product. Not found.",
        });
    }
});

router.delete("/:pid", async (req, res) => {
    const { pid } = req.params;
    let product = await prodMngr.getProductById(parseInt(pid));
    if (!product) {
        res.json({
            message: "el producto solicitado no existe, no se puede eliminar",
        });
    } else {
        let result = await prodMngr.deleteProductById(parseInt(pid));
        res.json({ message: "producto eliminado", data: result });
    }
});


export default router;