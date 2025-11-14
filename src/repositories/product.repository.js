const ProductsManager = require("../dao/mongo/product.dao");

class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getPaginated(filtro, options) {
    return this.dao.getPaginated(filtro, options);
  }

  getAll() {
    return this.dao.getProducts();
  }

  getBy(filter) {
    return this.dao.getProductBy(filter);
  }

  create(data) {
    return this.dao.createProduct(data);
  }

  update(id, data) {
    return this.dao.updateProduct(id, data);
  }

  delete(id) {
    return this.dao.deleteProduct(id);
  }
}


const productRepository = new ProductRepository(new ProductsManager());
module.exports = productRepository;
