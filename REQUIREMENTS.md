## API Endpoints

#### Products

-   index => GET /products
-   Show => GET /products/:id
-   Create [token required] => POST /products
-   Edit [token required] => PUT /products/:id
-   Delete [token required] => DELETE /products/:id
-   Products by category (args: product category) => GET /products/category/:category
-   Most popular products (args: any positive integer) => GET /products/popular/:count

#### Users

-   Index [token required] => GET /users
-   Show [token required] => GET /users/:id
-   Create N[token required] => POST /users
-   Validate Password [token required] => GET /users/:id/auth
-   Edit [token required] => PUT /users/:id
-   Delete [token required] => DELETE /users/:id

#### Orders

-   Index => GET /orders
-   Show => GET /orders/:id
-   Create => POST /orders
-   Edit => PUT /orders/:id
-   Delete => DELETE /orders/:id
-   Current Order by user (args: user id)[token required] => GET /orders/:id/current
-   Completed Orders by user (args: user id)[token required] => GET /orders/:id/complete

## Data Shapes

#### Product

-   id
-   name
-   price
-   category

#### User

-   id
-   firstName
-   lastName
-   password

#### Orders

-   id
-   user_id REFERENCES users(id)
-   product_id REFERENCES products(id)
-   quantity of product in the order
-   status of order (active or complete)
