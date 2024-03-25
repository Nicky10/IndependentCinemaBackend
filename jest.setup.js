const { MongoMemoryServer } = require('mongodb-memory-server');

// Set up a mock MongoDB server before running tests
global.beforeAll(async () => {
  global.mongoServer = await MongoMemoryServer.create();
  global.mongoUri = global.mongoServer.getUri();
});

// Close the mock MongoDB server after tests
global.afterAll(async () => {
  await global.mongoServer.stop();
});
