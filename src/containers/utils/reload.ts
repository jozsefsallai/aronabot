import { bannerContainer } from '../banners';
import { giftContainer } from '../gifts';
import { iconsContainer } from '../icons';
import { missionContainer } from '../missions';
import { studentContainer } from '../students';

export async function reloadContainers() {
  console.log('Reloading containers...');

  await studentContainer.reload();
  await missionContainer.reload();
  await giftContainer.reload();
  await iconsContainer.reload();
  await bannerContainer.reload();

  console.log('Containers reloaded.');
}
