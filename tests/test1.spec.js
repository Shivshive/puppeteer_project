const puppeteer = require('puppeteer');

const url = "http://demo.automationtesting.in/Frames.html";
const options = {
    headless: true, timeout: 30000, devtools: true, args: [
        '--start-maximized'
    ]
};

const demo_text = "text to enter in the input field";

(async function () {

    const browser = await puppeteer.launch(options);
    const page = await (await browser).newPage();
    await page.goto(url, {
        waitUntil: 'networkidle0',
        waitUntil: 'networkidle2',
        timeout: 65000
    });

    let title = await page.title();
    console.log(`${title}`);


    // await page.pdf({ path: 'page.pdf', format: 'A4',timeout:50000});

    const frames = await page.frames();
    console.log(`${frames.length}`);

    var myframe = frames.find(
        f =>
            f.url().indexOf("SingleFrame") > -1);

    console.log(await myframe.title());
    const input = await myframe.$("input");
    await input.type("demo_text");
    // const value = await input2.getProperty("value");
    // console.log(value);
    await page.screenshot({ path: 'screenprint.png', fullPage: true, captureBeyondViewport: true });
    await browser.close();
})();