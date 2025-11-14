class TicketDTO {
  constructor(ticket) {
    this.code = ticket.code;
    this.amount = ticket.amount;
    this.purchaser = ticket.purchaser;
    this.purchase_datetime = ticket.purchase_datetime;
  }
}

module.exports = { TicketDTO };