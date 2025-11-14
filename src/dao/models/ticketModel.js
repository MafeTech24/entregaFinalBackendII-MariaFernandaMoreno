const mongoose = require("mongoose");

const ticketCollection = "tickets";

const ticketSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      required: true,
    },
    purchase_datetime: {
      type: Date,
      default: Date.now,
    },
    amount: {
      type: Number,
      required: true,
    },
    purchaser: {
      type: String, // email del usuario
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

const TicketModel = mongoose.model(ticketCollection, ticketSchema);

module.exports = TicketModel;
