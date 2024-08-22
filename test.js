import puppeteer from 'puppeteer';
import { expect } from 'chai';

describe('Wikipedia Navigation Tests', function () {
    this.timeout(30000); // Aumenta el tiempo de espera a 30 segundos

    let browser;
    let page;

    before(async () => {
        browser = await puppeteer.launch({ headless: false });
        page = await browser.newPage();
    });

    after(async () => {
        await browser.close();
    });

    it('should navigate to the English version using link text', async () => {
        await page.goto('https://www.wikipedia.org/');
        await page.click('a[id="js-link-box-en"]');
        await page.waitForSelector('#mp-welcome', { visible: true });
        const url = await page.url();
        expect(url).to.include('en.wikipedia.org');
    });

    it('should navigate to the English version using CSS selector', async () => {
        await page.goto('https://www.wikipedia.org/');
        await page.click('#js-link-box-en');
        await page.waitForSelector('#mp-welcome', { visible: true });
        const url = await page.url();
        expect(url).to.include('en.wikipedia.org');
    });

    it('should navigate to the English version using XPath', async () => {
        await page.goto('https://www.wikipedia.org/');
        
        // Usar XPath para seleccionar el elemento
        const elementHandle = await page.evaluateHandle(() => {
            const xpathResult = document.evaluate(
                '//a[@id="js-link-box-en"]',
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            );
            return xpathResult.singleNodeValue;  // Regresamos el nodo
        });
        
        // Click en el elemento encontrado
        await elementHandle.click();
        
        // Esperar a que la página se recargue y el selector esté visible
        await page.waitForSelector('#mp-welcome', { visible: true });
        
        // Verificar que la URL contiene 'en.wikipedia.org'
        const url = await page.url();
        expect(url).to.include('en.wikipedia.org');
    });
});
