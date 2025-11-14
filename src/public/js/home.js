document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".add-to-cart-btn");
  
  buttons.forEach(button => {
    button.addEventListener("click", async () => {
      const productId = button.getAttribute("data-id");
      const cartId = localStorage.getItem("cartId") || null;

      if (!cartId) {
        const res = await fetch("/api/carts", { method: "POST" });
        const data = await res.json();
        localStorage.setItem("cartId", data._id);
      }

      const res = await fetch(`/api/carts/${localStorage.getItem("cartId")}/products/${productId}`, {
        method: "POST"                 
      });

      if (res.ok) {
        alert("Producto agregado al carrito");
      } else {
        alert("Error al agregar producto");
      }
    });
  });
});
