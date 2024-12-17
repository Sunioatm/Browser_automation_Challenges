import { test, expect } from '@playwright/test';

process.env.PWDEBUG = '0';

test('Challenge 1: Hunting', async ({ page }) => {
    // Navigate to the URL
    await page.goto('https://showdownspace-rpa-challenge.vercel.app/challenge-hunting-fed83d58/');

    // Wait for the "Start challenge" button to appear and click it
    const startButton = await page.locator("button:has-text('Start challenge')");
    await startButton.click();
    
    // Locate the container
    const requiredNumbersContainer = await page.locator('.css-1bfe2ax');

    // Find all child <span> elements inside the container
    const requiredNumbersElements = await requiredNumbersContainer.locator('span.chakra-badge').all();

    // Extract the text content from each <span>
    const requiredNumbers = await Promise.all(
        requiredNumbersElements.map(async (element) => (await element.textContent()).trim())
    );

    // Log the extracted numbers as an array
    console.log(`Required numbers to click:`, requiredNumbers);

    // Locate all boxes in the grid
    const gridBoxes = await page.locator("div[style='width: 32px; height: 32px; opacity: 1;']").all();
    console.log(`Number of boxes found: ${gridBoxes.length}`);

    for (const box of gridBoxes) {
        await box.hover(); 
        await page.waitForTimeout(200); 
    
        // Locate all dynamic divs
        const dynamicDivs = await page.locator("div[style*='position: fixed;']").all();
    
        // Filter the divs to find the one containing only numeric text
        let boxNumber = null;
        for (const div of dynamicDivs) {
            const content = await div.textContent();
            if (/^[0-9]+$/.test(content.trim())) {
                boxNumber = content.trim();
                break; 
            }
        }
    
        if (boxNumber) {
            if (requiredNumbers.some(num => num.includes(boxNumber.trim()))) {
                await box.click();
                console.log(`Clicked box with number: ${boxNumber}`);
            } else {
                console.log(`Skipped box with number: ${boxNumber}`);
            }            
        } else {
            console.log(`No valid numeric content found in dynamic divs for this box.`);
        }
    }

    // Check for the "Challenge completed!" message
    const completionMessage = await page.locator("text=Challenge completed!").first();
    if (await completionMessage.isVisible()) {
        console.log("Challenge completed!");
    } else {
        console.log("Challenge not completed.");
    }

    await page.waitForTimeout(3000); 

    // Close the browser
    await browser.close();

});
