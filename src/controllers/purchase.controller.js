const PurchaseService = require("../services/purchase.service");
const { TicketDTO } = require("../dtos/ticket.dto");

const purchaseCartController = async (req, res) => {
  try {
    const { cid } = req.params;
    const purchaserEmail = req.user.email; 

    const result = await PurchaseService.purchaseCart(cid, purchaserEmail);

    if (result.error === "CART_NOT_FOUND") {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    
    if (!result.ticket) {
      return res.status(400).json({
        status: "error",
        message:
          "No se pudo generar la compra. Todos los productos tienen stock insuficiente o ya no existen.",
        productsWithoutStock: result.productsWithoutStock,
      });
    }

    
    const compraParcial = result.productsWithoutStock.length > 0;

    return res.status(200).json({
      status: "success",
      message: compraParcial
        ? "Compra parcial realizada. Algunos productos quedaron sin stock."
        : "Compra completa realizada con éxito.",
      ticket: new TicketDTO(result.ticket), 
      totalAmount: result.totalAmount,
      productsPurchased: result.productsPurchased,
      productsWithoutStock: result.productsWithoutStock,
    });
  } catch (error) {
    console.error("Error en purchaseCartController:", error);
    return res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
    });
  }
};

module.exports = {
  purchaseCartController,
};
