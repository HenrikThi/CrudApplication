const axios = require("axios");
const Nft = require("../models/Nft.model");

let fetchedNftsQueue = [];

async function fetchNfts() {
  const offSet = Math.floor(Math.random() * 1000);
  const reqUrl = `https://api.opensea.io/api/v1/assets?order_direction=desc&limit=10&offset=${offSet}&order_by=sale_date`;
  const result = (await axios.get(reqUrl)).data.assets;
  fetchedNftsQueue.push(...result);
}

async function getRandomNft() {
  if(fetchedNftsQueue.length === 0){
    await fetchNfts();
  } else if (fetchedNftsQueue.length < 5) {
    fetchNfts();
  }

  result = fetchedNftsQueue.shift();
  const {
    image_url: imageUrl,
    name: name,
    token_id: tokenId,
    asset_contract: { address: assetAdress },
    collection: {
      description: collectionDescription,
      external_url: collectionUrl,
    },
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
    collectionUrl,
    lastSale: { timestamp, priceEth, priceUsd },
  });
}

module.exports = { getRandomNft };
