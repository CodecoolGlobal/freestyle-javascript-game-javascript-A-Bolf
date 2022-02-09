let current_key = "";
let blocknumber;
while (!Number.isInteger(blocknumber) || blocknumber > 60 || blocknumber < 5) {
    console.log(!Number.isInteger(blocknumber))
    blocknumber = parseInt(window.prompt("Enter block number"))
}
let lives = 3
const lifecount = document.querySelector('.lives')
let paddlewidth = 150;
const gridwidth = 1200;
const grid = document.querySelector('.grid')
const paddle = init_paddle(grid)
const blocklist = init_blocks(grid)
const ball = init_ball(paddle, grid)
const allPerks = ['no-fall']
ball.first_shot = true;
ball.position = [580, 525]
draw_ball()
let speed_x = -2
let speed_y = -2
document.addEventListener('keydown', (event) => current_key = event.key)
document.addEventListener('keyup', () => current_key = "")
isrunning = true
function main() {
    isrunning ? console.log('running') : game_over()
    if (current_key === 'a' && parseInt(paddle.style.left) > 5) {
        paddle.style.left = (parseInt(paddle.style.left) - 5) + 'px'
        if (ball.first_shot) ball.position[0] = ball.position[0] - 5
    }
    else if (current_key === 'd' && parseInt(paddle.style.left) < 1045) {
        paddle.style.left = (parseInt(paddle.style.left) + 5) + 'px'
        if (ball.first_shot) ball.position[0] = ball.position[0] + 5
    }
    else if (current_key === 'w') {
        ball.position[1] += 5;
    }
    else if (current_key === 's') {
        ball.position[1] -= 5;
    }
    else if (current_key === " " && ball.first_shot) {
        document.ball_movement = setInterval(move_ball, 5);

        ball.first_shot = false;
    }
    movePerks()
    draw_ball()
    get_paddle_coords()
    get_ball_coords()
    check_collision()
    lifecount.textContent = 'lives: ' + lives
    if (has_won()) {
        clearInterval(document.run)
        clearInterval(document.ball_movement)
        alert('You won')
    }
    if (lives === 0) {
        isrunning = false;
    }
}
document.run = setInterval(main, 5)
function init_paddle(grid) {


    let paddle = document.createElement('div');
    paddle.classList.add('paddle');
    paddle.style.width = paddlewidth + 'px'
    paddle.style.left = Math.floor((gridwidth - paddlewidth) / 2) + 'px'
    grid.appendChild(paddle);

    return paddle;
}

function has_won() {
    return !document.querySelector('.block')
}

function movePerks() {
    let perks = document.querySelectorAll('.perk')
    for (let perk of perks) {
        let perkTop = parseInt(perk.style.top)
        if (perkTop === 600){
            grid.removeChild(perk)
        }
        if (perkTop >= 585){
            perk.style.height = 599 - perkTop + 'px'
        }
        perk.style.top = (perkTop + 1) + 'px'

    }
}

function move_ball() {
    ball.position[0] += speed_x
    ball.position[1] += speed_y
}

function check_collision() {
    // //block collision
    for (let block of blocklist) {
        const found_x = ball.x_area.some(r => block.x_area.includes(r))
        const found_y = ball.y_area.some(r => block.y_area.includes(r))
        if ((found_x && found_y) && block.style.backgroundColor != 'transparent') {
            speed_x = speed_x * 1
            speed_y = speed_y * - 1
            block.style.backgroundColor = 'transparent'
            initRandomPerk(block)
            grid.removeChild(block)
            break
        }
    }
    //grid collision
    //side collision
    if (ball.x_area.includes(1200) || ball.x_area.includes(0)) {
        speed_x = speed_x * -1
    }
    //side collision
    else if (ball.y_area.includes(0)) {
        speed_y = speed_y * -1
    }
    //bottom collision
    else if (ball.y_area.includes(600)) {
        clearInterval(document.ball_movement)
        ball.first_shot = true;
        ball.position = [580, 525]
        speed_y = -2
        lives--
        paddle.style.left = Math.floor((gridwidth - paddlewidth) / 2) + 'px'
    }
    //paddle collision
    if (ball.y_area.includes(570)) {
        const touch_paddle = ball.x_area.some(r => paddle.x_area.includes(r))
        if (touch_paddle) {
            speed_y = speed_y * -1
        }
    }
}

function initRandomPerk(block){
    if (Math.floor(Math.random()*10) <= 2) {
        let chosenPerk = allPerks[Math.floor(Math.random() * allPerks.length)]
        let perk = document.createElement('div')
        perk.classList.add('perk', chosenPerk)
        perk.style.left = block.x_area[Math.floor(block.x_area.length / 2)] + 'px'
        perk.style.top = block.style.top
        grid.appendChild(perk)
    }
}

function initPerkNoFallDown() {
    setTimeout()
}

function get_paddle_coords() {
    let paddle_width = parseInt(paddle.style.width)
    let paddle_left = parseInt(paddle.style.left)
    let paddle_area_x = []
    for (let i = 0; i < paddle_width; i++) {
        paddle_area_x.push(paddle_left + i)
    }
    paddle.x_area = paddle_area_x
}

function get_ball_coords() {
    const top = parseInt(ball.style.top)
    const left = parseInt(ball.style.left)
    const width = parseInt(ball.style.width)
    let ball_x_area = [];
    let ball_y_area = [];
    for (let i = 0; i <= width; i++) {
        ball_x_area.push(left + i)
        ball_y_area.push(top + i)
    }
    ball.x_area = ball_x_area
    ball.y_area = ball_y_area
}

function get_block_coords(block) {
    let top = parseInt(block.style.top)
    let left = parseInt(block.style.left)
    let width = parseInt(block.style.width)
    let height = parseInt(block.style.height)
    // const top_left = [top, left]
    // const bot_left = [top + height, left]
    // const top_right = [top, left + width]
    // const bot_right = [top + height, left + width]

    const block_x_area = []
    const block_y_area = []
    for (let i = 0; i <= width; i++) {
        block_x_area.push(left + i)

    }
    for (let i = 0; i <= height; i++) {
        block_y_area.push(top + i)
    }
    block.x_area = block_x_area
    block.y_area = block_y_area
}



function init_blocks(grid) {
    let left = 40
    let top = [25, 50, 75, 100]
    let maxrow = 4;
    let maxcol = 11;
    let blocklist = [];
    let colorlist = ['blue', 'pink', 'purple', 'green', 'yellow', 'orange'];
    for (let row = 0; row !== maxrow; row++) {
        for (let col = 0; col !== maxcol; col++) {
            let block = document.createElement('div')
            block.classList.add('block')
            block.style.left = left + 'px'
            block.style.top = top[Math.floor((row))] + "px"
            block.style.width = '100px'
            block.style.height = '20px'
            block.style.backgroundColor = colorlist[col % 6]
            get_block_coords(block)
            blocklist.push(block)
            grid.appendChild(block)
            left = left + 100;
        }
        left = 40
    }
    return blocklist;
}

function init_ball(paddle, grid) {
    let ball = document.createElement('div')
    ball.classList.add('ball');
    ball.style.width = '40px'
    ball.style.height = '40px'
    grid.appendChild(ball);
    return ball;
}

function draw_ball() {
    ball.style.left = ball.position[0] + 'px'
    ball.style.top = ball.position[1] + 'px'
}

function game_over() {
    clearInterval(document.run)
    clearInterval(document.ball_movement)
    alert('You Lost!')
}





