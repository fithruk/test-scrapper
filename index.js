const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

let googleUsername = "";
let googlePassword = "";

const setUserData = async (page, msg) => {
  return await page.evaluate((msg) => {
    return prompt(msg);
  }, msg);
};

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--no-sandbox",
      "--disable-gpu",
      "--enable-webgl",
      "--window-size=800,800",
    ],
  });

  const loginUrl = "https://www.google.com/intl/ru/gmail/about/";
  const ua =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36";
  const page = await browser.newPage();

  page.on("console", (msg) => {
    if (msg.type() === "log") {
      console.log(msg.text());
    }
  });
  await page.setUserAgent(ua);
  await page.goto(loginUrl, {
    waitUntil: "networkidle2",
  });

  googleUsername = await setUserData(page, "Введите почту");

  googlePassword = await setUserData(page, "Введите парлль");

  await page.click("a[data-action='sign in']");
  await page.waitForTimeout(2000);
  await page.type('input[type="email"]', googleUsername);
  await page.waitForTimeout(2000);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(2000);
  await page.type('input[type="password"]', googlePassword);
  await page.waitForTimeout(2000);
  await page.keyboard.press("Enter");
  await page.waitForSelector(".ain");
  await page.evaluate(() => {
    const unreaded = document.querySelector(".ain").querySelector(".bsU");

    alert(`Непрочитанных сообщений: ${unreaded.textContent}`);
  });
})();
