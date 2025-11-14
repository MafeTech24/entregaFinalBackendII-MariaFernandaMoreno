const express = require("express");
const ProductsManager = require("../dao/mongo/product.dao");
const productManager = new ProductsManager();

const router = express.Router();

router.get("/", async (req, res) => {
  const { limit = 10, page = 1, query, sort } = req.query;

  try {
    const filtro = {};
    if (query) {
      if (query === "disponibles") filtro.status = true;
      else filtro.categoria = query;
    }

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {}
    };

    const result = await productManager.getPaginated(filtro, {
      ...options,
      lean: true
    });

    res.render("home", {
      products: result.docs,
      totalPages: result.totalPages,
      currentPage: result.page,
      page: result.page,          
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      limit: result.limit,
      query,
      sort
    });
  } catch (error) {
    console.error("Error al renderizar home:", error);
    res.status(500).send("Error interno del servidor");
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("realTimeProducts", { products });
  } catch (error) {
    console.error("Error en realtimeproducts:", error);
    res.status(500).send("Error interno del servidor");
  }
});

module.exports = router;
