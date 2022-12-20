"use strict";

const fp = require("fastify-plugin");

/**
 * This Plugin is used to scope the redis database to the whole app.
 *
 * @see https://github.com/fastify/fastify-ioredis
 */
module.exports = fp(async function (fastify, opts) {
  fastify.register(
    require("fastify-ioredis"),
    {
      host: "127.0.0.1",
    },
    (err) => {
      if (err) throw err;
    }
  );
});
