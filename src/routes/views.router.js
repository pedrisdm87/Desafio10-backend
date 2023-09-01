import { Router } from "express"
import ProductManager from "../controllers/productManager.js";

const router = Router();

const productManager = new ProductManager()

const movies = await productManager.getProducts()

router.get("/", async (req, res) => {
    try {
    res.render("home", { movies });
    } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
    }
});

router.get("/realTimeProducts", async (req, res) => {
    try {
    res.render("realTimeProducts", { movies });
    } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
    }
});

export default router;