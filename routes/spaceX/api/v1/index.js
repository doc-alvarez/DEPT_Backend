"use strict";
const buildMergedArray = require("../../../../utils/helpers.js");

module.exports = async function (fastify, opts) {
  const redis = fastify.redis.client;

  //GET Launches endpoint
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
    const flightId = request.params.flightId;
    if (Number(flightId) && Number(flightId) > 0) {
      try {
        await redis.sadd(`${userId}:favourites`, `${flightId}`);
        return {
          status: 200,
          message: "Favourite added",
        };
      } catch (error) {
        reply.statusCode = 500;
        return {
          status: 500,
          message: "We had a problem adding your favourite launch",
        };
      }
    } else {
      reply.statusCode = 400;
      return {
        status: 400,
        message: "Flight id is required and should be a positive number",
      };
    }
  });

  //Remove Favourite endpoint
  fastify.get("/:userId/remove/:flightId", async function (request, reply) {
    const userId = request.params.userId;
    const flightId = request.params.flightId;
    if (Number(flightId) && Number(flightId) > 0) {
      try {
        await redis.srem(`${userId}:favourites`, `${request.params.flightId}`);
        return {
          status: 200,
          message: "Favourite removed",
        };
      } catch (error) {
        reply.statusCode = 500;
        return {
          status: 500,
          message: "We had a problem removing your favourite launch",
        };
      }
    } else {
      reply.statusCode = 400;
      return {
        status: 400,
        message: "Flight id is required and should be a positive number",
      };
    }
  });
};
