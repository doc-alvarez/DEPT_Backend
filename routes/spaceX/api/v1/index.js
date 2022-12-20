"use strict";
const buildMergedArray = require("../../../../utils/helpers.js");
const got = require("got");

const LAUNCHES_SERVICE = "https://api.spacexdata.com/v3/launches";
const ROCKETS_SERVICE = "https://api.spacexdata.com/v3/rockets";

module.exports = async function (fastify, opts) {
  const redis = fastify.redis.client;

  //GET Launches endpoint
  fastify.get("/:userId/launches", async function (request, reply) {
    const userId = request.params.userId;
    try {
      //parallel fetch of remote spaceX endpoints and favourites persisted data
      const [dataLaunches, dataRockets, favouritesArray] = await Promise.all([
        await got(LAUNCHES_SERVICE).json(),
        await got(ROCKETS_SERVICE).json(),
        redis.smembers(`${userId}:favourites`),
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
        const result = await redis.sadd(`${userId}:favourites`, `${flightId}`);
        if (result === 1) {
          return {
            status: 200,
            message: "Favourite added",
          };
        } else {
          return {
            status: 200,
            message: "Favourite already added to the list",
          };
        }
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
        const result = await redis.srem(
          `${userId}:favourites`,
          `${request.params.flightId}`
        );
        if (result === 1) {
          return {
            status: 200,
            message: "Favourite removed",
          };
        } else {
          return {
            status: 200,
            message: "Favourite already removed",
          };
        }
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
