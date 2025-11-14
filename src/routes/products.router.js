const express = require("express");
const productService = require("../services/product.service");
const passport = require("passport");
const { authorization } = require("../middlewares/authorization");

const router = express.Router();

// GET /api/products  (público)
router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const result = await productService.listPaginated({ limit, page, sort, query });

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage
        ? `/api/products?limit=${result.limit}&page=${result.prevPage}`
        : null,
      nextLink: result.hasNextPage
        ? `/api/products?limit=${result.limit}&page=${result.nextPage}`
        : null
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ status: "error", error: error.message });
  }
});

// GET /api/products/:pid  (público)
router.get("/:pid", async (req, res) => {
  try {
    const product = await productService.getById(req.params.pid);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// POST /api/products  (solo ADMIN)
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  authorization("admin"),
  async (req, res) => {
    try {
      const nuevoProducto = await productService.createProduct(req.body);
      res.status(201).json(nuevoProducto);
    } catch (error) {
      console.error("Error al crear producto:", error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message });
    }
  }
);

// PUT /api/products/:pid  (solo ADMIN)
router.put(
  "/:pid",
  passport.authenticate("jwt", { session: false }),
  authorization("admin"),
  async (req, res) => {
    try {
      const actualizado = await productService.updateProduct(req.params.pid, req.body);
      res.json(actualizado);
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message });
    }
  }
);

// DELETE /api/products/:pid  (solo ADMIN)
router.delete(
  "/:pid",
  passport.authenticate("jwt", { session: false }),
  authorization("admin"),
  async (req, res) => {
    try {
      await productService.deleteProduct(req.params.pid);
      res.json({ mensaje: "Producto eliminado" });
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message });
    }
  }
);

module.exports = router;
