const TicketModel = require("../models/ticketModel");
const { v4: uuidv4 } = require("uuid"); // npm i uuid

class TicketDAO {
  async createTicket({ amount, purchaser }) {
    const ticketData = {
      code: uuidv4(),           // código único
      amount,
      purchaser,
      purchase_datetime: new Date(),
    };

    const ticket = await TicketModel.create(ticketData);
    return ticket;
  }
}

module.exports = new TicketDAO();
