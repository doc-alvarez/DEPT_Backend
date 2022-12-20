"use strict";
const buildMergedArray = require("../../../../utils/helpers.js");

module.exports = async function (fastify, opts) {
  const redis = fastify.redis.client;

  //Get Launches endpoint
  fastify.get("/:userId/launches", async function (request, reply) {
    const userId = request.params.userId;
    try {
      //parallel fetch of remote spaceX endpoints and favourites persisted data
      const [streamLaunches, streamRockets, favouritesArray] =
        await Promise.all([
          fetch("https://api.spacexdata.com/v3/launches"),
          fetch("https://api.spacexdata.com/v3/rockets"),
          redis.smembers(`${userId}:favourites`),
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

  //Add Favourite endpoint
  fastify.get("/:userId/add/:flightId", async function (request, reply) {
    const userId = request.params.userId;
    try {
      const result = await redis.sadd(
        `${userId}:favourites`,
        `${request.params.flightId}`
      );
      if (result === 1) {
        return {
          status: 200,
          message: "Favourite added",
        };
      }
    } catch (error) {
      throw error;
    }
  });

  //Remove Favourite endpoint
  fastify.get("/:userId/remove/:flightId", async function (request, reply) {
    const userId = request.params.userId;
    try {
      const result = await redis.srem(
        `${userId}:favourites`,
        `${request.params.flightId}`
      );
      if (result === 1) {
        return {
          status: 200,
          message: "Favourite removed",
        };
      }
    } catch (error) {
      throw error;
    }
  });
};
