import { bannerContainer } from "../banners";
import { giftContainer } from "../gifts";
import { missionContainer } from "../missions";
import { studentContainer } from "../students";

export let _areContainersBootstrapped = false;

export async function bootstrapContainers() {
  if (_areContainersBootstrapped) {
    return;
  }

  console.log("Bootstrapping containers...");

  await studentContainer.bootstrap();
  await missionContainer.bootstrap();
  await giftContainer.bootstrap();
  await bannerContainer.bootstrap();

  console.log("Containers bootstrapped.");

  _areContainersBootstrapped = true;
}

export function areContainersBootstrapped() {
  return _areContainersBootstrapped;
}
