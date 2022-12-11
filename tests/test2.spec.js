const puppeteer = require('puppeteer');

const url = "https://reqres.in/";
const options = {
    headless: true, timeout: 30000, devtools: true, args: [
        '--start-maximized'
    ]
};

(async function () {

    const browser = await puppeteer.launch(options);
    const page = await (await browser).newPage();
    await page.goto(url, {
        waitUntil: 'networkidle0',
        waitUntil: 'networkidle2',
        timeout: 65000
    });

    console.log(`${await page.title()}`);

    await page.setRequestInterception(true);

    page.on('request', req => {
        if (req.url().indexOf('https://reqres.in/api/users?page=2') != -1) {
            console.log('request intercepted');
            console.log(req.url());
            console.log(req.method());
            req.continue();
        }
    });
    page.on('response', async res => {
        if (res.url().indexOf('https://reqres.in/api/users?page=2') != -1) {
            console.log('response intercepted');
            console.log(res.url());
            console.log(await res.json());
        }
    });

    page.on('requestfinished', async request => {
        const response = await request.response();
        if (request.url().indexOf('https://reqres.in/api/users?page=2') != -1) {
            const responseHeaders = response.headers();
            let responseBody;
            if (request.redirectChain().length === 0) {
                // Because body can only be accessed for non-redirect responses.
                // responseBody = await response.buffer();
                responseBody =  await response.json();
                console.log(responseBody);
            }
            // You now have a buffer of your response, you can then convert it to string :
            
        }
    });


    // call list users;
    let listusers_btn = (await page.$x("//a[contains(text(),'List users')]"))[0];
    await listusers_btn.click();

    await takeScreenShot(page);
    await browser.close();
})();


async function takeScreenShot(page) {
    const fname = 'screenprints/screen-' + await getName();
    await page.screenshot({ path: fname + '.png', type: 'png', fullPage: true, captureBeyondViewport: true });
}

function getName() {
    let s = new Date().toISOString();
    let c = s.replace(/T/, '-');
    let d = c.replace(/\.+/, ' ');
    let e = d.replace(/:/gi, '_');
    let f = e.replace(/\s/, '_');
    return Promise.resolve(f);
}

