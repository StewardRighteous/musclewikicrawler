import { log, PlaywrightCrawler } from "crawlee";
import router from "./routes.js";

log.setLevel(log.LEVELS.DEBUG);
log.debug("Setting Up Crawler");

const crawler = new PlaywrightCrawler({
  requestHandler: router,
  maxRequestsPerCrawl: 5,
});

await crawler.run(["https://musclewiki.com/directory"]);
