import express, { Application } from 'express';

export default function middleware(app: Application) {
  app.use('/images', express.static('assets/images'));
  app.use('/styles', express.static('assets/styles'));

  app.set('views', 'assets/views');
  app.set('view engine', 'pug');
}
