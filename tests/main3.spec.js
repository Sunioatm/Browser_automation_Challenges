import { test, expect } from '@playwright/test';
import fs from 'fs';

process.env.PWDEBUG = '0'

const baseUrl = "https://dtinth.github.io/bacblog"

test('Challenge 3: blog', async ({ page }) => {
    await page.goto(baseUrl);

    const totalPageRaw = await page.locator("div.home > p")
    const totalPage = (await totalPageRaw.innerText()).split(" ")[3]
    console.log("Total page innerText: ", totalPage);
    
    let allWebArticles = [];

    // Check if already have the articles saved in the file
    const articleFilePath = "./tests/main3-articles.json";

    // Check if already saved
    if (fs.existsSync(articleFilePath)) {
        console.log('File already exists. Reading data from file...');
        const fileContent = fs.readFileSync(articleFilePath, 'utf-8');
        allWebArticles = JSON.parse(fileContent);
        console.log('Articles loaded from file');
    } else {
        for (let i = 1; i <= totalPage; i++) {
            const linkPath = (i === 1) ? "/" : `/page${i}/`;
            await page.goto(baseUrl + linkPath);

            const listItems = await page.locator("ul.post-list > li");

            const count = await listItems.count();
            for (let j = 0; j < count; j++) {
                const articleText = await listItems.nth(j).innerText();
                const metadata = `page${i}-${j + 1}`;
                allWebArticles.push({ metadata, article: articleText });
            }
        }

        // Save articles with metadata to JSON
        fs.writeFileSync(articleFilePath, JSON.stringify(allWebArticles, null, 2), 'utf-8');
        console.log('Articles saved to main3-articles.json');
    }

    if (fs.existsSync(articleFilePath)) {
        console.log('File already exists. Reading data from file...');
        const fileContent = fs.readFileSync(articleFilePath, 'utf-8');
        allWebArticles = JSON.parse(fileContent);
        console.log('Articles loaded from file');
    } else {
        for (let i = 1; i <= totalPage; i++) {
            const linkPath = (i == 1) ? "/" : `/page${i}/`;
            await page.goto(baseUrl + linkPath);
        
            const listItems = await page.locator("ul.post-list > li").allInnerTexts();

            allWebArticles.push(...listItems);
        }
        fs.writeFileSync('./tests/main3-articles.json', JSON.stringify(allWebArticles), 'utf-8');
        console.log('Articles saved to main3-articles.json');
    }

    // Question 1: Identify the Missing Article
    const articleInBacblog = fs.readFileSync('./tests/main3-bacblog.csv', 'utf-8');

    // Convert CSV content to an array of titles
    const bacblogArticlesForDup = articleInBacblog
        .split('\n') 
        .slice(1)
        .map(line => {
            const lastCommaIndex = line.lastIndexOf(',');
            const title = line.substring(0, lastCommaIndex).trim();
            return title.replace(/^"|"$/g, ''); 
        })
        .filter(title => title.length > 0); 

    const allWebArticlesTitle = allWebArticles.map(article => (article.article).split("\n")[1]);

    // Check for missing articles
    const missingArticles = bacblogArticlesForDup.filter(bacblogArticle => !allWebArticlesTitle.includes(bacblogArticle));

    if (missingArticles.length > 0) {
        console.log("Missing Articles:", missingArticles);
    } else {
        console.log("No missing articles. All titles are accounted for.");
    }

    // Question 2: Identify the Duplicate Article Title
    let titleArticlesCount = {}

    // Iterate through the articles read from the file
    allWebArticles.forEach((article, index) => {
        // console.log(`Article ${index + 1}: ${article}`);
        const articleTitle = (article.article).split("\n")[1];
        if (titleArticlesCount[articleTitle]) {
            titleArticlesCount[articleTitle] += 1;
        } else {
            titleArticlesCount[articleTitle] = 1;
        }
    });
    
    // Find and log duplicates
    const duplicates = Object.entries(titleArticlesCount)
        .filter(([title, count]) => count > 1)
        .map(([title, count]) => ({ title, count }));

    if (duplicates.length > 0) {
        console.log("Duplicate articles found:", duplicates);
    } else {
        console.log("No duplicate articles found.");
    }
    
    // Question 3: Identify the Article with Incorrect Word Count
        
    // Convert CSV content to an array of titles
    const bacblogArticlesForCountWord = articleInBacblog
        .split('\n')
        .slice(1) 
        .reduce((acc, line) => {
            const lastCommaIndex = line.lastIndexOf(',');
            const title = line.substring(0, lastCommaIndex).trim(); 
            const wordCount = parseInt(line.substring(lastCommaIndex + 1).trim());
            const adjustedTitle = title.replace(/^"|"$/g, ''); 
    
            if (adjustedTitle.length > 0) {
                acc[adjustedTitle] = wordCount; 
            }
            return acc;
        }, {}); 

        // console.log("Bacblog Articles: ", bacblogArticlesForCountWord);

    let incorrectWordCountArticles = [];

    for (const article of allWebArticles) {
        const articleTitle = (article.article).split("\n")[1];
        const articleMetadata = article.metadata;
        const articlePage = (articleMetadata.split("-")[0] === "page1") ? "" : articleMetadata.split("-")[0];
        const articleIndex = articleMetadata.split("-")[1];
    
        // console.log("Go to:", baseUrl + `/${articlePage} with article : ${articleTitle} - ${articleIndex}`);
        await page.goto(baseUrl + `/${articlePage}`);
    
        const item = await page.locator("li").nth(parseInt(articleIndex) - 1);
        await item.click();
        const articleContent = await page.locator("div.post-content.e-content > p").innerText();
        const articleWordCount = articleContent.split(" ").length;
    
        if (bacblogArticlesForCountWord[articleTitle] !== articleWordCount) {
            console.log(`Article with incorrect word count: ${articleTitle}`);
            incorrectWordCountArticles.push({ 
                title: articleTitle, 
                expected: bacblogArticlesForCountWord[articleTitle], 
                actual: articleWordCount 
            });
        }
    }    

    console.log("Incorrect Word Count Articles: ", incorrectWordCountArticles);

    // await page.waitForTimeout(2000);
})