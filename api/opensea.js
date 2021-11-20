const axios = require("axios");
const Nft = require("../models/Nft.model");

async function getRandomNft() {
  const offSet = Math.floor(Math.random() * 5000)
  const reqUrl =
    `https://api.opensea.io/api/v1/assets?limit=1&order_direction=desc&limit=1&offset=${offSet}&order_by=sale_date`;
  const res = await axios.get(reqUrl);
  result = res.data.assets[0];
  const {
    image_url: imageUrl,
    name: name,
    token_id: tokenId,
    asset_contract: { address: assetAdress },
    collection: { description: collectionDescription },
    last_sale,
    last_sale: {
      total_price,
      event_timestamp,
      payment_token: { decimals, usd_price },
    },
  } = result;

  const timestamp = new Date(event_timestamp);
  const priceEth = total_price / Math.pow(10, decimals);
  const priceUsd = (priceEth * usd_price).toFixed(2);

  const existingNft = await Nft.findOne({ tokenId, assetAdress });
  if (existingNft !== null) {
    return existingNft;
  }

  return await Nft.create({
    name,
    imageUrl,
    tokenId,
    assetAdress,
    collectionDescription,
    lastSale: { timestamp, priceEth, priceUsd },
  });
}

module.exports = {getRandomNft};