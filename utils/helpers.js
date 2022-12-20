function buildMergedArray(launchesData, rocketData, favouritesArray) {
  const mergedArray = launchesData.map((launchObject) => {
    const rocketId = launchObject.rocket.rocket_id;
    let {
      flight_number,
      mission_name,
      details,
      links: { mission_patch },
      rocket,
    } = launchObject;
    rocketData.forEach((__rocket) => {
      if (rocket.rocket_id === rocketId) {
        let { active, cost_per_launch, company } = __rocket;
        let { rocket_name } = rocket;
        rocket = {
          rocket_name,
          rocket_id: rocketId,
          active,
          cost_per_launch,
          company,
        };
      }
    });
    return {
      flight_number,
      mission_patch: mission_patch || "",
      details: details || "",
      rocket,
      mission_name,
      isFavourite: favouritesArray.includes(String(flight_number)),
    };
  });
  return mergedArray;
}

module.exports = buildMergedArray;
