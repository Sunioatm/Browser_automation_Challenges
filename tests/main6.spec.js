import { test, expect } from '@playwright/test';

process.env.PWDEBUG = '0';

test("Key Mapping Test", async ({ page }) => {
    await page.goto("https://learn.manoonchai.com/");
    const input = await page.locator("input.input");
    await input.focus();

    const sentence = (await page.locator("p.sentence").innerText()) + " ";

    const mapKey = {
        "ม": "KeyG",
        "น": "KeyF",
        "อ": "KeyH",
        "า": "KeyJ",
        " ": "Space"
    }

    // Loop through each character in the sentence
    for (const char of sentence) {
        // console.log(`Pressing ${char}`);
        await page.keyboard.press(mapKey[char]);
    }

    const modal = page.locator('div.bg-white.dark\\:bg-black.pt-5.pb-4');
    await expect(modal).toBeVisible();

    const title = modal.locator('h1#modal-title');
    await expect(title).toContainText('You get');

    await page.waitForTimeout(1500); 
});
