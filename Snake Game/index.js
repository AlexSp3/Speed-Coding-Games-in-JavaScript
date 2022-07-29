window.onload = () => {
    const
        scoreLbl = document.getElementById("score"),
        canvas = document.getElementById("game-canvas"),
        ctx = canvas.getContext("2d"),

        BLOCK_SIZE = 20,
        FIELD_WIDTH = 40,
        FIELD_HEIGHT = 30;

    let direction,
        score,
        snake,
        fruit;

    (function setup() {

        ctx.canvas.width = FIELD_WIDTH * BLOCK_SIZE;
        ctx.canvas.height = FIELD_HEIGHT * BLOCK_SIZE;

        reset();
        draw();
    })();

    function reset() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        snake = [{ x: Math.floor(FIELD_WIDTH / 2), y: Math.floor(FIELD_HEIGHT / 2) }];
        fruit = null;
        score = 0;
        direction = "ArrowLeft";
    }

    function draw() {
        scoreLbl.innerText = score;

        // Clear last block
        ctx.clearRect(
            snake[snake.length - 1].x * BLOCK_SIZE,
            snake[snake.length - 1].y * BLOCK_SIZE,
            BLOCK_SIZE,
            BLOCK_SIZE
        );

        // Update body
        for (let i = snake.length - 1; i > 0; --i)
            snake[i] = { ...snake[i - 1] };

        // Select direction
        switch (direction) {
            case "ArrowUp":
                snake[0].y ? --snake[0].y : snake[0].y = FIELD_HEIGHT - 1;
                break;
            case "ArrowDown":
                snake[0].y !== FIELD_HEIGHT - 1 ? ++snake[0].y : snake[0].y = 0;
                break;
            case "ArrowLeft":
                snake[0].x ? --snake[0].x : snake[0].x = FIELD_WIDTH - 1;
                break;
            case "ArrowRight":
                snake[0].x !== FIELD_WIDTH - 1 ? ++snake[0].x : snake[0].x = 0;
                break;
        }

        ctx.fillStyle = "rgb(0, 255, 0)";
        ctx.fillRect(snake[0].x * BLOCK_SIZE, snake[0].y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);

        // Check collision with itself
        for (let i = 1; i < snake.length; ++i) {
            if (snake[0].x === snake[i].x && snake[0].y === snake[i].y)
                reset();
        }

        // Make fruit
        if (!fruit) {
            do {
                fruit = {
                    x: Math.floor(Math.random() * (FIELD_WIDTH - 1)),
                    y: Math.floor(Math.random() * (FIELD_HEIGHT - 1))
                };

            } while (snake.some(block => block.x === fruit.x && block.y === fruit.y));

            ctx.fillStyle = "rgb(255, 0, 0)";
            ctx.fillRect(fruit.x * BLOCK_SIZE, fruit.y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
        // Check collision with fruit
        else if (fruit.x === snake[0].x && fruit.y === snake[0].y) {
            snake.push({ x: -1, y: -1 });
            fruit = null;
            ++score;
        }

        setTimeout(draw, 90);
    }

    window.onkeydown = (event) => {
        if ([37, 38, 39, 40].includes(event.keyCode))
            direction = event.key;
    };
};
