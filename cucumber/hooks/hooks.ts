import {After, AfterAll, AfterStep, Before, BeforeAll, setDefaultTimeout, Status} from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext } from '@playwright/test';

let browser: Browser;
let context: BrowserContext;

setDefaultTimeout(300*1000);

BeforeAll(async function () {
    browser = await chromium.launch({headless: false});
});
Before(async function () {
    context = await browser.newContext();
    this.page = await context.newPage();
});

After(async function () {
    await this.page.close();
    await context.close();
});

AfterAll(async function () {
    await browser.close();
});

AfterStep(async function ({pickle, result}) {
    if(result.status == Status.FAILED){
        const screenshotPath = `cucumber/report/screenshots/${pickle.name}.png`;
        const screenshot = await this.page.screenshot({path:screenshotPath, type:'png', fullPage:true});
        this.attach(screenshot, 'image/png');
    }
});