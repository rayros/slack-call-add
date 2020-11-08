const puppeteer = require('puppeteer-core');
var argv = require('minimist')(process.argv.slice(2));

const slackScreenshot = (page) => page.screenshot({path: 'slack.png'});

const callAdd = async (browser) => {
  const page = await browser.newPage();
  const navigationPromise = page.waitForNavigation();
  await page.goto(argv.channelUrl);
  await page.setViewport({ width: 1440, height: 798 })
  await page.waitForSelector('.margin_bottom_250 #domain')
  await slackScreenshot(page);

  await page.type('.margin_bottom_250 #domain', argv.domain, { delay: 300 });
  await slackScreenshot(page);

  await page.waitForSelector('.p-autoclog__hook > .p-refreshed_page > .p-signin_form__form_container > .margin_bottom_250 > .c-button')
  await page.click('.p-autoclog__hook > .p-refreshed_page > .p-signin_form__form_container > .margin_bottom_250 > .c-button')
  await navigationPromise
  await slackScreenshot(page);

  await page.waitForSelector('.card > .col > form > p > .btn')
  await page.click('.card > .col > form > p > .btn')
  await navigationPromise
  await slackScreenshot(page);
  await page.waitForSelector('.align_center #email')
  await slackScreenshot(page);
  await page.type('.align_center #email', process.env.SLACK_LOGIN, { delay: 300 })
  await slackScreenshot(page);
  await page.waitForSelector('.align_center #password')
  await page.type('.align_center #password', process.env.SLACK_PASSWORD, { delay: 300 });
  await slackScreenshot(page);
  await page.waitForSelector('.align_center #signin_btn')
  await page.click('.align_center #signin_btn')
  await navigationPromise
  await slackScreenshot(page);
  await page.waitForSelector('.ql-editor');
  await page.click('.ql-editor');
  
  // Clean editor
  await page.focus('.ql-editor');
  await page.keyboard.down('Control');
  await page.keyboard.press('A');
  await page.keyboard.up('Control');
  await page.keyboard.press('Backspace');
  
  await slackScreenshot(page);
  await page.keyboard.type('/call');
  await page.waitForTimeout(1000);
  await page.keyboard.press('Enter');
  await slackScreenshot(page);
  await page.waitForSelector('.ReactModal__Overlay > .ReactModal__Content > .c-sk-modal_footer > .c-sk-modal_footer_actions > .c-button:nth-child(2)')
  await slackScreenshot(page);
  
  const [target] = await Promise.all([
    new Promise(resolve => browser.once('targetcreated', resolve)),
    page.click('.ReactModal__Overlay > .ReactModal__Content > .c-sk-modal_footer > .c-sk-modal_footer_actions > .c-button:nth-child(2)')
  ]);
  
  await page.keyboard.type('@here Zapraszam na call ;)');
  await page.waitForTimeout(1000);
  await page.keyboard.press('Enter');
  await slackScreenshot(page);

  const audioCallPage = await target.page();
  await audioCallPage.bringToFront();
  await page.waitForTimeout(5000)
  await audioCallPage.screenshot({path: 'call.png'});
  await page.waitForTimeout(1000 * 60 * 15)
}

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    args: [
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-setuid-sandbox',
      '--disable-notifications',
      '--disable-gpu',
      '--disable-infobars',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
      '--use-fake-device-for-media-stream',
      "--autoplay-policy=no-user-gesture-required"
    ],
  });
  
  try {
    await callAdd(browser);
    await browser.close();
  } catch (error) {
    await browser.close();
    console.error(error);
  }
})();

