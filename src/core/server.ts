import * as path from 'path';

import express from 'express';
import { studentContainer } from '../containers/students';
import { Student } from '../models/Student';
import { bannerContainer } from '../containers/banners';

interface Card {
  key: string;
  student: Student;
  isPickup: boolean;
}

const app = express();

app.use('/images', express.static('assets/images'));
app.use('/styles', express.static('assets/styles'));

app.set('views', path.join(__dirname, '../..', 'assets/views'));
app.set('view engine', 'pug');

app.get('/students', (req, res) => {
  const data = studentContainer.all();
  res.json(data);
});

app.get('/gacha', (req, res) => {
  const bannerId = (req.query.banner ?? 'regular') as string;

  const banner = bannerContainer.getBanner(bannerId);

  if (!banner) {
    res.status(404).send('Banner not found!');
    return;
  }

  const cards: Card[] = [];

  try {
    const students = banner.pullTen();

    for (const [student, key] of students) {
      cards.push({
        key,
        student,
        isPickup: banner.isPickup(key),
      });
    }
  } catch (err: any) {
    res.status(500).send(err.message);
    return;
  }

  res.render('gacha', {
    cards,
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Web server listening on port ${PORT}`);
});
