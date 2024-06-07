import Empty from './elements/misc/empty.js';
import { drawPixel, gridWidth, col, row, ctx, grid } from './renderer.js';
import { currentElement, brushSize, mouseX, mouseY } from './controls.js';
import { ALLOW_REPLACEMENT, isPaused } from './config.js';

class Grid {
    initialize(row, col) {
        this.row = row;
        this.col = col;
        this.grid = new Array(row * col).fill(new Empty());
    }

    reset() {
        this.grid = new Array(row * col).fill(new Empty());
    }

    removeIndex(i, element) {
        element.index = -1;
        this.grid[i] = new Empty();
    }

    get(i) {
        return this.grid[i];
    }

    setIndex(i, element) {
        element.index = i;
    }

    setElement(x, y, element) {
        this.grid[y * this.col + x] = element;
    }

    setBrush(x, y, element) {
        for (let i = x - brushSize; i <= x + brushSize; i++) {
            for (let j = y - brushSize; j <= y + brushSize; j++) {
                let dx = i - x;
                let dy = j - y;
                if (dx * dx + dy * dy <= brushSize * brushSize) {
                    if (this.isValidIndex(i, j)) {
                        if (currentElement.constructor.name === "Empty") {
                            this.removeIndex(j * this.col + i, this.get(j * this.col + i));
                        }
                        if (Math.random() < element.probability) {
                            if (ALLOW_REPLACEMENT || (this.get(j * this.col + i).constructor.name !== element.constructor.name && this.isEmpty(j * this.col + i))) {
                                let newElement = new element.constructor(j * this.col + i);
                                this.setIndex(j * this.col + i, newElement);
                                this.setElement(i, j, newElement);
                            }
                        }
                    }
                }
            }
        }
    }

    swap(a, b) {
        let aOffset = 0;
        let bOffset = 0;
        if (this.grid[a].empty && this.grid[b].empty) {
            return;
        }
        let temp = this.grid[a];
        this.setIndex(a, this.grid[b]);
        this.setIndex(b, temp);
        this.grid[a] = this.grid[b];
        this.grid[b] = temp;
    }

    isEmpty(i) {
        return this.grid[i].empty;
    }

    isLiquid(i) {
        return this.grid[i].liquid;
    }

    isGas(i) {
        return this.grid[i].gas;
    }

    isPassable(i) {
        return this.grid[i].empty || this.grid[i].liquid || this.grid[i].gas;
    }

    isValidIndex(x, y) {
        return x >= 0 && x < this.col && y >= 0 && y < this.row;
    }

    draw() {
        this.grid.forEach((element, index) => {
            drawPixel(index, element);
        })

        let x = Math.floor(mouseX / gridWidth);
        let y = Math.floor(mouseY / gridWidth);
        for (let i = x - brushSize; i <= x + brushSize; i++) {
            for (let j = y - brushSize; j <= y + brushSize; j++) {
                let dx = i - x;
                let dy = j - y;
                if (dx * dx + dy * dy <= brushSize * brushSize) {
                    if (this.isValidIndex(i, j)) {
                        if (currentElement.constructor.name === "Empty") {
                            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                        } else {
                            ctx.fillStyle = `rgba(${currentElement.color[0]}, ${currentElement.color[1]}, ${currentElement.color[2]}, 0.3)`;
                        }
                        ctx.fillRect(i * gridWidth, j * gridWidth, gridWidth, gridWidth);
                    }
                }
            }
        }

        this.update();
    }

    update() {
        if (isPaused) {
            return;
        }

        // update solids and liquid from top to bottom
        for (let i = Math.floor(this.grid.length / this.col) - 1; i >= 0; i--) {
            for (let j = 0; j < this.col; j++) {
                let rndmOffset = Math.random() > 0.5;
                let colOffset = rndmOffset ? j : -j + this.col - 1;
                let element = this.grid[i * this.col + colOffset];
                if (!(element.gas)) {
                    element.update(this);
                }
            }
        }

        for (let i = 0; i < Math.floor(this.grid.length / this.col); i++) {
            for (let j = 0; j < this.col; j++) {
                let rndmOffset = Math.random() > 0.5;
                let colOffset = rndmOffset ? j : -j + this.col - 1;
                let element = this.grid[i * this.col + colOffset];
                if (element.gas) {
                    element.update(this);
                }
            }
        }
    }
}

export default Grid;
