const app = require("../app")
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const request = require("supertest");

beforeEach(() => seed(data));

afterAll(() => db.end());

describe("Error handling", () => {
    test("400: responds with 'Bad request' if passed an invalid article ID", () => {
      return request(app)
        .get("/api/articles/not-an-id")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toEqual("Bad request");
        });
    });
    test("404: responds with error message if passed a valid article ID that does not exist in the database", () => {
      return request(app)
        .get("/api/articles/9999")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toEqual("Article ID not found");
        });
    }); 
  });