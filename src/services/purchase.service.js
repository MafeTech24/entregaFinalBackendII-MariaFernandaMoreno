const CartManager = require("../dao/mongo/cart.dao");
const ProductsManager = require("../dao/mongo/product.dao");
const TicketDAO = require("../dao/mongo/ticket.dao");

const productManager = new ProductsManager();

class PurchaseService {
  async purchaseCart(cartId, purchaserEmail) {
    // Obtener carrito
    const cart = await CartManager.getCartById(cartId);
    if (!cart) {
      return { error: "CART_NOT_FOUND" };
    }

    const productsInCart = cart.products || [];

    let totalAmount = 0;
    const productsWithoutStock = [];
    const productsPurchased = [];

    //  Validar stock producto por producto
    for (const item of productsInCart) {
      const productDoc = item.product; 
      const quantity = item.quantity;

      if (!productDoc) {
        productsWithoutStock.push({
          product: null,
          quantity,
          reason: "PRODUCT_NOT_FOUND",
        });
        continue;
      }

      const currentStock = productDoc.stock;
      if (currentStock >= quantity) {
        // hay stock suficiente → restar stock
        const newStock = currentStock - quantity;

        await productManager.updateProduct(productDoc._id, {
          stock: newStock,
        });

        totalAmount += productDoc.price * quantity;

        productsPurchased.push({
          product: productDoc._id,
          title: productDoc.title,
          quantity,
          price: productDoc.price,
        });
      } else {
        // no alcanza el stock → queda en el carrito
        productsWithoutStock.push({
          product: productDoc._id,
          title: productDoc.title,
          quantity,
          reason: "INSUFFICIENT_STOCK",
        });
      }
    }

    //  Actualizar carrito:
    if (productsWithoutStock.length > 0) {
      const newCartProducts = productsWithoutStock
        .filter((p) => p.product) // descarto los que no tienen productId
        .map((p) => ({
          product: p.product,
          quantity: p.quantity,
        }));

      await CartManager.updateCartProducts(cartId, newCartProducts);
    } else {
      await CartManager.clearCart(cartId);
    }

    // 4. Crear ticket solo si hay monto
    let ticket = null;
    if (totalAmount > 0) {
      ticket = await TicketDAO.createTicket({
        amount: totalAmount,
        purchaser: purchaserEmail,
      });
    }

    return {
      ticket,
      totalAmount,
      productsPurchased,
      productsWithoutStock,
    };
  }
}

module.exports = new PurchaseService();
