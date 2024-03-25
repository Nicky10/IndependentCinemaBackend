const request = require('supertest');
const app = require('../index'); 

const Actor = require('../models/actor.model');

describe('Actor Controller Tests', () => {
  let actorId;

  beforeAll(async () => {
    const dbConfig = require('./config/database.config.js');
    const mongoose = require('mongoose');

    mongoose.Promise = global.Promise;


    mongoose.connect(dbConfig.url,{
        useNewUrlParser : true
    })
        .then(() => {
            console.log("Successfully connected to the database");
        }).catch(err => {
            console.log('It was not possible to connect to the datbase.', err);
            process.exit();
        });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should create a new actor', async () => {
    const response = await request(app)
      .post('/actors')
      .send({
        name: 'Test Actor',
        gender: 'Male',
        image: 'test.jpg',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('_id');
    actorId = response.body._id;
  });

  it('should get the created actor by ID', async () => {
    const response = await request(app).get(`/actors/${actorId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('name', 'Test Actor');
  });

  it('should update the created actor', async () => {
    const response = await request(app)
      .put(`/actors/${actorId}`)
      .send({
        name: 'Updated Actor',
        gender: 'Female',
        image: 'updated.jpg',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('name', 'Updated Actor');
  });

  it('should delete the created actor', async () => {
    const response = await request(app).delete(`/actors/${actorId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Actor deleted successfully');
  });
});
