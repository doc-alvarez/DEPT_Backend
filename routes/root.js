"use strict";

module.exports = async function (fastify, opts) {
  fastify.get("/", async function (request, reply) {
    const { notFound } = fastify.httpErrors;
    throw notFound();
  });
};
