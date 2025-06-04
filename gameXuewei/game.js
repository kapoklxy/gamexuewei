class AcupointGame {
    constructor() {
        this.score = config.gameSettings.initialScore;
        this.currentTarget = null;
        this.remainingPoints = [...config.acupoints];
        this.isGameActive = false;
        this.marks = []; // 存储标记元素
        this.viewAllMode = false; // 是否为查看所有答案模式

        // DOM elements
        this.bodyImage = document.getElementById('body-image');
        this.clickArea = document.getElementById('click-area');
        this.scoreDisplay = document.getElementById('score');
        this.targetPointDisplay = document.getElementById('target-point');
        this.startButton = document.getElementById('start-game');
        this.nextButton = document.getElementById('next-point');
        this.viewAllButton = document.getElementById('view-all');

        // Bind event listeners
        this.startButton.addEventListener('click', () => this.startGame());
        this.nextButton.addEventListener('click', () => this.nextPoint());
        this.clickArea.addEventListener('click', (e) => this.handleClick(e));
        this.viewAllButton.addEventListener('click', () => this.viewAllAnswers());

        // Set image source
        this.bodyImage.src = config.imagePath;
    }

    startGame() {
        this.score = config.gameSettings.initialScore;
        this.remainingPoints = [...config.acupoints];
        this.updateScore();
        this.isGameActive = true;
        this.viewAllMode = false;
        this.startButton.disabled = true;
        this.bodyImage.src = config.imagePath;
        this.clearMarks(); // 清除所有标记
        this.nextPoint();
    }

    nextPoint() {
        if (this.viewAllMode) {
            // 如果在查看所有穴位模式，切换回答题模式
            this.viewAllMode = false;
            this.bodyImage.src = config.imagePath;
            this.isGameActive = true;
            // 等图片加载完成后再清空标记和显示题目
            if (this.bodyImage.complete) {
                this.clearMarks();
                this._showNextPoint();
            } else {
                this.bodyImage.onload = () => {
                    this.clearMarks();
                    this._showNextPoint();
                };
            }
            return;
        }
        this.clearMarks(); // 清除之前的标记
        this._showNextPoint();
    }

    _showNextPoint() {
        if (this.remainingPoints.length === 0) {
            this.endGame();
            return;
        }
        const randomIndex = Math.floor(Math.random() * this.remainingPoints.length);
        this.currentTarget = this.remainingPoints[randomIndex];
        this.remainingPoints.splice(randomIndex, 1);
        this.targetPointDisplay.textContent = this.currentTarget.name;
    }

    viewAllAnswers() {
        this.viewAllMode = true;
        this.isGameActive = false;
        this.bodyImage.src = 'images/front-upper-body-an.jpg';
        this.targetPointDisplay.textContent = '所有穴位';
        this.clearMarks();
        // 显示所有穴位的红色标记和坐标
        const rect = this.bodyImage.getBoundingClientRect();
        // 需要等图片加载完成后再计算比例
        if (this.bodyImage.complete) {
            this.showAllMarks();
        } else {
            this.bodyImage.onload = () => this.showAllMarks();
        }
    }

    showAllMarks() {
        const rect = this.bodyImage.getBoundingClientRect();
        const scaleX = this.bodyImage.naturalWidth / rect.width;
        const scaleY = this.bodyImage.naturalHeight / rect.height;
        config.acupoints.forEach(pt => {
            const x = pt.x / scaleX;
            const y = pt.y / scaleY;
            // 只显示红点，不显示坐标
            const mark = document.createElement('div');
            mark.className = 'correct-mark';
            mark.style.left = `${x}px`;
            mark.style.top = `${y}px`;
            this.clickArea.appendChild(mark);
            this.marks.push(mark);
        });
    }

    clearMarks() {
        // 清除所有标记
        this.marks.forEach(mark => mark.remove());
        this.marks = [];
    }

    createMark(x, y, type, coordinates) {
        const mark = document.createElement('div');
        mark.className = type;
        mark.style.left = `${x}px`;
        mark.style.top = `${y}px`;
        this.clickArea.appendChild(mark);
        this.marks.push(mark);

        // 创建坐标显示
        const coordDisplay = document.createElement('div');
        coordDisplay.className = 'coordinates-display';
        coordDisplay.textContent = `(${Math.round(coordinates.x)}, ${Math.round(coordinates.y)})`;
        coordDisplay.style.left = `${x}px`;
        coordDisplay.style.top = `${y}px`;
        // 根据类型添加颜色
        if (type === 'user-mark') {
            coordDisplay.classList.add('coordinates-blue');
        } else if (type === 'correct-mark') {
            coordDisplay.classList.add('coordinates-red');
        }
        this.clickArea.appendChild(coordDisplay);
        this.marks.push(coordDisplay);
    }

    handleClick(event) {
        if (!this.isGameActive || !this.currentTarget || this.viewAllMode) return;

        const rect = this.bodyImage.getBoundingClientRect();
        const scaleX = this.bodyImage.naturalWidth / rect.width;
        const scaleY = this.bodyImage.naturalHeight / rect.height;

        const clickX = (event.clientX - rect.left) * scaleX;
        const clickY = (event.clientY - rect.top) * scaleY;

        // 创建点击效果
        this.createClickEffect(event.clientX - rect.left, event.clientY - rect.top);

        // 创建用户点击标记
        this.createMark(
            event.clientX - rect.left,
            event.clientY - rect.top,
            'user-mark',
            { x: clickX, y: clickY }
        );

        // 创建正确答案标记
        const correctX = (this.currentTarget.x / scaleX);
        const correctY = (this.currentTarget.y / scaleY);
        this.createMark(
            correctX,
            correctY,
            'correct-mark',
            { x: this.currentTarget.x, y: this.currentTarget.y }
        );

        // 检查是否点击在目标穴位附近
        const distance = Math.sqrt(
            Math.pow(clickX - this.currentTarget.x, 2) +
            Math.pow(clickY - this.currentTarget.y, 2)
        );

        if (distance <= config.gameSettings.clickRadius) {
            this.handleCorrectAnswer();
        } else {
            this.handleWrongAnswer();
        }
    }

    createClickEffect(x, y) {
        const effect = document.createElement('div');
        effect.className = 'click-effect';
        effect.style.left = `${x}px`;
        effect.style.top = `${y}px`;
        this.clickArea.appendChild(effect);

        // 动画结束后移除效果
        effect.addEventListener('animationend', () => {
            effect.remove();
        });
    }

    handleCorrectAnswer() {
        this.score += config.gameSettings.correctPointBonus;
        this.updateScore();
        alert('回答正确！');
        this.nextPoint();
    }

    handleWrongAnswer() {
        this.score += config.gameSettings.wrongPointPenalty;
        this.updateScore();
        alert('回答错误！');
    }

    updateScore() {
        this.scoreDisplay.textContent = this.score;
    }

    endGame() {
        this.isGameActive = false;
        this.startButton.disabled = false;
        this.currentTarget = null;
        this.targetPointDisplay.textContent = '游戏结束';
        alert(`游戏结束！最终得分：${this.score}`);
    }
}

// 初始化游戏
window.addEventListener('load', () => {
    new AcupointGame();
}); 