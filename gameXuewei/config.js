const config = {
    imagePath: 'images/front-upper-body.jpg',
    imageWidth: 720,
    imageHeight: 960,
    acupoints: [
        { name: '神阙', x: 388, y: 667 },
        { name: '水分', x: 390, y: 645 },
        { name: '下脘', x: 390, y: 645 },
        { name: '建里', x: 392, y: 623 },
        { name: '中脘', x: 394, y: 601 },
        { name: '上脘', x: 397, y: 556 },
        { name: '巨阙', x: 400, y: 536 },
        { name: '鸠尾', x: 400, y: 514 },
        { name: '中庭', x: 402, y: 492 },
        { name: '膻中', x: 405, y: 472 }
    ],
    gameSettings: {
        initialScore: 0,
        correctPointBonus: 1,
        wrongPointPenalty: -1,
        clickRadius: 20 // 点击判定半径
    }
}; 