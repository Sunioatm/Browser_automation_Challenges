import { expect, test } from '@playwright/test';

test("Challenge 4: robot", async ({ page }) => {
    await page.goto("https://showdownspace-rpa-challenge.vercel.app/challenge-robot-d34b4b04/");
    await page.locator("text=Start challenge").click();

    const directions = [
        { name: "down", dx: 1, dy: 0 },
        { name: "up", dx: -1, dy: 0 },
        { name: "right", dx: 0, dy: 1 },
        { name: "left", dx: 0, dy: -1 },
    ];

    // Extract the grid into a 2D array
    const grid = await page.locator("table").evaluate((tableElement) => {
        const rows = Array.from(tableElement.querySelectorAll("tr"));
        return rows.map(row => {
            return Array.from(row.querySelectorAll("td")).map(cell => {
                const bgColor = cell.style.backgroundColor;
                return bgColor === "rgb(51, 102, 153)" ? 0 : 1; // Wall = 0, Space = 1
            });
        });
    });

    const rows = grid.length;
    const cols = grid[0].length;

    const start = { x: 0, y: 1 };
    const end = { x: rows - 1, y: cols - 2 };

    const queue = [];
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const parent = Array.from({ length: rows }, () => Array(cols).fill(null));

    queue.push(start);
    visited[start.x][start.y] = true;

    let found = false;

    // BFS to find the shortest path
    while (queue.length > 0 && !found) {
        const { x, y } = queue.shift();

        for (const dir of directions) {
            const newX = x + dir.dx;
            const newY = y + dir.dy;

            if (
                newX >= 0 &&
                newY >= 0 &&
                newX < rows &&
                newY < cols &&
                grid[newX][newY] === 1 &&
                !visited[newX][newY]
            ) {
                visited[newX][newY] = true;
                parent[newX][newY] = { x, y };
                queue.push({ x: newX, y: newY });

                if (newX === end.x && newY === end.y) {
                    found = true;
                    break;
                }
            }
        }
    }

    // Reconstruct the path
    const path = [];
    let current = end;

    while (current && parent[current.x][current.y]) {
        const prev = parent[current.x][current.y];

        if (current.x === prev.x + 1) path.push("down");
        else if (current.x === prev.x - 1) path.push("up");
        else if (current.y === prev.y + 1) path.push("right");
        else if (current.y === prev.y - 1) path.push("left");

        current = prev;
    }    

    const fullPath = path.reverse();

    const goForward = async () => {await page.locator("text=Go forward").click()};
    const turnLeft = async () => {await page.locator("text=Turn left").click()};
    const turnRight = async () => {await page.locator("text=Turn right").click()};

    const character = await page.locator("table div", { hasText: '>' });

    const getCharacterRotation = async () => {
        const transformStyle = await character.evaluate(el => el.style.transform || '');
        if (transformStyle.includes("rotate(90deg)")) return "down";
        if (transformStyle.includes("rotate(0deg)")) return "right";
        if (transformStyle.includes("rotate(180deg)")) return "left";
        if (transformStyle.includes("rotate(270deg)")) return "up";
        return null;
    };
    
    const moveDown = async () => {
        const direction = await getCharacterRotation();
        switch (direction) {
            case "down":
                await goForward();
                break;
            case "right":
                await turnRight();
                await goForward();
                break;
            case "up":
                await turnLeft();
                await turnLeft();
                await goForward();
                break;
            case "left":
                await turnLeft();
                await goForward();
                break;
            default:
                console.error("Unknown direction");
        }
    };
    
    const moveUp = async () => {
        const direction = await getCharacterRotation();
        switch (direction) {
            case "up":
                await goForward();
                break;
            case "right":
                await turnLeft();
                await goForward();
                break;
            case "down":
                await turnLeft();
                await turnLeft();
                await goForward();
                break;
            case "left":
                await turnRight();
                await goForward();
                break;
            default:
                console.error("Unknown direction");
        }
    };
    
    const moveLeft = async () => {
        const direction = await getCharacterRotation();
        switch (direction) {
            case "left":
                await goForward();
                break;
            case "up":
                await turnLeft();
                await goForward();
                break;
            case "down":
                await turnRight();
                await goForward();
                break;
            case "right":
                await turnLeft();
                await turnLeft();
                await goForward();
                break;
            default:
                console.error("Unknown direction");
        }
    };
    
    const moveRight = async () => {
        const direction = await getCharacterRotation();
        switch (direction) {
            case "right":
                await goForward();
                break;
            case "up":
                await turnRight();
                await goForward();
                break;
            case "down":
                await turnLeft();
                await goForward();
                break;
            case "left":
                await turnLeft();
                await turnLeft();
                await goForward();
                break;
            default:
                console.error("Unknown direction");
        }
    }
    
    for (const step of fullPath) {
        switch (step) {
            case "down":
                await moveDown();
                break;
            case "up":
                await moveUp();
                break;
            case "left":
                await moveLeft();
                break;
            case "right":
                await moveRight();
                break;
            default:
                console.error("Unknown step");
        }
    }

    expect(await page.locator("text=Challenge completed!").isVisible()).toBeTruthy();
});
