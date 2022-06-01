import supertest from 'supertest';
import { OrderStore } from '../modules/orders';
import app from '../server';

export default function () {
    describe('Orders:', () => {
        let token = '';
        const request = supertest(app);

        beforeAll(async () => {
            token = (
                await request
                    .post('/users')
                    .send({
                        first_name: 'Test',
                        last_name: 'User',
                        password: 'password123',
                    })
                    .set('Accept', 'application/json')
            ).body;
            for (let i = 0; i < 2; i++) {
                await request
                    .post('/products')
                    .send({
                        name: 'Product',
                        price: 100,
                        category: 'category',
                    })
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${token}`);
            }
        });

        describe('Testing orders modules:', () => {
            const store = new OrderStore();

            it('Test 1: create should create one order.', async () => {
                const result = await store.create('3');

                await store.create('3');
                await store.create('4');

                expect(result.status).toEqual('active');
            });

            it('Test 2: addProducts should add all products and quantities.', async () => {
                const products = {
                    product_id: ['3', '4'],
                    quantity: ['5', '3'],
                };
                const result = await store.addProducts('1', products);

                await store.addProducts('2', products);
                products.product_id = ['3'];
                products.quantity = ['7'];
                await store.addProducts('3', products);

                expect(result).toEqual('All products added successfully.');
            });

            it('Test 3: activeOrder should return all active orders for a user.', async () => {
                const result = await store.activeOrder('3');

                expect(result.length).not.toBeNull();
            });

            it('Test 4: complete should mark a certain order as complete.', async () => {
                const result = await store.complete('1');
                expect(result.status).toEqual('complete');
            });

            it('Test 5: completeOrder should return all completed orders for a user.', async () => {
                const result = await store.completeOrder('3');

                expect(result.length).not.toBeNull();
            });

            it('Test 6: index should return all orders of a user.', async () => {
                const result = await store.index('3');

                expect(result[0].quantity).toEqual(5);
            });

            it('Test 7: show should return a certain order.', async () => {
                const result = await store.show('1');
                expect(result[0].quantity).toEqual(5);
            });

            it('Test 8: delete should delete a certain order.', async () => {
                const result = await store.delete('1');
                expect(result.user_id).toEqual(3);
            });
        });

        describe('Testing orders handlers:', () => {
            it('Test 1: orders/:userId route with post method.', async () => {
                const response = await request
                    .post('/orders/3')
                    .set('Authorization', `Bearer ${token}`);
                expect(response.status).toEqual(200);
                expect(response.body.status).toEqual('active');
            });
            it('Test 2: orders/:orderId/add route with post method.', async () => {
                const response = await request
                    .post('/orders/4/add')
                    .send({
                        product_id: ['3', '4'],
                        quantity: ['5', '3'],
                    })
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${token}`);
                expect(response.status).toEqual(200);
                expect(response.body).toEqual(
                    'All products added successfully.'
                );
            });

            it('Test 3: orders/:userId/active route with get method.', async () => {
                const response = await request
                    .get('/orders/3/active')
                    .set('Authorization', `Bearer ${token}`);
                expect(response.status).toEqual(200);
                expect(response.body.length).not.toBeNull();
            });

            it('Test 4: orders/:id route with put method.', async () => {
                const response = await request
                    .put('/orders/4')
                    .set('Authorization', `Bearer ${token}`);
                expect(response.status).toEqual(200);
                expect(response.body.status).toEqual('complete');
            });

            it('Test 5: orders/:userId/complete route with get method.', async () => {
                const response = await request
                    .get('/orders/3/complete')
                    .set('Authorization', `Bearer ${token}`);
                expect(response.status).toEqual(200);
                expect(response.body.length).not.toBeNull();
            });

            it('Test 6: orders/:userId route with get method.', async () => {
                const response = await request
                    .get('/orders/3')
                    .set('Authorization', `Bearer ${token}`);
                expect(response.status).toEqual(200);
                expect(response.body.length).toBeGreaterThanOrEqual(2);
            });

            it('Test 7: orders/:orderId/show route with get method.', async () => {
                const response = await request
                    .get('/orders/4/show')
                    .set('Authorization', `Bearer ${token}`);
                expect(response.status).toEqual(200);
                expect(response.body[0].product_id).toEqual(3);
            });

            it('Test 8: orders/:orderId route with delete method.', async () => {
                const response = await request
                    .delete('/orders/4')
                    .set('Authorization', `Bearer ${token}`);
                expect(response.status).toEqual(200);
                expect(response.body).toEqual({
                    id: 4,
                    user_id: 3,
                    status: 'complete',
                });
            });
        });
    });
}
