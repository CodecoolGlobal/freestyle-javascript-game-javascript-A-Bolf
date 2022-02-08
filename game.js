function main() {
    initGame();

}

function initGame() {
    const grid = document.querySelector('.grid')
    const paddle = init_paddle(grid)
    const blocklist = init_blocks(grid)
    const ball = init_ball(paddle, grid)
    init_event_listeners(ball, paddle)

}
function init_paddle(grid) {

    let paddlewidth = 150;
    let gridwidth = 1200
    let paddle = document.createElement('div');
    paddle.classList.add('paddle');
    paddle.style.width = paddlewidth + 'px'
    paddle.style.left = Math.floor((gridwidth - paddlewidth) / 2) + 'px'
    grid.appendChild(paddle);


    return paddle;

}

function move_ball(paddle) {
    let speed = 10
    let bounce = true
    ball = document.querySelector('.ball')
    ball.style.left = parseInt(ball.style.left) + speed + "px"
    ball.style.bottom = parseInt(ball.style.bottom) + speed + "px"

    if (ball.style.bottom > 560 || ball.style.left > 1140 && bounce)


        bounce = false


}
var first_shot = true;
function init_event_listeners(ball, paddle) {
    document.addEventListener('keydown', function (event) {

        if (event.key === 'a' && parseInt(paddle.style.left) > 5) {

            paddle.style.left = (parseInt(paddle.style.left) - 20) + 'px'
            if (first_shot) ball.style.left = (parseInt(ball.style.left) - 20) + 'px'

        }
        else if (event.key === 'd' && parseInt(paddle.style.left) < 1045) {
            paddle.style.left = (parseInt(paddle.style.left) + 20) + 'px'
            if (first_shot) ball.style.left = (parseInt(ball.style.left) + 20) + 'px'



        }
        else if (event.key === " " && first_shot) {
            setInterval(move_ball, 30);
            first_shot = false;

        }
    })
}

function init_blocks(grid) {
    let left = 40
    let top = [25, 50, 75, 100]
    let maxrow = 4;
    let maxcol = 11;
    let blocklist = [];
    for (let row = 0; row != maxrow; row++) {
        for (let col = 0; col != maxcol; col++) {
            let block = document.createElement('div')
            block.classList.add('block')
            block.style.left = left + 'px'
            block.style.top = top[Math.floor((row))] + "px"
            grid.appendChild(block);
            blocklist.push(block);
            left = left + 100
        }
        left = 40

    }
    return blocklist;
}
function init_ball(paddle, grid) {
    let paddlewidth = 150;
    let gridwidth = 1200
    let ball = document.createElement('div')
    ball.classList.add('ball');
    ball.style.left = Math.floor(gridwidth / 2) - 20 + 'px'
    ball.style.bottom = '30px'
    grid.appendChild(ball);
    return ball;

}

main();
