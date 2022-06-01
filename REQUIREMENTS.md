## API Endpoints

#### Products

-   index => GET /products
-   Show => GET /products/:id
-   Create [token required] => POST /products
-   Edit [token required] => PUT /products/:id
-   Delete [token required] => DELETE /products/:id
-   Products by category (args: product category) => GET /products/category/:category
-   Most popular products (args: any positive integer) => GET /products/popular/:number

#### Users

-   Index [token required] => GET /users
-   Show [token required] => GET /users/:id
-   Create N[token required] => POST /users
-   Validate Password [token required] => GET /users/:id/auth
-   Edit [token required] => PUT /users/:id
-   Delete [token required] => DELETE /users/:id

#### Orders

[token required] For THEM ALL:

-   Index => GET /orders/:userId
-   Show => GET /orders/:orderId/show
-   Create => POST /orders/:userId
-   Add Products => POST /orders/:orderId/add
-   Edit => PUT /orders/:orderId
-   Delete => DELETE /orders/:orderId
-   Active Order by user (args: user id) => GET /orders/:userId/active
-   Completed Orders by user (args: user id) => GET /orders/:userId/complete

## Data Shapes

#### Products

  Column  |          Type          |
----------+------------------------+
 id       | integer                |
 name     | character varying(100) |
 price    | integer                |
 category | character varying(50)  |

#### Users

   Column   |          Type          |
------------+------------------------+
 id         | integer                |
 first_name | character varying(100) |
 last_name  | character varying(100) |
 password   | character varying(255) |

#### Orders

 Column  |         Type          |
---------+-----------------------+
 id      | integer               |
 user_id | integer               |
 status  | character varying(20) |

#### Orders_Products

   Column   |  Type   |
------------+---------+
 order_id   | integer |
 product_id | integer |
 quantity   | integer |