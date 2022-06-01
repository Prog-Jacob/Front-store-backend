CREATE TABLE orders_products (
    order_id integer,
    product_id integer,
    quantity integer,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
    );