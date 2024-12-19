# Northcoders News API

Welcome!

This portfolio project was created in Week 7 of a Software Development in JavaScript Skills BootCamp, provided by [Northcoders](https://northcoders.com/).

You can view the hosted application here: https://my-nc-news-2zd4.onrender.com/api.
Use one of the app.get endpoints provided in the below summary, e.g. /api/topics; /api/articles; /api/users

If you would like to clone this repository: you will need to add a .env.test file and a .env.development file, with the following contents:
.env.test >>>>>>>> PGDATABASE=nc_news_test
.env.development > PGDATABASE=nc_news

I also created a .env.production file which contains the DATABASE_URL, please contact me via my email address (visible on my GitHub profile) for more information.

Before you run the tests, make sure to install all dependencies (npm install), then use the following commands:
-npm run setup-dbs
-npm run seed

If you only want to run the utils tests, use: npm t utils
To run only the app tests, use: npm t app
To run all tests, use: npm t

NB: I began work on this repo on 25/11/2024, using PostgreSQL 16.4 and jest@27.5.1.

---

Here is a summary of each step in this week-long project:

**TASK 2: CORE: GET /api**

Should:
- be available on /api
- document all other endpoints available.

**TASK 3: CORE: GET /api/topics**

Should:
- be available on endpoint /api/topics
- get all topics.

**TASK 4: CORE: GET /api/articles/:article_id**

Should:
- be available on /api/articles/:article_id
- get an article by its id.

**TASK 5: CORE: GET /api/articles**

Should:
- be available on /api/articles
- get all articles.

**TASK 6: CORE: GET /api/articles/:article_id/comments**

Should:
- be available on /api/articles/:article_id/comments;
- get all comments for an article.

**TASK 7: CORE: POST /api/articles/:article_id/comments**

Should:
- be available on /api/articles/:article_id/comments
- add a comment for an article.

**TASK 8: CORE: PATCH /api/articles/:article_id**

Should:
- be available on /api/articles/:article_id
- update an article by article_id.

**TASK 9: CORE: DELETE /api/comments/:comment_id**

Should:
- be available on /api/comments/:comment_id
- delete the given comment by comment_id.

**TASK 10: CORE: GET /api/users**

Should: 
- be available on /api/users
- get all users.

**TASK 11: CORE: GET /api/articles (sorting queries)**

The endpoint should also accept the following queries:
- **sort_by**, which sorts the articles by any valid column (defaults to the created_at date)
- **order**, which can be set to asc or desc for ascending or descending (defaults to descending).

**TASK 12: CORE: GET /api/articles (topic query)**

The endpoint should also accept the following query: **topic**, which filters the articles by the topic value specified in the query. If the query is omitted, the endpoint should respond with all articles.

**TASK 13: CORE: GET /api/articles/:article_id (comment_count)**

An article response object should also now include: **comment_count**, which is the total count of all the comments with this article_id. You should make use of queries to the database in order to achieve this.

**TASK 14: CORE: Host application**

Host v1 of the API using Supabase and Render.

**TASK 15: CORE: Complete README**

**TASK 16: ADVANCED: Express Routers**

**TASK 17: ADVANCED: GET /api/users/:username**

Should:
- be available on /api/users/:username
- return a user by username.

**TASK 18: ADVANCED: PATCH /api/comments/:comment_id**

Should:
- be available on /api/comments/:comment_id
- update the votes on a comment given the comment's comment_id.

**TASK 19: ADVANCED: POST /api/articles**

Should:
- be available on /api/articles
- add a new article.

**TASK 20: ADVANCED: GET /api/articles (pagination)**

Should
- be available on /api/articles
- add pagination when retrieving articles.

**TASK 21: ADVANCED: GET /api/articles/:article_id/comments (pagination)**

Should:
- be available on /api/articles/:article_id/comments
- add pagination when retrieving comments for an article.

**TASK 22: ADVANCED: POST /api/topics**

Should:
- be available on /api/topics
- add new topic.

**TASK 23: ADVANCED: DELETE /api/articles/:article_id**

Should
- be available on /api/articles/:article_id;
- delete an article based on an id, and its respective comments.