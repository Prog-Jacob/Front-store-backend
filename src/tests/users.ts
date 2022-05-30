import supertest from 'supertest';
import { UserStore, User } from '../modules/users';
import app from '../server';

export default function () {
    describe('Users:', () => {
        describe('Testing users modules:', () => {
            const store = new UserStore();

            it('Test 1: create should create one user.', async () => {
                const u: User = {
                    firstname: 'John',
                    lastname: 'Doe',
                    password: 'Password@1234.',
                };
                const result = await store.create(u);
                expect(result.firstname).toEqual('John');
            });

            it('Test 2: index should return all users.', async () => {
                const result = await store.index();
                expect(result[0].lastname).toEqual('Doe');
            });

            it('Test 3: authenticatePassword should return true after created.', async () => {
                const result = await store.authenticatePassword(
                    '1',
                    'Password@1234.'
                );
                expect(result).toBe(true);
            });

            it('Test 4: edit should return new user.', async () => {
                const u: User = {
                    firstname: 'John',
                    lastname: 'Doe',
                    password: 'password',
                };
                const result = await store.edit('1', u);
                expect(result.firstname).toBe('John');
            });

            it('Test 5: authenticatePassword should false after edited.', async () => {
                const result = await store.authenticatePassword(
                    '1',
                    'Password@1234.'
                );
                expect(result).toBe(false);
            });

            it('Test 6: show should return a certain user.', async () => {
                const result = await store.show('1');
                expect(result.password).not.toBe('password');
            });

            it('Test 7: delete should return a user after deletion.', async () => {
                const result = await store.delete('1');
                expect(result.lastname).toBe('Doe');
            });
        });

        describe('Testing users handlers:', () => {
            let token = '';
            const request = supertest(app);

            it('Test 1: users route with post method.', async () => {
                const response = await request
                    .post('/users')
                    .send({
                        firstname: 'John',
                        lastname: 'Doe',
                        password: 'Password@1234.',
                    })
                    .set('Accept', 'application/json');
                token = response.body;
                expect(response.status).toBe(200);
            });

            it('Test 2: users route with get method.', async () => {
                const response = await request
                    .get('/users')
                    .set('Authorization', `Bearer ${token}`);
                expect(response.status).toBe(200);
                expect(response.body[0].firstname).toEqual('John');
            });

            it('Test 3: users/:userid route with put method.', async () => {
                const response = await request
                    .put('/users/2')
                    .send({
                        firstname: 'John',
                        lastname: 'Doe',
                        password: 'password',
                    })
                    .set('Authorization', `Bearer ${token}`)
                    .set('Accept', 'application/json');
                expect(response.status).toBe(200);
                expect(response.body.lastname).toEqual('Doe');
            });

            it('Test 4: users/:userid route with get method.', async () => {
                const response = await request
                    .get('/users/2')
                    .set('Authorization', `Bearer ${token}`);
                expect(response.status).toBe(200);
                expect(response.body.password).not.toEqual('Password@1234.');
            });

            it('Test 5: users/:userid/auth route with get.', async () => {
                const response = await request
                    .get('/users/2/auth')
                    .send({ password: 'password' })
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${token}`);
                expect(response.status).toBe(200);
                expect(response.body.message).toEqual("You're logged in!");
            });

            it('Test 6: users/:userid with delete method.', async () => {
                const response = await request
                    .delete('/users/2')
                    .set('Authorization', `Bearer ${token}`);
                expect(response.status).toBe(200);
            });
        });
    });
}
