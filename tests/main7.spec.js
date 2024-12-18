import { test, expect } from '@playwright/test';

test("Challenge 7: towers", async ({ page }) => {

    await page.goto("https://showdownspace-rpa-challenge.vercel.app/challenge-towers-6d3a20be/");
    await page.locator("text=Start challenge").click();
    await page.waitForSelector('div[draggable="true"]');

    // Function to locate the bar with a specific number
    const findBarByNumber = async (number) => {
        const bars = await page.locator('div[draggable="true"]');
        for (let i = 0; i < await bars.count(); i++) {
            const bar = bars.nth(i);
            const value = await bar.innerText();
            if (parseInt(value) === number) return bar;
        }
    };

    const targets = await page.locator('div[draggable="true"]');

    for (let targetPosition = 0; targetPosition < 24; targetPosition++) {
        const number = targetPosition + 1; // Numbers 1 to 24
        const barToMove = await findBarByNumber(number);
        const target = targets.nth(targetPosition);

        if (barToMove) {
            await barToMove.dragTo(target);
        }
    }

    expect(await page.locator("text=Challenge completed!")).toBeVisible();
});
