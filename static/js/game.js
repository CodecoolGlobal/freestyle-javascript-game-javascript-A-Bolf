let current_key = "";
const audio_player=document.querySelector('#audio_player')
let fallDown = true
let lives = 3
const difficulty = document.body.dataset.difficulty
console.log('diff: '+difficulty)
const lifecount = document.querySelector('.lives')
const scorecount=document.querySelector('.lives.score')
let score=0;
let paddlewidth = 150;
const gridwidth = 1900;
const gridheight = 850;

const grid = document.querySelector('.grid')
const paddle = init_paddle(grid)
const blocklist = init_blocks(grid)
const ballsize=40
const ball = init_ball(paddle, grid)
const allPerks = {'no-fall': initPerkNoFallDown, 'big-paddle': init_paddle_big_perk}
/*const allPerks = {'no-fall': initPerkNoFallDown}*/
ball.first_shot = true;
ball.position = [Math.floor((gridwidth-ballsize)/2),gridheight-70 ]
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
    else if (current_key === 'd' && parseInt(paddle.style.left) < gridwidth-paddlewidth-5) {
        paddle.style.left = (parseInt(paddle.style.left) + 5) + 'px'
        if (ball.first_shot) ball.position[0] = ball.position[0] + 5
    }

    else if (current_key==='w' ){
        ball.position[1] = ball.position[1]+5
    }

    else if (current_key==='s' ){
        ball.position[1] = ball.position[1]-5}
    else if (current_key === " " && ball.first_shot) {
        document.ball_movement = setInterval(move_ball, 5);

        ball.first_shot = false;
    }
    movePerks()
    draw_ball()
    get_paddle_coords()
    get_ball_coords()
    getPerksCords()
    check_collision()
    lifecount.textContent = 'lives: ' + lives
    scorecount.textContent='score: '+score
    if (has_won()) {
        clearInterval(document.run)
        clearInterval(document.ball_movement)
        window.location.replace('/winner')
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
    paddle.style.height = '20px'
    paddle.style.left = Math.floor((gridwidth - paddlewidth) / 2) + 'px'
    paddle.style.top = (gridheight-30)+'px'
    grid.appendChild(paddle);

    return paddle;
}

function has_won() {
    return !document.querySelector('.block')
}

function play_audio(pathString){
    if (!audio_player.paused){return}
    if (pathString!=='static/increase_paddle.mp3'){

        audio_player.src=pathString
        audio_player.colume=1
        audio_player.play()
    }
    else{
        audio_player.src=pathString
        audio_player.volume=0.5
        audio_player.play()
    }
}


function movePerks() {
    let perks = document.querySelectorAll('.perk')
    let colorlist=['red','orange','yellow','green','blue','indigo','violet']
    for (let perk of perks) {
        let perkTop = parseInt(perk.style.top)
        if (perkTop === gridheight){
            grid.removeChild(perk)
        }
        if (perkTop >= gridheight-15){
            perk.style.height = (gridheight-1) - perkTop + 'px'
        }
        perk.style.top = (perkTop + 1.7) + 'px'
        perk.style.backgroundColor=colorlist[Math.floor(Math.random() * colorlist.length)]

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
        if ((found_x && found_y) && block.style.backgroundColor !== 'transparent') {
            play_audio('static/soft_beep.mp3')
            score+=10
            speed_y = speed_y * - 1
            block.style.backgroundColor = 'transparent'
            initRandomPerk(block)
            grid.removeChild(block)

            break
        }
    }
    //grid collision
    //side collision
    if (ball.x_area.includes(gridwidth) || ball.x_area.includes(0)) {
        speed_x = speed_x * -1
    }
    //side collision
    else if (ball.y_area.includes(0)) {
        speed_y = speed_y * -1
    }
    //bottom collision
    else if (ball.y_area.includes(gridheight)) {
        if (fallDown) {
            clearInterval(document.ball_movement)
            ball.first_shot = true;
            ball.position = [Math.floor((gridwidth-ballsize)/2),gridheight-70 ]
            speed_y = -2
            play_audio('static/oops.mp3')
            score-=50
            lives--
            paddle.style.left = Math.floor((gridwidth - paddlewidth) / 2) + 'px'
        }
        else {
            speed_y = speed_y * -1
            grid.style.borderBottom = '8px dashed cyan'
        }
        fallDown = true
    }
    //paddle collision
    if (ball.y_area.includes(gridheight-29)) {
        const touch_x_paddle = ball.x_area.some(r => paddle.x_area.includes(r))
        const touch_y_paddle = ball.y_area.some(r => paddle.y_area.includes(r))
        if (touch_x_paddle && touch_y_paddle) {
            speed_y = speed_y * -1
            play_audio('static/boop_shorter.mp3')

        }
    }
    //perk collision
    const perks = document.querySelectorAll('.perk')
    for (let perk of perks) {
        let yAxis = perk.y_area
        if (yAxis.indexOf(gridheight-29) !== -1) {
        const perkXTouchPaddle = perk.x_area.some(r => paddle.x_area.includes(r))
        const perkYTouchPaddle = perk.y_area.some(r => paddle.y_area.includes(r))
        if (perkXTouchPaddle && perkYTouchPaddle) {

            let perkType = perk.perkType
            allPerks[perkType]()
            grid.removeChild(perk)
        }
        }
    }
}

function initRandomPerk(block){
    if (Math.floor(Math.random()*10) <= 2) {
        let chosenPerk = Object.keys(allPerks)[Math.floor(Math.random() * (Object.keys(allPerks).length))]
        let perk = document.createElement('div')
        perk.classList.add('perk')
        perk.perkType = chosenPerk

        perk.style.left = block.x_area[Math.floor(block.x_area.length / 2)] + 'px'
        perk.style.top = block.style.top
        grid.appendChild(perk)

    }
}

function initPerkNoFallDown() {
    if (fallDown) {
        play_audio('static/lightsaber.mp3')
    }
    grid.style.borderBottom = '8px solid cyan'
    fallDown = false
    audio_player.play()
    score+=15
}



function init_paddle_big_perk(){
    paddlewidth=paddlewidth+20
    paddle.style.width=paddlewidth+'px'
    play_audio('static/increase_paddle.mp3')
    score+=15


}
function getPerksCords() {
    let perks = document.querySelectorAll('.perk')
    let perkRadius = 15
    for (let perk of perks) {
        let perkLeft = parseInt(perk.style.left)
        let perkTop = parseInt(perk.style.top)
        let perk_x_area = []
        let perk_y_area = []
        for (let i=0; i <= perkRadius; i++){
            perk_x_area.push(perkLeft + i)
            perk_y_area.push(perkTop + i)
        }
        perk.x_area = perk_x_area
        perk.y_area = perk_y_area
    }
}

function get_paddle_coords() {
    let paddle_width = parseInt(paddle.style.width)
    let paddle_left = parseInt(paddle.style.left)
    let paddle_top = parseInt(paddle.style.top)
    let paddle_height = parseInt(paddle.style.height)
    let paddle_area_x = []
    let paddle_y_area = []
    for (let i = 0; i < paddle_width; i++) {
        paddle_area_x.push(paddle_left + i)
    }
    for (let i = 0; i < paddle_height; i++) {
        paddle_y_area.push(paddle_top + i)
    }
    paddle.y_area = paddle_y_area
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


function get_difficulty_choice() {
    let block_input = ""
    while (!['EASY', 'NORMAL', 'EXTREME'].includes(block_input.toUpperCase())) {
        block_input=document.body.dataset.difficulty;

            switch (block_input.toUpperCase()) {
                case 'EASY':
                    return [5, (gridwidth-200)/100];
                case 'NORMAL':
                    return [7, (gridwidth-200)/100];
                case 'EXTREME':
                    return [12, (gridwidth-200)/100];

            }

    }
}


function init_blocks(grid) {

    let difficulty= get_difficulty_choice()
    let left = 20
    let top = [25, 50, 75, 100, 125, 150, 175, 200,225,250,275,300,325,350,375,400]
    let maxrow = difficulty[0];
    let maxcol = difficulty[1]

    let blocklist = [];
    let colorlist = ['aqua', 'chartreuse', 'fuchsia', 'green', 'aquamarine', 'indigo', 'mediumturquoise', 'lawngreen', 'lightseagreen', 'mediumslateblue', 'steelblue']
    let colorlist2 = ['#FF0000', '#FF3300', '#FF0033', '#FF3333', '#FF0066', '#FF3366', '#FF0099', '#FF3399', '#FF00CC', '#FF33CC', '#FF00FF'];
    for (let row = 0; row !== maxrow; row++) {

        for (let col = 0; col !== maxcol; col++) {
            let block = document.createElement('div')
            block.classList.add('block')
            block.style.left = left + 'px'
            block.style.top = top[Math.floor((row))] + "px"
            block.style.width = '100px'
            block.style.height = '20px'
            block.style.backgroundColor = colorlist[col % colorlist.length]
            get_block_coords(block)
            blocklist.push(block)
            grid.appendChild(block)
            left = left + 110;
        }
        left = 20
    }
    return blocklist;
}

function init_ball(paddle, grid) {
    let ball = document.createElement('div')
    ball.classList.add('ball');
    ball.style.width = ballsize+'px'
    ball.style.height = ballsize+'px'
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
    window.location.replace("/loser");
}





