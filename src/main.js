import { log, PlaywrightCrawler, Configuration } from "crawlee";
import router from "./routes.js";

log.setLevel(log.LEVELS.DEBUG);
log.debug("Setting Up Crawler");

const config = Configuration.getGlobalConfig();
config.set("memoryMbytes", 6144);

const crawler = new PlaywrightCrawler({
  experiments: {
    requestsLocking: false,
  },
  requestHandler: router,
});

await crawler.run(["https://musclewiki.com/directory"]);
