const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    password: String,
    nfts: [{ type: Schema.Types.ObjectId, ref: "Nft" }],
    collectionName: { type: String, default: "The unknown" },
    collectionDescription: {
      type: String,
      default:
        "This unique and hand-picked collection of NFT art represents not only immense value but also shows the curator's exquisite taste in arts. In this exhibition, the artists bring the viewer face to face with their own preconceived hierarchy of cultural values and assumptions of artistic worth.",
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
