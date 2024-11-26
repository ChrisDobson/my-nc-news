const endpointsJson = require("../endpoints.json");
const app = require("../app")
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const request = require("supertest");
require("jest-sorted");

beforeEach(() => seed(data));

afterAll(() => db.end());

//TASK 2
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

//TASK 3
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

//TASK 4
describe('GET /api/articles/:article_id', () => {
  test('200: serves the correct article object when valid article_id provided', () => {
      return request(app)
      .get('/api/articles/2')
      .expect(200)
      .then(({ body }) => {
          expect(body.article).toEqual(
            expect.objectContaining({
              author: "icellusedkars",
              title: "Sony Vaio; or, The Laptop",
              article_id: 2,
              body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
              topic: "mitch",
              created_at: "2020-10-16T05:03:00.000Z",
              votes: 0,
              article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
            })
          );
        });
        });
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

//TASK 5
describe('GET /api/articles', () => {
  test('200: serves an array of all articles', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({body}) => {
        const { articles } = body;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            })
          );
          expect(article.body).toBeUndefined();
        });
        });
      });
    });

//TASK 6
describe('GET /api/:article_id/comments', () => {
  test('200: serves an array of all comments for the given article_id', () => {
    return request(app)
    .get('/api/articles/3/comments')
    .expect(200)
    .then(({ body }) => {
      const { comments } = body;
      expect(Array.isArray(comments)).toBe(true);
      comments.forEach((comment) => {
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 3
          })
        );
      });
      });
    });
    test("404: responds with error message if passed a valid article ID that does not have any comments", () => {
      return request(app)
    .get('/api/articles/2/comments')
    .expect(404)
    .then(({ body: { msg } }) => {
      expect(msg).toEqual("No comments found");
    });
  });
  test("404: responds with error message if passed a valid article ID that does not exist in the database", () => {
    return request(app)
    .get('/api/articles/9999/comments')
    .expect(404)
    .then(({ body: { msg } }) => {
      expect(msg).toEqual("No comments found");
    });
  });
  test("400: responds with 'Bad request' if passed an invalid article ID", () => {
    return request(app)
      .get("/api/articles/not-an-id/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toEqual("Bad request");
      });
  });
});

  //TASK 7
describe.skip('POST /api/:article_id/comments', () => {
  test('201: adds a comment to the given article_id', () => {
    return request(app)
    .get('/api/articles/2/comments')
    .expect(201)
    .then(({body}) => {
      const { comments } = body;
      expect(Array.isArray(comments)).toBe(true);
      comments.forEach((comment) => {
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 3
          })
        );
      });
      });
    });
  });