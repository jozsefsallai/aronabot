import 'dotenv/config';

import axios from 'axios';
import * as cheerio from 'cheerio';

import { generateKey, normalizeName } from './common/studentNames';
import { Gift } from '../models/Gift';
import { studentContainer } from '../containers/students';

interface GiftData extends Omit<Gift, 'studentsFavorite' | 'studentsLiked'> {
  studentsFavorite: string[];
  studentsLiked: string[];
}

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
  } as GiftData);

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

async function saveGiftData() {
  console.log('Saving gift data to the database...');

  const promises = [];

  for (const gift of gifts) {
    const giftInstance = Gift.fromJSON(gift);
    promises.push(giftInstance.save());
  }

  try {
    await Promise.all(promises);
    console.log('Gift data saved successfully.');
  } catch (error) {
    console.error('Failed to save gift data:', error);
  }
}

async function main() {
  await studentContainer.bootstrap();

  await populateGifts();
  await saveGiftData();

  console.log('Done.');
}

main().catch(console.error);
