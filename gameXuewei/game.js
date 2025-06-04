class AcupunctureGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 10;
        this.messageElement = document.getElementById('message');
        this.scoreElement = document.getElementById('score');
        
        // 获取当前HTML文件的路径
        const currentPath = window.location.pathname;
        const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
        
        // 穴位数据
        this.acupuncturePoint = {
            name: "合谷穴",
            image: basePath + "images/hegu_point.jpg", // 使用基于HTML文件的路径
            correctPosition: {
                x: 354, // 更新为实际图片中的坐标
                y: 322
            },
            tolerance: 40 // 允许的误差范围（像素）
        };

        this.init();
    }

    init() {
        // 加载图片
        this.image = new Image();
        this.image.onload = () => {
            // 设置canvas大小
            this.canvas.width = 1080; // 更新为实际图片宽度
            this.canvas.height = 606; // 更新为实际图片高度
            // 绘制图片
            this.ctx.drawImage(this.image, 0, 0);
            
            // 添加穴位名称提示
            this.ctx.font = '20px Arial';
            this.ctx.fillStyle = 'black';
            this.ctx.fillText('请点击合谷穴位置', 10, 30);
        };
        
        // 添加图片加载错误处理
        this.image.onerror = () => {
            console.error('图片加载失败:', this.acupuncturePoint.image);
            this.showMessage('图片加载失败，请检查图片路径', 'incorrect');
        };
        
        this.image.src = this.acupuncturePoint.image;

        // 添加点击事件监听
        this.canvas.addEventListener('click', this.handleClick.bind(this));
    }

    handleClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // 打印用户点击位置
        console.log(`用户点击位置: (${x}, ${y})`);
        // 显示到页面上
        document.getElementById('clickPosition').textContent = `你点击的位置: (${Math.round(x)}, ${Math.round(y)})`;

        // 计算点击位置与正确位置的距离
        const distance = Math.sqrt(
            Math.pow(x - this.acupuncturePoint.correctPosition.x, 2) +
            Math.pow(y - this.acupuncturePoint.correctPosition.y, 2)
        );

        // 判断是否在允许的误差范围内
        let isCorrect = false;
        if (distance <= this.acupuncturePoint.tolerance) {
            this.score += 1;
            this.showMessage('正确！+1分', 'correct');
            isCorrect = true;
        } else {
            this.score -= 1;
            this.showMessage('错误！-1分', 'incorrect');
        }

        // 更新分数显示
        this.scoreElement.textContent = this.score;

        // 清除画布并重绘图片
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.image, 0, 0);
        this.ctx.font = '20px Arial';
        this.ctx.fillStyle = 'black';
        this.ctx.fillText('请点击合谷穴位置', 10, 30);

        // 画用户点击的蓝色圆圈
        this.drawFeedback(x, y, 'blue');

        // 显示正确答案绿色标记和坐标
        this.drawFeedback(
            this.acupuncturePoint.correctPosition.x,
            this.acupuncturePoint.correctPosition.y,
            'green',
            true // 显示坐标
        );
    }

    showMessage(text, className) {
        this.messageElement.textContent = text;
        this.messageElement.className = 'message ' + className;
        
        // 3秒后清除消息
        setTimeout(() => {
            this.messageElement.textContent = '';
            this.messageElement.className = 'message';
        }, 3000);
    }

    drawFeedback(x, y, color, showCoord = false) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(x, y, 12, 0, Math.PI * 2);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        if (color === 'blue') {
            this.ctx.fillStyle = 'rgba(0,0,255,0.2)';
            this.ctx.fill();
        }
        if (showCoord) {
            this.ctx.font = '16px Arial';
            this.ctx.fillStyle = color;
            this.ctx.fillText(`(${Math.round(x)}, ${Math.round(y)})`, x + 15, y - 10);
        }
        this.ctx.restore();
    }
}

// 当页面加载完成后初始化游戏
window.addEventListener('load', () => {
    new AcupunctureGame();
}); 