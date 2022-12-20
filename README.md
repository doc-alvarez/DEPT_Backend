## DEPT Backend Challenge

Stack used: Fastify and Redis.

## Project setup

### Start Redis server locally [More info](https://redis.io/docs/getting-started/installation/)

> :warning: **If you want to provide a remote redis server.**: Edit the REDIS_HOST enviroment variable on .env root file, with your Redis server URL..

### Ubuntu

> `curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg`
>
> `echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list`
>
> `sudo apt-get update` >`sudo apt-get install redis`
>
> `redis-server`

### macOS

> `brew install redis`
>
> `redis-server`

#

Your redis-server should be running on http://127.0.0.1:6379

## Available Scripts

In the project directory, you can run:

### `npm run dev`

To start the app in dev mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
You can set the PORT env for custom binding.

### `npm start`

For production mode

### `npm run test`

Run the test cases:

- Data format and schema.

###

- Add-favourite endpoint health check.

###

- Remove-favourite endpoint health check.

###

- Server root 404. Security check. No disclousure.

##API Documentation

###`GET http://localhost:PORT/spaceX/api/v1/$userId/launches`

> Query all Launches with Rocket data included, and returns an array of objects in application/json format.
> Launches will have an added attribute: isFavourite:Boolean - if the launch is included on the $userId favourite list persisted on redis db.

###`GET http://localhost:PORT/spaceX/api/v1/$userId/add/$flight_number`

> Adds a launch by its flight number attribute to the userId favourite list.

###`GET http://localhost:PORT/spaceX/api/v1/$userId/remove/$flight_number`

> Removes a favourite launch by its flight number attribute from the userId favourite list.

## Learn More

[Fastify documentation](https://www.fastify.io/docs/latest/).
[Redis documentation](https://redis.io/docs/)
