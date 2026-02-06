import { createPlaywrightRouter, Dataset, log } from "crawlee";
import { equipment, equipmentInput } from "./constants.js";

const router = createPlaywrightRouter();

router.addHandler("EXERCISE", async ({ request, page, enqueueLinks }) => {
  const equipmentNeeded = equipment;
  const exerciseName = await page.locator("h2.text-xl").first().textContent();
  const exerciseVideos = [];
  const exerciseInstructions = [];
  const detailedInstruction = [];
  const moreDetails = {};
  const targetMuscles = new Set();
  for (const video of await page.locator("video[src]").all()) {
    const videoLink = await video.getAttribute("src");
    exerciseVideos.push(videoLink);
  }
  for (const instruction of await page.locator("div.border-gray-200").all()) {
    const line = await instruction.textContent();
    if (line.trim() !== "") {
      exerciseInstructions.push(line);
    }
  }

  // Type 1 detailed instruction
  const pageHasType1Instruction = await page
    .locator("P.text-left")
    .first()
    .count();
  if (pageHasType1Instruction >= 1) {
    for (const detInstruc of await page.locator("p.text-left").all()) {
      const line = await detInstruc.textContent();
      if (line.trim() !== "") {
        detailedInstruction.push(line);
      }
    }
  }

  // Type 2 detailed instructions
  const pageHasType2Instruction = await page
    .locator("P.text-left")
    .first()
    .count();
  if (pageHasType2Instruction >= 1) {
    for (const detInstruc of await page.locator("p span").all()) {
      const line = await detInstruc.textContent();
      if (line.trim() !== "") {
        detailedInstruction.push(line);
      }
    }
  }

  // Target muscles from SVG
  for (const target of await page.locator("svg g.text-mw-red").all()) {
    const muscle = await target.getAttribute("id");
    targetMuscles.add(muscle);
  }

  const moreDetailExist = await page.locator("div.hidden dd.text-sm").count();
  if (moreDetailExist >= 1) {
    const moreDetailsLabel = await page.locator("div.hidden dt.text-sm").all();
    const moreDetailsValues = await page.locator("div.hidden dd.text-sm").all();
    for (let i = 0; i < moreDetailExist; i++) {
      const label = await moreDetailsLabel[i].textContent();
      const value = await moreDetailsValues[i].textContent();
      moreDetails[label] = value;
    }
  }

  const results = {
    exerciseName,
    targetMuscles: [...targetMuscles],
    exerciseVideos,
    exerciseInstructions,
    detailedInstruction,
    moreDetails: {...moreDetails},
    equipmentNeeded,
  };

  await Dataset.pushData(results);
  await Dataset.exportToJSON(equipment);
});

router.addDefaultHandler(async ({ request, page, enqueueLinks, log }) => {
  const noviceButton = await page.locator(equipmentInput).click();
  const firstlink = await page
    .locator("table.table-fixed tbody tr td.text-gray-900 a")
    .first()
    .textContent();
  await enqueueLinks({
    selector: "table.table-fixed tbody tr td.text-gray-900 a",
    label: "EXERCISE",
  });
});

export default router;
