const endpointsJson = require("../endpoints.json");
const app = require("../app")
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const request = require("supertest");

beforeEach(() => seed(data));

afterAll(() => db.end());

describe("GET /api", () => {
  test("200: serves up a json representation of all the available endpoints of the api", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe('GET /api/topics', () => {
  test('200: serves an array of all topics', () => {
    return request(app)
    .get('/api/topics')
    .expect(200)
    .then(({body}) => {
      const { topics } = body;
      expect(Array.isArray(topics)).toBe(true);
      topics.forEach((topic) => {
        expect(topic).toEqual(
          expect.objectContaining({
            slug: expect.any(String),
            description: expect.any(String),
          })
        );
      });
      });
    });
  });