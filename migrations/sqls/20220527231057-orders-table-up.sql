CREATE TABLE orders(
  id SeriAL PRIMARY KEY,
  user_id integer,
  status varchar(20),
  FOREIGN KEY (user_id) REFERENCES users(id)
);