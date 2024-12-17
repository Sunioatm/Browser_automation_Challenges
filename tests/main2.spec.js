import { test, expect } from '@playwright/test';

process.env.PWDEBUG = '0';

test("Challenge 2: Seven Segment Display", async ({ page }) => {

    await page.goto("https://lemon-meadow-0c732f100.5.azurestaticapps.net/ssg")
    const targetNumberLocator = await page.locator("div.number.svelte-pqiwpi");
    const targetNumber = await targetNumberLocator.textContent();
    console.log(`Target number: ${targetNumber}` + "\n");

    const segmentDictionary = {
        "0": ["t", "tl", "tr", "bl", "br", "b"],
        "1": ["tr", "br"],
        "2": ["t", "tr", "m", "bl", "b"],
        "3": ["t", "tr", "m", "br", "b"],
        "4": ["tl", "tr", "m", "br"],
        "5": ["t", "tl", "m", "br", "b"],
        "6": ["t", "tl", "m", "bl", "br", "b"],
        "7": ["t", "tr", "br"],
        "8": ["t", "tl", "tr", "m", "bl", "br", "b"],
        "9": ["t", "tl", "tr", "m", "br", "b"]
    }

    const mapSelector = {
        "t": ".horizontal:not(.middle):not(.bottom)",
        "tl": ".left-top",
        "tr": ".right-top",
        "m": ".horizontal.middle",
        "bl": ".left-bottom",
        "br": ".right-bottom",
        "b": ".horizontal.bottom"
    }

    for (let i = 0; i < targetNumber.length; i++) {
        const number = targetNumber[i];
        const segments = segmentDictionary[number];
        const nthElement = await page.locator(".interactive").nth(i);
        
        for (let j = 0; j < segments.length; j++) {
            const segment = segments[j];
            const segmentSelector = mapSelector[segment];
            const segmentLocator = await nthElement.locator(`${segmentSelector}`);
            await segmentLocator.click();            
        }
    }

    // expectec completion message
    await page.waitForSelector("text=Congratulations! You won!");

    await page.waitForTimeout(3000);

})