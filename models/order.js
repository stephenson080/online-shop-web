const {Schema, model} = require("mongoose")

const orderSchema = new Schema({
  products : [{
    product: {
      type: Object, required: true
    },
    quantity: {
      type: Number, required: true
    }
  }],
  user: {
    email: {type: String, required: true},
    userId: {type: Schema.Types.ObjectId, required: true, ref: "User"}
  }
})

module.exports = model("Order", orderSchema)
// const {DataTypes} = require("sequelize")
// const sequelize = require("../util/database")


// const Order = sequelize.define("order", {
//   id: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     primaryKey: true,
//     autoIncrement: true
//   }
// })

// module.exports = Order