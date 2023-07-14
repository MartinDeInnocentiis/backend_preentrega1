import express from "express";
import { Router } from "express";
import CartManager from "../classes/CartManager.js";

const router = Router();
const cartMngr = new CartManager("carrito.json")

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.get("/", async (req, res) => {
    const { limit } = req.query;
    try {
        let response = await cartMngr.getCarts();
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


router.get("/:cid", async (req, res) => {
    const { cid } = req.params;
    let cart = await cartMngr.getCartsById(parseInt(cid));
    if (cart && cart.id) {
        res.json({ message: "Success.", data: cart });
    } else {
        res.status(500).json({
            message: "CART NOT FOUND."
        });
    }
});


router.post("/", async (req, res) => {
    try {
        await cartMngr.addCart();
        res.json({
            message: "Cart added OK",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error."
        });
    }
});


router.post("/:cid/products/:pid", async (req, res) => {
    const { cid } = req.params;
    const { pid } = req.params;
    try {
        const cart = await cartMngr.addProductToCart(parseInt(cid), parseInt(pid))
        res.json({ message: "Success.", data: cart });
    } catch (error) {
        res.json({
            message: "ERROR: Cart is not found.",
        });
    }
})

router.post("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    try {
      const cart = await cartMngr.addProductToCart(parseInt(cid), parseInt(pid));
      res.json({ message: "Success.", data: cart });
    } catch (error) {
      console.log(error); 
      res.json({
        message: "ERROR: Cart is not found.",
      });
    }
  });

export default router;