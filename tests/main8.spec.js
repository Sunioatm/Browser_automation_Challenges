import { test, expect } from '@playwright/test';

process.env.PWDEBUG = '0';

test('Challenge 8: calendar', async ({ page }) => {
    await page.goto('https://showdownspace-rpa-challenge.vercel.app/challenge-mui-168af805/');
    await page.getByRole('button', { name: 'Start challenge' }).click();

    const wantedDate = await page.locator('span.chakra-badge').all();

    for (let i = 1; i < wantedDate.length; i++) {
        console.log("i : ", i);
        console.log(await wantedDate[i].innerText());
    }

    const monthMapNameToNum = { "January": "1", "February": "2", "March": "3", "April": "4", "May": "5", "June": "6", "July": "7", "August": "8", "September": "9", "October": "10", "November": "11", "December": "12"}

    // console.log(wantedDate.length)

    for (let i = 1; i < wantedDate.length; i++) {
        const date = await wantedDate[i].innerText();
        const datePart = date.split(' ')[0];
        const timePart = date.split(' ')[1];
        const [year, month, day] = datePart.split('-');
        const [hour, minute] = timePart.split(':');

        // Can't solve the challenge if minute is not divisible by 5 yet
        if (parseInt(minute) % 5 !== 0) {
            continue
        }

        // Select date part
        await page.getByLabel('pick date').click();
        await page.getByLabel('calendar view is open, switch').click();
        await page.getByRole('radio', { name: year }).click();
        
        const currentOn = await page.locator('div.MuiPickersCalendarHeader-label.css-1v994a0')
        const currentOnMonth = (await currentOn.innerText()).split(' ')[0];
        
        const monthDiffernce = Math.abs(parseInt(month) - parseInt(monthMapNameToNum[currentOnMonth]));
        if (parseInt(monthMapNameToNum[currentOnMonth]) > parseInt(month)) {
            for (let i = 0; i < monthDiffernce; i++) {
                await page.getByLabel('Previous month').click();
            }
        } else {
            for (let i = 0; i < monthDiffernce; i++) {
                await page.getByLabel('Next month').click();
            }
        }

        await page.getByRole('gridcell', { name: parseInt(day) }).first().click();

        const clockHourElement = await page.locator('.MuiClock-wrapper.css-1nob2mz')
        const clockHourChildElement = await clockHourElement.locator("*").all()

        await clockHourChildElement[parseInt(hour)].click({ force: true });

        const clockMinElement = await page.locator('.MuiClock-wrapper.css-1nob2mz')

        const clockMinChildElement = await clockMinElement.locator(`text=${minute}`).click({force: true});

        await page.locator('button[type="button"].MuiButtonBase-root.MuiButton-root.MuiButton-text.css-1ujsas3:has-text("OK")').click();
        
    }
    
    // await page.getByRole('button', { name: 'OK' }).click();
});