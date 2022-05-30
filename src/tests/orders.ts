import supertest from 'supertest';
import { Order, OrderStore } from '../modules/orders';
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
                        firstname: 'Test',
                        lastname: 'User',
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
                const o: Order = {
                    userid: 3,
                    productid: 3,
                    quantity: 4,
                };
                const result = await store.create(o);

                await store.create(o);
                o.userid = 4;
                await store.create(o);
                o.productid = 4;
                await store.create(o);

                expect(result.status).toEqual('active');
            });

            it('Test 2: currentOrder should return all active orders for a user.', async () => {
                const result = await store.currentOrder('3');
                expect(result.length).not.toBeNull();
            });

            it('Test 3: complete should mark a certain order as complete.', async () => {
                const result = await store.complete('1');
                expect(result.status).toEqual('complete');
            });

            it('Test 4: completeOrder should return all completed orders for a user.', async () => {
                const result = await store.completeOrder('3');
                expect(result.length).not.toBeNull();
            });

            it('Test 5: index should return all orders.', async () => {
                const result = await store.index();
                expect(result[0].quantity).toEqual(4);
            });

            it('Test 6: show should return a certain order.', async () => {
                const result = await store.show('1');
                expect(result.quantity).toEqual(4);
            });

            it('Test 7: delete should delete a certain order.', async () => {
                const result = await store.delete('1');
                expect(result).toEqual({
                    id: 1,
                    userid: 3,
                    productid: 3,
                    quantity: 4,
                    status: 'complete',
                });
            });
        });

        describe('Testing orders handlers:', () => {
            it('Test 1: orders route with post method.', async () => {
                const response = await request.post('/orders').send({
                    userid: 3,
                    productid: 3,
                    quantity: 1,
                });
                expect(response.status).toEqual(200);
                expect(response.body.status).toEqual('active');
            });

            it('Test 2: orders/:userid/current route with get method.', async () => {
                const response = await request
                    .get('/orders/3/current')
                    .set('Authorization', `Bearer ${token}`);
                expect(response.status).toEqual(200);
                expect(response.body.length).not.toBeNull();
            });

            it('Test 3: orders/:id route with put method.', async () => {
                const response = await request.put('/orders/5');
                expect(response.status).toEqual(200);
                expect(response.body.status).toEqual('complete');
            });

            it('Test 4: orders/:userid/complete route with get method.', async () => {
                const response = await request
                    .get('/orders/3/complete')
                    .set('Authorization', `Bearer ${token}`);
                expect(response.status).toEqual(200);
                expect(response.body.length).not.toBeNull();
            });

            it('Test 5: orders route with get method.', async () => {
                const response = await request.get('/orders');
                expect(response.status).toEqual(200);
                expect(response.body.length).toBeGreaterThan(3);
            });

            it('Test 6: orders/:id route with get method.', async () => {
                const response = await request.get('/orders/5');
                expect(response.status).toEqual(200);
                expect(response.body.productid).toEqual(3);
            });

            it('Test 7: orders/:id route with delete method.', async () => {
                const response = await request.delete('/orders/5');
                expect(response.status).toEqual(200);
                expect(response.body).toEqual({
                    id: 5,
                    userid: 3,
                    productid: 3,
                    quantity: 1,
                    status: 'complete',
                });
            });
        });
    });
}
