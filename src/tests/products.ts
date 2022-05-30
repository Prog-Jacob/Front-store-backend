import supertest from 'supertest';
import { ProductStore, Product } from '../modules/products';
import app from '../server';

export default function () {
    describe('Products:', () => {
        describe('Testing products modules:', () => {
            const store = new ProductStore();

            it('Test 1: create should create one product.', async () => {
                const p: Product = {
                    name: 'Milk',
                    price: 50,
                    category: 'grocery',
                };
                const result = await store.create(p);
                expect(result.name).toEqual('Milk');
            });

            it('Test 2: index should return all products.', async () => {
                const result = await store.index();
                expect(result[0]).toEqual({
                    id: 1,
                    name: 'Milk',
                    price: 50,
                    category: 'grocery',
                });
            });

            it('Test 3: productsByCategory should return only grocery.', async () => {
                const result = await store.productsByCategory('grocery');
                expect(result[0].price).toEqual(50);
            });

            it('Test 4: edit should return new product.', async () => {
                const p: Product = {
                    name: 'Shampoo',
                    price: 100,
                    category: 'skin-care',
                };
                const result = await store.edit('1', p);
                expect(result.category).toBe('skin-care');
            });

            it('Test 6: show should return a certain product.', async () => {
                const result = await store.show('1');
                expect(result.name).toBe('Shampoo');
            });

            it('Test 7: delete should return a product after deletion.', async () => {
                const result = await store.delete('1');
                expect(result.price).toBe(100);
            });
        });

        describe('Testing products handlers:', () => {
            let token = '';
            const request = supertest(app);

            beforeAll(async () => {
                token = (
                    await request
                        .post('/users')
                        .send({
                            firstname: 'Test',
                            lastname: 'User',
                            password: 'password123',
                        })
                        .set('Accept', 'application/json')
                ).body;
            });

            it('Test 1: products route with post method.', async () => {
                const response = await request
                    .post('/products')
                    .send({
                        name: 'Product',
                        price: 100,
                        category: 'category',
                    })
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${token}`);
                expect(response.status).toBe(200);
                expect(response.body.name).toEqual('Product');
            });

            it('Test 2: products route with get method.', async () => {
                const response = await request.get('/products');
                expect(response.status).toBe(200);
                expect(response.body[0].name).toEqual('Product');
            });

            it('Test 3: products/category route with get method.', async () => {
                const response = await request.get(
                    '/products/category/category'
                );
                expect(response.status).toBe(200);
                expect(response.body[0].price).toEqual(100);
            });

            it('Test 4: products/:productid route with put method.', async () => {
                const response = await request
                    .put('/products/2')
                    .send({
                        name: 'new product',
                        price: 50,
                        category: 'category',
                    })
                    .set('Authorization', `Bearer ${token}`)
                    .set('Accept', 'application/json');
                expect(response.status).toBe(200);
                expect(response.body.category).toEqual('category');
            });

            it('Test 5: products/:productid route with get method.', async () => {
                const response = await request.get('/products/2');
                expect(response.status).toBe(200);
                expect(response.body.name).toEqual('new product');
            });

            it('Test 6: products/:productid route with delete method.', async () => {
                const response = await request
                    .delete('/products/2')
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${token}`);
                expect(response.status).toBe(200);
                expect(response.body.price).toEqual(50);
            });
        });
    });
}
