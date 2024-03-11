import axios from 'axios';
import * as cheerio from 'cheerio';

import * as fs from 'fs';
import * as path from 'path';

import { generateKey, normalizeName } from './common/studentNames';
import { Gift } from '../models/Gift';

interface GiftData extends Omit<Gift, 'studentsFavorite' | 'studentsLiked'> {
  studentsFavorite: string[];
  studentsLiked: string[];
}

const GIFTS_DB_PATH = path.join(__dirname, '../..', 'data/gifts.json');

const GIFTS_LIST_URL = 'https://bluearchive.wiki/wiki/Affection';

const gifts: GiftData[] = [];

function getStudents(
  $: cheerio.CheerioAPI,
  row: cheerio.Element,
  index: number,
) {
  const students = [];

  const images = $(row).find(`td:nth-child(${index}) img`).toArray();

  for (const image of images) {
    const rawName = image.attribs.alt;
    const name = normalizeName(rawName);
    const key = generateKey(name);
    students.push(key);
  }

  return students;
}

function parseGiftRow($: cheerio.CheerioAPI, row: cheerio.Element) {
  let iconUrl = $(row).find('td:nth-child(1) img').attr('src');
  const rarity = $(row).find('td:nth-child(2) > span').toArray().length;
  const name = $(row).find('td:nth-child(3)').text().trim();
  const description = $(row).find('td:nth-child(4)').text().trim();

  if (!name) {
    return;
  }

  const studentsFavorite = getStudents($, row, 5);
  const studentsLiked = getStudents($, row, 6);

  if (iconUrl) {
    iconUrl = `https:${iconUrl}`;
  }

  gifts.push({
    iconUrl,
    rarity,
    name,
    description,
    studentsFavorite,
    studentsLiked,
  });

  console.log(`Added ${name} to gifts list.`);
}

async function populateGifts() {
  const res = await axios.get(GIFTS_LIST_URL);
  const $ = cheerio.load(res.data);

  const giftList = $('table.gifts-table tbody tr').toArray();

  for (const row of giftList) {
    parseGiftRow($, row);
  }
}

function saveGiftData() {
  fs.writeFileSync(GIFTS_DB_PATH, JSON.stringify(gifts, null, 2));
}

async function main() {
  await populateGifts();
  saveGiftData();

  console.log('Done.');
}

main().catch(console.error);
