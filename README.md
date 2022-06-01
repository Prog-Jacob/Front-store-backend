---
## About

> ### That's a REST API as the backend for a front store that's inclusive to users, products, and orders minor interactions. It mainly can add, edit, delete, and show users/products/orders to and from the database. There's some extended functionality in each section of them represented precisely in the REQUIREMENTS.md file.


This node project is written and transpiled by TypeScript. Eslint was used for linting, Prettier was used for formatting, Jasmine and supertest with jasmine-spec-reporter were used for testing, and Express with nodemon were used for the server. Finally, there are some other used technologies like db-migrate, pg, jwt, bcrypt, you can look for at the dependencies in the package.json file.

## Scripts

> -   `npm run lint` - For linting using Eslint.
> -   `npm run build` - For trans-piling using TS.
> -   `npm run jasmine` - For setting up all tests with db-migrate and running with Jasmine.
> -   `npm run test` - For building and testing at the same time.
> -   `npm run format` - For formatting using Prettier.
> -   `npm run start` - For starting the Express server and track using nodemon.
> -   `npm run watch` - For watching any changes, building, and running server.

_**Note:** If you your OS is different than windows, consider checking `SET ENV=test`, and make the required changes._

---
## Documentation

#### To use the API:

Through the URL http://HOST:PORT/. From there, we can GET/POST/PUT/DELETE any request we want, but first to set up the project.

    Set up packages: Run <npm install> to install all the packages.

    Set up db-migrate: Run <npm i -g db-migrate> to have access to db-migrate commands.

    Set up database: Connect to postgres <psql -U postgres>.
        - Then, create two databases: one for development and one for testing e.g. <CREATE DATABASE db_name;>.
        - Then, create a user for the database e.g. <CREATE USER user_name WITH PASSWORD 'password';>.
        - Then, grant the user to both databases e.g. <GRANT ALL PRIVILEGES ON DATABASE db_name TO user_name;>.

    Set up env: See the dotenv variables in the next section.

    Launch database: Run `db-migrate up` to create the tables.

### Dotenv Variables:

This is the list for all the variables used in this project. You can copy them in a dotenv file with your own values for use:

> -   ENV
>     >   `test` - For testing.
>     >   `dev` - For development.

> -   PORT
> -   HOST

> -   POSTGRES_HOST
> -   POSTGRES_PORT
>     >   `5432` - By default.
> -   POSTGRES_DB
> -   POSTGRES_DB_TEST
> -   POSTGRES_USER
> -   POSTGRES_PASSWORD

> -   PEPPER
> -   SALT_ROUNDS

> -   JWT_AUTH_TOKEN

<h3 align="center">
  Thank you!
</h3>

---
