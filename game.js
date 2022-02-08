function initGame() {
    const row = document.querySelector('.blockrow')
    for (var i = 0; i < 10; i++) {
        let block = document.createElement('div')
        block.classList.add('block')
        row.appendChild(block);
    }

}

initGame();
