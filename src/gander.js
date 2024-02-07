const fs = require('fs');
const util = require('util');
const path = require('path');
const { fileURLToPath } = require('url');
const puppeteer = require('puppeteer');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const exists = util.promisify(fs.exists);
const unlink = util.promisify(fs.unlink);

const extPath = path.join(__dirname, "..", "ISDCAC");
console.log("-> extPath", extPath);

const FILENAME = "document.pdf";
const dummyUrl = "https://www.vg.no";
const dummyContent = "<h1>OOOPS NO content provided</h1>";

async function runPupWithUrl(websiteUrl = dummyUrl) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      '--no-sandbox',
      `--disable-extensions-except=${extPath}`,
      `--load-extension=${extPath}`,
    ],
  });

  const page = await browser.newPage();

  await page.goto(websiteUrl, {waitUntil: ["load", "domcontentloaded", "networkidle0"]});
  sleep(1000);

  await page.emulateMediaType("screen");

  const pdf = await page.pdf({
    path: FILENAME,
    margin: {top: "100px", right: "50px", bottom: "100px", left: "50px"},
    printBackground: true,
    format: "A4",
  });

  await browser.close();

  return pdf;
}

async function cleanUp() {
  // Remove the PDF file if it already exists
  if (await exists(FILENAME)) {
    await unlink(FILENAME);
  }
}

module.exports = { runPupWithUrl, cleanUp };
