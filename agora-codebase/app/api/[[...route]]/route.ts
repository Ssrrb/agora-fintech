import { Hono } from 'hono';

const app = new Hono().basePath('/hello');
app.get('/hello', (c) => {
  return c.json('Hello Hono!');
});
