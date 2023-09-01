import { Router } from "express";
import ProductManager from "../controllers/productManager.js";

const router = Router();

const productManager = new ProductManager();


// http://localhost:8080/products/ con limit (http://localhost:8080/products?limit=5)
router.get("/", async (req, res) => {
    const movies = await productManager.getProducts();
    const limit = req.query.limit;
    if (!limit) {
        res.status(200).json(movies);
    } else {
        let prodLimit = movies.slice(0, limit);
        res.status(200).json(prodLimit);
    }
});

// //endpoint para leer un solo producto a partir de su ID
router.get("/:pid", async (req, res) => {
    const movies = await productManager.getProducts();
    const id = req.params.pid;
    const productId = movies.find((item) => item.id == id);
    if (!productId) {
        return res.status(404).json({ Error: "The movie does not exist" });
    } else {
        res.status(200).json(productId);
    }
});

// //endpoint para crear a un nuevo producto
router.post("/", async (req, res) => {
    const { title, description, price, thumbnail, code, stock } = req.body;
    try {
        const result = await productManager.addProduct(
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        );
        if (result.error) {
            // Se ejecuta si hay un error de validación
            res.status(400).json({ error: result.error });
        } else {
            // Se ejecuta si el producto se agrega correctamente
            const products = await productManager.getProducts(); // Obtengo los productos actualizados
            req.app.get("socketio").emit("updatedProducts", products);

            res.status(201).json({ message: "Product added successfully" });
        }
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ error: "Error adding product" });
    }
});

//endpoint para actualizar los datos de un producto
router.put("/:id", async (req, res) => {
    const id = req.params.id;
    const newData = req.body;
    try {
        const movies = await productManager.getProducts();
        const productId = movies.find((item) => item.id == id);
        if (!productId) {
            return res.status(404).json({ Error: "The movie does not exist" });
        }

        await productManager.updateProduct(id, newData);

        const products = await productManager.getProducts(); // Obtengo los productos actualizados
        req.app.get("socketio").emit("updatedProducts", products);

        res.status(200).json({ message: "Product successfully updated" });
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.status(500).json({ error: "Error deleting the product" });
    }
});

//endpoint para eliminar un producto
router.delete("/:pid", async (req, res) => {
    const id = req.params.pid; //obtengo el di del producto a eliminar
    try {
        const movies = await productManager.getProducts();
        const productId = movies.find((item) => item.id == id);
        if (!productId) {
            return res.status(404).json({ Error: "The movie does not exist" });
        }

        await productManager.deleteProductById(id);

        const products = await productManager.getProducts(); // Obtengo los productos actualizados
        req.app.get("socketio").emit("updatedProducts", products);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting the product:", error);
        res.status(500).json({ error: "Error deleting the product" });
    }
});

export default router;