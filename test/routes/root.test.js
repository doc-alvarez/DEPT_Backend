"use strict";

const { test } = require("tap");
const { build } = require("../helper");

test("server root route returns 404 not found", async (t) => {
  const app = await build(t);
  const res = await app.inject({
    url: "/",
  });
  t.same(JSON.parse(res.payload), {
    statusCode: 404,
    error: "Not Found",
    message: "Not Found",
  });
});
