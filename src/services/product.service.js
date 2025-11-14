const productRepository = require("../repositories/product.repository");

class ProductService {
  async listPaginated({ limit, page, sort, query }) {
    const limitNum = parseInt(limit) || 10;
    const pageNum = parseInt(page) || 1;

    const filtro = {};
    if (query) {
      if (query === "disponibles") filtro.status = true;
      else filtro.categoria = query;
    }

    const options = {
      limit: limitNum,
      page: pageNum,
      sort: sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {}
    };

    // usamos paginate del DAO
    const result = await productRepository.getPaginated(filtro, options);
    return result;
  }

  async getById(id) {
    return await productRepository.getBy({ _id: id });
  }

  async createProduct(data) {
    const { title, description, code, price, status, stock, categoria, thumbnails } = data;

    if (!title || !description || !code || price == null || stock == null || !categoria) {
      const error = new Error(
        "Faltan campos obligatorios: title, description, code, price, stock, categoria"
      );
      error.statusCode = 400;
      throw error;
    }

    return await productRepository.create({
      title,
      description,
      code,
      price,
      status: status ?? true,
      stock,
      categoria,
      thumbnails: thumbnails ?? []
    });
  }

  async updateProduct(id, updates) {
    const updated = await productRepository.update(id, updates);
    if (!updated) {
      const error = new Error("Producto no encontrado");
      error.statusCode = 404;
      throw error;
    }
    return updated;
  }

  async deleteProduct(id) {
    const deleted = await productRepository.delete(id);
    if (!deleted) {
      const error = new Error("Producto no encontrado");
      error.statusCode = 404;
      throw error;
    }
    return deleted;
  }
}

const productService = new ProductService();
module.exports = productService;
