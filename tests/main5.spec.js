import { test, expect } from '@playwright/test';

process.env.PWDEBUG = '0';

test("Challenge 5: button", async ({ page }) => {

    await page.goto("https://showdownspace-rpa-challenge.vercel.app/challenge-buttons-a9808c5e/")
    await page.locator("text=Start challenge").click()

    const answerButton = {
        "1": 'button[type="button"][class="chakra-button css-t1xvau"]:has-text("1")',
        "2": 'button[type="button"][class="chakra-button css-t1xvau"]:has-text("2")',
        "3": 'button[type="button"][class="chakra-button css-t1xvau"]:has-text("3")',
        "4": 'button[type="button"][class="chakra-button css-t1xvau"]:has-text("4")',
        "5": 'button[type="button"][class="chakra-button css-t1xvau"]:has-text("5")',
        "6": 'button[type="button"][class="chakra-button css-t1xvau"]:has-text("6")',
        "7": 'button[type="button"][class="chakra-button css-t1xvau"]:has-text("7")',
        "8": 'button[type="button"][class="chakra-button css-t1xvau"]:has-text("8")',
        "9": 'button[type="button"][class="chakra-button css-t1xvau"]:has-text("9")',
        "0": 'button[type="button"][class="chakra-button css-t1xvau"]:has-text("0")',
    }

    for (let i = 0; i < 100; i++) {
        const questionFullText = await page.locator("p.chakra-text.css-157wn8n").innerText();
        const question = (questionFullText.split("=")[0].trim())
        .replace(/,/g, "")
        .replace(/×/g, "*")
        .replace(/x/g, "*")
        .replace(/÷/g, "/")
    
        console.log("Question:",i+1, questionFullText)
        
        let answer = eval(question);
        answer = answer.toString()
        console.log("Answer:", answer)

        for (let i = 0; i < answer.length; i++) {
            const button = answerButton[answer[i]];
            await page.locator(button).click();
        }
        
        await page.locator("text=Submit").click();
    }

    expect(await page.locator("text=Challenge completed!")).toBeVisible();
    await page.waitForTimeout(3000)

})