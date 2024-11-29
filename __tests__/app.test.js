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
    .then(({ body }) => {
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

//TASKS 4 & 13
describe('GET /api/articles/:article_id', () => {
  test('200: serves the correct article object when valid article_id provided', () => {
      return request(app)
      .get('/api/articles/3')
      .expect(200)
      .then(({ body }) => {
          expect(body.article).toEqual(
            expect.objectContaining({
              author: "icellusedkars",
              title: "Eight pug gifs that remind me of mitch",
              article_id: 3,
              body: "some gifs",
              topic: "mitch",
              created_at: "2020-11-03T09:12:00.000Z",
              votes: 0,
              article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              comment_count: 2
            })
          );
        });
      });
  test("400: responds with 'Bad request' if passed an invalid article ID", () => {
      return request(app)
        .get("/api/articles/not-an-id")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request: Invalid input");
        });
      });
  test("404: responds with error message if passed a valid article ID that does not exist in the database", () => {
      return request(app)
        .get("/api/articles/9999")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Article ID not found");
        });
      });
    });

//TASKS 5, 11, 12 & 21
describe('GET /api/articles', () => {
  test('200: serves an array of all articles, with a default page limit of 10 and no "body" property', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles).toHaveLength(10);
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
    test('200: sorts articles by a valid column in ascending order', () => {
      return request(app)
        .get('/api/articles?sort_by=title&order=asc')
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeSortedBy("title", { ascending: true });
        });
      });
    test('200: if only a sort_by column is provided, default order is descending', () => {
      return request(app)
        .get('/api/articles?sort_by=votes')
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeSortedBy("votes", { descending: true });
        });
      });
    test('200: if only an order value is provided, default sort_by is created_at', () => {
      return request(app)
        .get('/api/articles?order=asc')
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeSortedBy("created_at", { ascending: true });
        });
      });
    test('200: serves an array of articles, filtered by topic', () => {
        return request(app)
          .get('/api/articles?topic=cats')
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            articles.forEach((article) => {
              expect(article.topic).toBe("cats");
            });
          });
        });
    test('200: serves an array of articles, with page limit and starting page inputted by user', () => {
      return request(app)
        .get('/api/articles?limit=5&p=2')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toHaveLength(5);
          expect(body.total_count).toBeGreaterThan(5);
        });
      });
    test('200: serves an empty array if inputted page exceeds total articles', () => {
      return request(app)
        .get('/api/articles?p=9999')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toHaveLength(0);
          expect(body.total_count).toBeGreaterThan(0);
          });
        });
    test('400: serves error message if sort_by column is invalid', () => {
      return request(app)
        .get('/api/articles?sort_by=not_a_column')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid sort_by column");
        });
      });
    test('400: serves error message if order value is invalid', () => {
      return request(app)
        .get('/api/articles?order=invalid')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid order value");
        });
      });
    test('404: serves an error message if topic does not exist', () => {
        return request(app)
          .get('/api/articles?topic=banana')
          .expect(404)
          .then(({ body }) => {
              expect(body.msg).toBe('Topic not found');
            });
          });
    test('400: serves an error message if inputted limit is invalid', () => {
      return request(app)
        .get('/api/articles?limit=0')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Invalid pagination parameters');
          });
        });
    test('400: serves an error message if inputted page is invalid', () => {
      return request(app)
        .get('/api/articles?p=-1')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Invalid pagination parameters');
          });
        });
    });

//TASKS 6 & 21
describe('GET /api/:article_id/comments', () => {
  test('200: serves an array of all comments for the given article_id, with a default page limit of 10', () => {
    return request(app)
    .get('/api/articles/1/comments')
    .expect(200)
    .then(({ body }) => {
      const { comments } = body;
      expect(Array.isArray(comments)).toBe(true);
      expect(comments).toHaveLength(10);
      comments.forEach((comment) => {
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 1
          })
        );
      });
      });
    });
  test('200: serves an array of all comments for the given article_id, with page limit and starting page inputted by user', () => {
    return request(app)
    .get('/api/articles/1/comments?limit=5&p=2')
    .expect(200)
    .then(({ body }) => {
      const { comments } = body;
      expect(Array.isArray(comments)).toBe(true);
      expect(body.comments).toHaveLength(5);
      body.comments.forEach((comment) => {
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 1
          }));
      });
    });
  });
    test("404: responds with error message if passed a valid article ID that does not have any comments", () => {
      return request(app)
    .get('/api/articles/2/comments')
    .expect(404)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("No comments found");
    });
  });
  test("404: responds with error message if passed a valid article ID that does not exist in the database", () => {
    return request(app)
    .get('/api/articles/9999/comments')
    .expect(404)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("No comments found");
    });
  });
  test("400: responds with 'Bad request' if passed an invalid article ID", () => {
    return request(app)
      .get("/api/articles/not-an-id/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request: Invalid input");
      });
  });
  test('400: serves an error message if inputted limit is invalid', () => {
    return request(app)
      .get('/api/articles/5/comments?limit=0')
      .expect(400)
      .then(({ body }) => {
          expect(body.msg).toBe('Invalid pagination parameters');
        });
      });
});

  //TASK 7
describe('POST /api/articles/:article_id/comments', () => {
  test('201: responds with the posted comment', () => {
    const newComment = { username: "butter_bridge", body: "New comment"};
    return request(app)
    .post('/api/articles/2/comments')
    .send(newComment)
    .expect(201)
    .then(({ body }) => {
      expect(body.comment).toEqual(
        expect.objectContaining({
          "comment_id": expect.any(Number),
          "body": "New comment",
          "article_id": 2,
          "author": "butter_bridge",
          "votes": 0,
          "created_at": expect.any(String),
        })
      );
    });
    });
  test('400: responds with error message if body or username not provided', () => {
    const invalidComment = { body: "Missing username"};
    return request(app)
    .post('/api/articles/2/comments')
    .send(invalidComment)
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad request: Missing required fields");
    });
  });
  test('400: responds with error message if article_id is invalid', () => {
    const newComment = { username: "butter_bridge", body: "This is a good article name"};
    return request(app)
    .post('/api/articles/not-a-number/comments')
    .send(newComment)
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad request: Invalid input");
    });
  });
  test('404: responds with error message if article_id does not exist', () => {
    const newComment = { username: "butter_bridge", body: "This is a good article name"};
    return request(app)
    .post('/api/articles/9999/comments')
    .send(newComment)
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Article or user not found");
    });
  });
});

//TASK 8
describe("PATCH /api/articles/:article_id", () => {
  test("200: increments the votes for an article and responds with the updated article", () => {
    const update = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/2")
      .send(update)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            author: "icellusedkars",
            title: "Sony Vaio; or, The Laptop",
            article_id: 2,
            body: expect.any(String),
            topic: "mitch",
            created_at: "2020-10-16T05:03:00.000Z",
            votes: 1,
            article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        })
        );
      });
      });
  test("200: decrements the votes for an article and responds with the updated article", () => {
    const update = { inc_votes: -1 };
    return request(app)
      .patch("/api/articles/1")
      .send(update)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          article_id: 1,
          body: "I find this existence challenging",
          topic: "mitch",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 99,
          article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
      })
    )
  });
});
  test("400: responds with error for invalid input", () => {
    const invalidUpdate = { inc_votes: "ten" };
    return request(app)
      .patch("/api/articles/3")
      .send(invalidUpdate)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
    });
  });
  test("400: responds with error if given no input", () => {
    const update = {};
    return request(app)
      .patch("/api/articles/4")
      .send(update)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
    });
  });
});

//TASK 9
describe("DELETE /api/comments/:comment_id", () => {
  test("204: successfully deletes a comment by comment_id", () => {
    return request(app)
      .delete("/api/comments/18")
      .expect(204)
      .then(() => {
        return db.query("SELECT * FROM comments WHERE comment_id = 18;")
        .then(({ rows }) => {
          expect(rows.length).toBe(0);
        });
      });
  });
  test("404: responds with error if comment_id does not exist", () => {
    return request(app)
      .delete("/api/comments/9999")
      .expect(404)
      .then(({ body }) => {
          expect(body.msg).toBe("Comment not found");
        });
      });
  test("400: responds with error if given invalid comment_id", () => {
    return request(app)
      .delete("/api/comments/not-an-id")
      .expect(400)
      .then(({ body }) => {
          expect(body.msg).toBe("Bad request: Invalid input");
        });
      });
  });

  //TASK 10
  describe('GET /api/users', () => {
    test('200: serves an array of all users', () => {
      return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
        });
      });
    });

//TASK 17
describe('GET /api/users/:username', () => {
  test('200: serves the correct user object when valid username provided', () => {
      return request(app)
      .get('/api/users/rogersop')
      .expect(200)
      .then(({ body }) => {
          expect(body.user).toEqual(
            expect.objectContaining({
              username: "rogersop",
              name: "paul",
              avatar_url: "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4"
          })
          );
        });
        });
  test("404: responds with error message if passed a username that does not exist in the database", () => {
      return request(app)
        .get("/api/users/not-a-username")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Username not found");
        });
    }); 
      });

//TASK 18
describe("PATCH /api/comments/:comment_id", () => {
  test("200: increments the votes for a comment and responds with the updated comment", () => {
    const update = { inc_votes: 1 };
    return request(app)
      .patch("/api/comments/2")
      .send(update)
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toEqual(
          expect.objectContaining({
          "comment_id": 2,
          "votes": 15,
          "created_at": "2020-10-31T03:03:00.000Z",
          "author": "butter_bridge",
          "body": "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
          "article_id": 1
        })
        );
      });
      });
  test("200: decrements the votes for a comment and responds with the updated comment", () => {
    const update = { inc_votes: -1 };
    return request(app)
      .patch("/api/comments/3")
      .send(update)
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toEqual(
          expect.objectContaining({
          "comment_id": 3,
          "votes": 99,
          "created_at": "2020-03-01T01:13:00.000Z",
          "author": "icellusedkars",
          "body": "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
          "article_id": 1
      })
    )
  });
});
  test("400: responds with error for invalid input", () => {
    const invalidUpdate = { inc_votes: "ten" };
    return request(app)
      .patch("/api/comments/3")
      .send(invalidUpdate)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
    });
  });
  test("400: responds with error if given no input", () => {
    const update = {};
    return request(app)
      .patch("/api/comments/3")
      .send(update)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
    });
  });
});

//TASK 19
describe('POST /api/articles', () => {
  test('201: responds with the posted article and a custom article_img_url', () => {
    const newArticle = { author: "lurker", title: "Another article", body: "This is another article.", topic: "paper", article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"};
    return request(app)
    .post('/api/articles')
    .send(newArticle)
    .expect(201)
    .then(({ body }) => {
      expect(body.article).toEqual(
        expect.objectContaining({
          "author": "lurker",
          "title": "Another article",
          "article_id": expect.any(Number),
          "body": "This is another article.",
          "topic": "paper",
          "created_at": expect.any(String),
          "votes": 0,
          "article_img_url": "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          "comment_count": 0
        })
      );
    });
    });
  test('201: responds with the posted article and a default article_img_url, if none provided', () => {
    const newArticle = { author: "lurker", title: "New article", body: "This is a new article!", topic: "paper"};
    return request(app)
    .post('/api/articles')
    .send(newArticle)
    .expect(201)
    .then(({ body }) => {
      expect(body.article).toEqual(
        expect.objectContaining({
          "author": "lurker",
          "title": "New article",
          "article_id": expect.any(Number),
          "body": "This is a new article!",
          "topic": "paper",
          "created_at": expect.any(String),
          "votes": 0,
          "article_img_url": "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700",
          "comment_count": 0
        })
      );
    });
    });
  test('201: responds with the posted article and a default article_img_url, if provided url is invalid', () => {
    const newArticle = { author: "lurker", title: "New article", body: "This is a new article!", topic: "paper", article_img_url: ""};
    return request(app)
    .post('/api/articles')
    .send(newArticle)
    .expect(201)
    .then(({ body }) => {
      expect(body.article).toEqual(
        expect.objectContaining({
          "author": "lurker",
          "title": "New article",
          "article_id": expect.any(Number),
          "body": "This is a new article!",
          "topic": "paper",
          "created_at": expect.any(String),
          "votes": 0,
          "article_img_url": "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700",
          "comment_count": 0
        })
      );
    });
    });
  test('400: responds with error message if request body is incomplete', () => {
    const invalidArticle = { title: "New article", body: "This is a new article!", topic: "paper"};
    return request(app)
    .post('/api/articles')
    .send(invalidArticle)
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad request: Missing required fields");
    });
  });
});

//TASK 22
describe('POST /api/topics', () => {
  test('201: adds to topics array and responds with new topic', () => {
    const newTopic = { slug: "cooking", description: "Hey good looking, what you got cooking?" }
    return request(app)
    .post('/api/topics')
    .send(newTopic)
    .expect(201)
    .then(({ body }) => {
      expect(body.topic).toEqual({
          slug: "cooking",
          description: "Hey good looking, what you got cooking?",
        });
      });
    });
  test('201: if no valid description is provided, its value is set to null', () => {
    const newTopic = { slug: "coding" }
    return request(app)
    .post('/api/topics')
    .send(newTopic)
    .expect(201)
    .then(({ body }) => {
      expect(body.topic).toEqual({
          slug: "coding",
          description: null
        });
      });
    });
  test('400: responds with error message if slug already exists', () => {
    const invalidTopic = { slug: "paper", description: "what books are made of"};
    return request(app)
    .post('/api/topics')
    .send(invalidTopic)
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad request: Topic already exists");
    });
  });
  test('400: responds with error message if slug is missing or invalid', () => {
    const invalidTopic = { description: "not a slug" };
    return request(app)
    .post('/api/topics')
    .send(invalidTopic)
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad request: Invalid or missing slug");
    });
  });
});

//TASK 23
describe("DELETE /api/articles/:article_id", () => {
  test("204: successfully deletes an article by article_id, including any associated comments", () => {
    return request(app)
      .delete("/api/articles/1")
      .expect(204)
      .then(() => {
        return db.query("SELECT * FROM comments WHERE article_id = 1;")
        .then(({ rows }) => {
          expect(rows.length).toBe(0);
        });
      });
  });
  test("404: responds with error if article_id does not exist", () => {
    return request(app)
      .delete("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
          expect(body.msg).toBe("Article not found");
        });
      });
  test("400: responds with error if given invalid article_id", () => {
    return request(app)
      .delete("/api/comments/not-an-id")
      .expect(400)
      .then(({ body }) => {
          expect(body.msg).toBe("Bad request: Invalid input");
        });
      });
  });