const request = require("supertest");
const app = require("../app");

describe("Error handling", () => {
    test("404: responds with 'Endpoint not found' for undefined routes", () => {
      return request(app)
        .get("/api/nonexistent-endpoint")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual("Endpoint not found");
        });
    });
  });