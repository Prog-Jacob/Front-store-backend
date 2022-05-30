CREATE TABLE orders(
  id SeriAL PRIMARY KEY,
  userid integer,
  productid integer,
  quantity integer,
  status varchar(20),
  FOREIGN KEY (userid) REFERENCES users(id),
  FOREIGN KEY (productid) REFERENCES products(id)
);