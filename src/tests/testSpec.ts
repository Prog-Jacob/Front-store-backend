import supertest from 'supertest';
import products from './products';
import server from './server';
import orders from './orders';
import users from './users';
import app from '../server';

describe('All tests:', async () => {
    server();
    users();
    products();
    orders();

    describe('MostPopularProducts on products/popular/:number route.', () => {
        const request = supertest(app);

        it('Test 1: returning one product.', async () => {
            const response = await request.get('/products/popular/1');
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(1);
        });
        it('Test 2: returning multiple products.', async () => {
            const response = await request.get('/products/popular/5');
            expect(response.status).toBe(200);
            expect(response.body.length).toBeGreaterThan(1);
            expect(response.body[0]).toEqual({
                productid: 3,
                name: 'Product',
                quantity: 4,
            });
        });
    });
});
