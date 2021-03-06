class Player extends Sprite {
    constructor(divName, position, assetDesc, boundaryRect) {
        super(divName, position, assetDesc.fileName, new Size(assetDesc.width, assetDesc.height));
        this.lives = GameSetting.playerStartLives;
        this.score = 0;
        this.highScore = 0;
        this.state = GameSetting.playerState.ok;
        this.setLives();
        this.setScore();
        this.setHighScore();
    }

    reset() {
        this.lives = GameSetting.playerStartLives;
        this.score = 0;
        this.state = GameSetting.playerState.ok;
        this.setLives();
        this.setScore();
        this.setHighScore();
        this.setPosition(GameSetting.playerStart.x, GameSetting.playerStart.y, 1)
    }

    incrementScore(amount) {
        this.score += amount;
        this.setScore();
        this.setHighScore();
    }

    move(x, y) {
        let xStep = GameSetting.playerMoveStep * x;
        let yStep = GameSetting.playerMoveStep * y;

        if (xStep >= $(GameSetting.playAreaDiv).width()) xStep = 0;

        // if (this.boundaryRect.outsideHorizontal(xStep + this.position.x)) xStep = 0;
        // if (this.boundaryRect.outsideVertical(yStep + this.position.y)) yStep = 0;

        this.incrementPosition(xStep, yStep);
    }

    setLives() {
        $('#lives').text('x' + this.lives);
    }

    setScore() {
        $('#score').text(this.score);
    }

    setHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score
        }
        $('#highScore').text(this.highScore);
    }
}