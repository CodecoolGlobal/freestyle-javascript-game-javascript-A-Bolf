function initGame() {
    const grid = document.querySelector('.grid')
    const paddle = init_paddle(grid)
    const blocklist = init_blocks(grid)
    init_ball(paddle, grid)



}
function move_paddle(event, paddle) {
    paddle.style.left = parseInt(paddle.style.left) - 5 + 'px'


}
function init_paddle(grid) {

    let paddlewidth = 150;
    let gridwidth = 1200
    let paddle = document.createElement('div');
    paddle.classList.add('paddle');
    paddle.style.width = paddlewidth + 'px'
    paddle.style.left = Math.floor((gridwidth - paddlewidth) / 2) + 'px'
    grid.appendChild(paddle);
    document.addEventListener('keydown', move_paddle(paddle))

    return paddle;

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


}

initGame();
