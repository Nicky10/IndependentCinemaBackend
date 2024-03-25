const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const supertest = require('supertest');
const app = express();
let mongoServer;

// Set up a mock MongoDB server before running tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Close the mock MongoDB server after tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Actor Controller', () => {
  const request = supertest(app);

  it('should get all actors', async () => {
    const response = await request.get('/api/actors');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should create an actor', async () => {
    const newActor = { name: 'Actor Name', gender: 'Male', image: 'actor.jpg' };
    const response = await request.post('/api/actors').send(newActor);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe(newActor.name);
    expect(response.body.gender).toBe(newActor.gender);
    expect(response.body.image).toBe(newActor.image);
  });

  it('should get an actor by id', async () => {
    const existingActor = await request.post('/api/actors').send({
      name: 'Existing Actor',
      gender: 'Female',
      image: 'existing-actor.jpg',
    });

    const response = await request.get(`/api/actors/${existingActor.body._id}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe(existingActor.body.name);
    expect(response.body.gender).toBe(existingActor.body.gender);
    expect(response.body.image).toBe(existingActor.body.image);
  });

  it('should update an actor by id', async () => {
    const existingActor = await request.post('/api/actors').send({
      name: 'Existing Actor',
      gender: 'Female',
      image: 'existing-actor.jpg',
    });

    const updatedActor = { name: 'Updated Actor', gender: 'Male', image: 'updated-actor.jpg' };

    const response = await request
      .put(`/api/actors/${existingActor.body._id}`)
      .send(updatedActor);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updatedActor.name);
    expect(response.body.gender).toBe(updatedActor.gender);
    expect(response.body.image).toBe(updatedActor.image);
  });

  it('should delete an actor by id', async () => {
    const existingActor = await request.post('/api/actors').send({
      name: 'Existing Actor',
      gender: 'Female',
    });

    const response = await request.delete(`/api/actors/${existingActor.body._id}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Actor deleted successfully');
  });
});