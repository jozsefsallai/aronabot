import { Application } from 'express';

export default function boot(app: Application) {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Web server listening on port ${PORT}`);
  });
}
