import supertest from 'supertest';
import app from '../server';

export default function () {
    describe('Testing the server home launch:', () => {
        const request = supertest(app);

        it('Test 1: should return a 200 status code.', async () => {
            const response = await request.get('/');
            expect(response.status).toBe(200);
        });
        it('Test 2: should return a welcome message.', async () => {
            const response = await request.get('/');
            expect(response.body.message).toEqual('Welcome to the API');
        });
    });
}
