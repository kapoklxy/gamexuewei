const config = {
    imagePath: 'images/front-upper-body.jpg',
    imageWidth: 720,
    imageHeight: 960,
    acupoints: [
        { name: '神阙', x: 388, y: 667, desc: '在腹中部，脐中央。' },
        { name: '水分', x: 390, y: 645, desc: '在上腹部，前正中线上，当脐中上1寸。' },
        { name: '下脘', x: 390, y: 645, desc: '在上腹部，前正中线上，当脐中上2寸。' },
        { name: '建里', x: 392, y: 623, desc: '在上腹部，前正中线上，当脐中上3寸。' },
        { name: '中脘', x: 394, y: 601, desc: '在上腹部，前正中线上，当脐中上4寸。' },
        { name: '上脘', x: 397, y: 556, desc: '在上腹部，前正中线上，当脐中上5寸。' },
        { name: '巨阙', x: 400, y: 536, desc: '在上腹部，前正中线上，当脐中上6寸。' },
        { name: '鸠尾', x: 400, y: 514, desc: '在上腹部，前正中线上，当胸剑结合部下1寸。' },
        { name: '中庭', x: 402, y: 492, desc: '在胸部，当前正中线上，平第5肋间，即胸剑结合部。' },
        { name: '膻中', x: 405, y: 472, desc: '在胸部，当前正中线上，平第4肋间，两乳头连线的中点。' }
    ],
    gameSettings: {
        initialScore: 0,
        correctPointBonus: 1,
        wrongPointPenalty: -1,
        clickRadius: 20 // 点击判定半径
    }
}; 