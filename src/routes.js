import { createPlaywrightRouter, Dataset } from "crawlee";
import { request } from "playwright";

const router = createPlaywrightRouter();

router.addHandler("EXERCISE", async ({ request, page, enqueueLinks }) => {
  const exerciseName = await page.locator("h2.text-xl").textContent();
  const exerciseVideos = await page.locator("video[src]").getAttribute("src");
  const results = { exerciseName, exerciseVideos };
  await Dataset.pushData(results);
  await Dataset.exportToJSON("OUTPUT");
});

router.addDefaultHandler(async ({ request, page, enqueueLinks, log }) => {
  const noviceButton = await page.locator("input#Novice-3").click();
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
