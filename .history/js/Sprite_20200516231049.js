class Sprite {
    constructor(divName, position, imgName, sizePx) {
        this.divName = divName;
        this.position = position;
        this.imgName = imgName;
        this.size = sizePx;
        this.anchorShift = new Point(-this.size.width / 2, -this.size.height / 2);
        this.containingBox = new Rect(this.position.x, this.position.y,
            this.size.width, this.size.height);
    }

    addToBoard(shift) {
        let div = document.createElement("div");
        div.classList.add("sprite");
        div.id = this.divName;
        div.style.backgroundImage = "url('" + this.imgName + "')";
        div.style.backgroundRepeat = "no-repeat";
        div.style.backgroundSize = "contain";
        div.style.transform = "rotate(-90deg)";
        div.style.width = this.size.height + "px";
        div.style.height = this.size.width + "px";
        $(GameSetting.playAreaDiv).append(div);

        this.setPosition(this.position.x, this.position.y, shift);
    }
    removeFromBoard() {
        $('#' + this.divName).remove();
    }

    draw() {
        $('#' + this.divName).css({
            "left": this.position.x,
            "top": this.position.y
        });
    }

    setPosition(x, y, shift) {
        this.position.update(x, y);
        this.containingBox.update(this.position.x, this.position.y);
        if (shift) {
            this.incrementPosition(this.anchorShift.x, this.anchorShift.y);
        }
        this.draw();
    }
    updatePosition(x, y) {
        this.position.update(x, y);
        this.containingBox.update(this.position.x, this.position.y);
        this.draw();
    }
    incrementPosition(ix, iy) {
        this.position.increment(ix, iy);
        this.containingBox.update(this.position.x, this.position.y);
        this.draw();
    }

    getCenterPoint() {
        return new Point(this.anchorShift.x,
            this.anchorShift.y);
    }
}