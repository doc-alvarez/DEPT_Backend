"use strict";
const buildMergedArray = require("../../../../utils/helpers.js");

module.exports = async function (fastify, opts) {
  const redis = fastify.redis.client;
  fastify.get("/:userId/launches", async function (request, reply) {
    const userId = request.params.userId;
    try {
      //parallel fetch of remote spaceX endpoints and favourites persisted data
      const [streamLaunches, streamRockets, favouritesArray] =
        await Promise.all([
          fetch("https://api.spacexdata.com/v3/launches"),
          fetch("https://api.spacexdata.com/v3/rockets"),
          redis.smembers(`${userId}:favs`),
        ]);
      const [dataLaunches, dataRockets] = await Promise.all([
        streamLaunches.json(),
        streamRockets.json(),
      ]);
      const mergedArray = buildMergedArray(
        dataLaunches,
        dataRockets,
        favouritesArray
      );
      return mergedArray;
    } catch (error) {
      //any unexpected throw in route handler will result in 500 status.
      throw error;
    }
  });
  fastify.get("/:userId/addFav/:flightId", async function (request, reply) {
    const userId = request.params.userId;
    try {
      return await redis.sadd(`${userId}:favs`, `${request.params.flightId}`);
    } catch (error) {
      throw error;
    }
  });
  fastify.get("/:userId/removeFav/:flightId", async function (request, reply) {
    const userId = request.params.userId;
    try {
      return await redis.srem(`${userId}:favs`, `${request.params.flightId}`);
    } catch (error) {
      throw error;
    }
  });
};
