const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const GameSchema = new mongoose.Schema(
  {
    gameId: {
      type: mongoose.Types.ObjectId,
    },
    // players: {
    //   type: [usersModel],
    // },
    // deck: {
    //   type: String,
    // },
    // rounds: {
    //   type: String,
    // },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

GameSchema.plugin(mongooseDelete, { overrideMethods: "all" });
module.exports = mongoose.model("games", GameSchema);
