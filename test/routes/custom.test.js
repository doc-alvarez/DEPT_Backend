"use strict";

const { test } = require("tap");
const { build } = require("../helper");

test("launches route return json", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/spaceX/api/v1/001/launches",
  });
  t.equal(res.statusCode, 200);
  t.equal(res.headers["content-type"], "application/json; charset=utf-8");
});

test("launches route return correct data attributes by challenge request", async (t) => {
  const app = await build(t);

  const res = await app.inject({
    url: "/spaceX/api/v1/001/launches",
  });
  //get the first launch object as the pattern to test.
  const { rocket: rocketAttributes, ...launchAttributes } = JSON.parse(
    res.body
  )[0];
  const attributes = [
    ...Object.keys(launchAttributes),
    ...Object.keys(rocketAttributes),
  ];
  //Stringify objects to assert correctly.
  t.equal(
    JSON.stringify(attributes),
    JSON.stringify([
      "flight_number",
      "mission_patch",
      "details",
      "mission_name",
      "isFavourite",
      "rocket_name",
      "rocket_id",
      "active",
      "cost_per_launch",
      "company",
    ])
  );
});

test("add favourite health check", async (t) => {
  const app = await build(t);
  try {
    const res = await app.inject({
      url: "/spaceX/api/v1/001/add/1",
    });
    t.equal(res.statusCode, 200, "add route is healthy");
  } catch (err) {
    t.error(err);
  }
});

test("remove favourite health check", async (t) => {
  const app = await build(t);

  try {
    const res = await app.inject({
      url: "/spaceX/api/v1/001/remove/1",
    });
    t.equal(res.statusCode, 200, "remove route is healthy");
  } catch (err) {
    t.error(err);
  }
});
