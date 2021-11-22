const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const nftSchema = new Schema(
  {
    name: String,
    imageUrl: String,
    tokenId: String,
    assetAdress: String,
    collectionDescription: String,
    collectionUrl: String,
    lastSale: {
      timestamp: Date,
      priceEth: Number,
      priceUsd: Number,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Nft = model("Nft", nftSchema);

module.exports = Nft;
