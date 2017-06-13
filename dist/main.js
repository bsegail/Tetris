/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sass_style_scss__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sass_style_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__sass_style_scss__);


var canvas = document.querySelector('canvas');
canvas.style.background = '#1C2023';
var c = canvas.getContext('2d');

var gameTime = Date.now();
var lockDelay = 250;
var gameSpeed = 100;

var beforeGameSpeed = 100;
var score = 0;
var run = true;
var lastRecordedMove = Date.now();

canvas.width = window.innerWidth - 4;
canvas.height = window.innerHeight - 4;

canvas.addEventListener("resize", function (event) {
	canvas.width = window.innerWidth - 4;
	canvas.height = window.innerHeight - 4;
	init();
});

document.onkeydown = function (e) {
	e = e || window.event;

	if (e.keyCode == '27') {
		run = false;
	}
	if (e.keyCode == '37') {
		currentBlock.moveLeft();
	}
	if (e.keyCode == '38') {
		currentBlock.rotate();
	}
	if (e.keyCode == '39') {
		currentBlock.moveRight();
	}
	if (e.keyCode == '32') {
		currentBlock.hardDown();
	}
	if (e.keyCode == '40') {
		beforeGameSpeed = gameSpeed;
		gameSpeed = 0;
	}
};

document.onkeyup = function (e) {
	e = e || window.event();
	if (e.keyCode == '40') {
		gameSpeed = beforeGameSpeed;
	}
};

function getDistance(x1, y1, x2, y2) {
	let x = x2 - x1;
	let y = y2 - y1;

	return {
		x: x,
		y: y
	};
}

function testCollision(x1, y1, width1, height1, x2, y2, width2, height2) {
	return x1 > x2 && x1 < x2 + width2 && y1 > y2 && y1 < y2 + height2;
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

class UI {
	constructor() {
		this.x = 50;
		this.y = 50;
		this.width = 350;
		this.height = 700;

		this.floor = this.y + this.height;
		this.leftWall = this.x;
		this.rightWall = this.x + this.width;

		this.scoreX = this.x + this.width + 35 * 3;
		this.scoreY = this.y;

		this.scoreWidth = 35 * 4;
		this.scoreHeight = 35 * 2;
	}

	draw() {
		c.fillStyle = "#D8D8D8";
		c.fillRect(this.x, this.y, this.width, this.height);
		c.fillRect(this.scoreX, this.scoreY, this.scoreWidth, this.scoreHeight);
		c.fillStyle = "#000000";
		c.font = "18px Helvetica";
		c.fillText('Lines Cleared:', this.scoreX + 10, this.scoreY + 24);
		c.fillText(score, this.scoreX + 10, this.scoreY + 48);
		c.closePath();
	}

	update() {
		this.draw();
	}
}

class Block {
	constructor(x, y, color) {
		this.x = x;
		this.y = y;

		this.width = 35;
		this.height = 35;
		this.color = color;

		this.lastMove = Date.now();

		this.floorCollision = false;
		this.leftWallTouching = false;
		this.rightWallTouching = false;

		this.killed = false;

		this.particleList = [];
	}

	moveDown() {
		this.y += 35;
	}

	moveRight() {
		this.x += 35;
	}

	moveLeft() {
		this.x -= 35;
	}

	kill() {
		for (var i = 0; i < placedBlocks.length; i++) {
			if (placedBlocks[i] == this) {
				placedBlocks.splice(i, 1);
				//addParticles(this.x, this.y, this.width, this.height);
				break;
			}
		}
	}

	draw() {
		c.beginPath();
		c.moveTo(this.x, this.y);
		c.lineTo(this.x + this.width, this.y);
		c.lineTo(this.x + this.width, this.y + this.height);
		c.lineTo(this.x, this.y + this.height);
		c.closePath();
		c.fillStyle = this.color;
		c.strokeStyle = "#000000";
		c.fill();
		c.stroke();
	}

	testCollision() {
		this.floorCollision = false;
		this.bottomBlockCollision = false;
		this.leftWallTouching = false;
		this.rightWallTouching = false;

		if (this.y + this.height >= ui.floor) {
			this.floorCollision = true;
		}

		if (this.x == ui.leftWall) {
			this.leftWallTouching = true;
		}

		if (this.x + this.width == ui.rightWall) {
			this.rightWallTouching = true;
		}

		if (placedBlocks.length > 0) {
			for (var i = placedBlocks.length - 1; i >= 0; i--) {
				let pBlock = placedBlocks[i];

				if (this.y + this.height == pBlock.y && this.x == pBlock.x) {
					this.floorCollision = true;
				}
			}
		}

		if (placedBlocks.length > 0) {
			for (var i = placedBlocks.length - 1; i >= 0; i--) {
				let pBlock = placedBlocks[i];

				if (this.y == pBlock.y && this.x == pBlock.x + pBlock.width) {
					this.leftWallTouching = true;
				}
			}
		}

		if (placedBlocks.length > 0) {
			for (var i = placedBlocks.length - 1; i >= 0; i--) {
				let pBlock = placedBlocks[i];

				if (this.y == pBlock.y && this.x + this.width == pBlock.x) {
					this.rightWallTouching = true;
				}
			}
		}
	}

	update() {
		const that = this;

		this.testCollision();
		this.draw();
	}
}

class blockGroup {
	constructor() {
		this.numberOfBlocks = 4;
		this.blockList = [];

		this.currentTime = Date.now();
		this.floorCollision = false;

		this.locked = 0; //0 for unlocked, 1 for locking, 2 for locked
		this.lockedTime = undefined;
	}

	testCollision() {
		this.floorCollision = false;
		this.locked = 0;
		for (var i = this.blockList.length - 1; i >= 0; i--) {
			if (this.blockList[i].floorCollision == true) {
				this.floorCollision = true;
				this.locked = 1;
				if (this.lockedTime == undefined) {
					this.lockedTime = Date.now();
				}
			}
		}

		this.leftWallTouching = false;
		for (var i = this.blockList.length - 1; i >= 0; i--) {
			if (this.blockList[i].leftWallTouching == true) {
				this.leftWallTouching = true;
			}
		}

		this.rightWallTouching = false;
		for (var i = this.blockList.length - 1; i >= 0; i--) {
			if (this.blockList[i].rightWallTouching == true) {
				this.rightWallTouching = true;
			}
		}
	}

	hardDown() {
		while (this.floorCollision == false) {
			for (var i = 0; i < this.blockList.length; i++) {
				this.blockList[i].y += 35;
				this.blockList[i].update();
			}
			this.testCollision();
		}
	}
	moveRight() {
		if (!this.rightWallTouching) {
			for (var i = this.blockList.length - 1; i >= 0; i--) {
				this.blockList[i].moveRight();
			}
		}

		this.lockedTime = Date.now();
	}

	moveLeft() {
		if (!this.leftWallTouching) {
			for (var i = this.blockList.length - 1; i >= 0; i--) {
				this.blockList[i].moveLeft();
			}
		}
		this.lockedTime = Date.now();
	}

	update() {
		const that = this;
		let currentTime = Date.now();

		this.testCollision();

		for (var i = this.numberOfBlocks - 1; i >= 0; i--) {
			let block = this.blockList[i];

			if (currentTime >= lastRecordedMove + gameSpeed) {
				if (!this.floorCollision) {
					block.moveDown();
				}

				if (i == 0) {
					lastRecordedMove = currentTime;
				}
			}

			block.update();
		}

		if (this.locked == 1 && currentTime >= this.lockedTime + lockDelay) {
			this.locked = 2;
		}
	}
}

class iBlock extends blockGroup {
	constructor() {
		super();
		for (var i = this.numberOfBlocks - 1; i >= 0; i--) {
			this.blockList.push(new Block(ui.x + 35 * 3 + 35 * i, 50, "#4CDEDE"));
		}

		this.state = 1;
	}

	rotate() {
		let allowedRotation = true;

		if (allowedRotation) {
			let axisOfRotation = {
				x: this.blockList[1].x,
				y: this.blockList[1].y
			};
			if (this.state == 0 && this.leftWallTouching) {
				axisOfRotation.x = this.blockList[1].x + 35;
			}

			if (this.state == 1 && this.floorCollision) {
				axisOfRotation.y = this.blockList[1].y - 35 * 2;
			}

			for (var i = this.blockList.length - 1; i >= 0; i--) {
				this.blockList[i].x = axisOfRotation.x;
				this.blockList[i].y = axisOfRotation.y;
			}

			if (this.state == 0) {
				this.blockList[0].x -= 35;
				this.blockList[2].x += 35;
				this.blockList[3].x += 2 * 35;

				this.state++;
			} else if (this.state == 1) {
				this.blockList[0].y -= 35;
				this.blockList[2].y += 35;
				this.blockList[3].y += 2 * 35;
				this.state--;
			}
		}
	}
}

class oBlock extends blockGroup {
	constructor() {
		super();

		this.blockList.push(new Block(ui.x + 35 * 4, 50, "#FFF246"));
		this.blockList.push(new Block(ui.x + 35 * 5, 50, "#FFF246"));
		this.blockList.push(new Block(ui.x + 35 * 4, 50 + 35, "#FFF246"));
		this.blockList.push(new Block(ui.x + 35 * 5, 50 + 35, "#FFF246"));
		this.state = 0;
	}

	rotate() {
		return;
	}
}

class tBlock extends blockGroup {
	constructor() {
		super();
		this.blockList.push(new Block(ui.x + 35 * 5, 50, "#A054DE"));
		this.blockList.push(new Block(ui.x + 35 * 4, 50 + 35, "#A054DE"));
		this.blockList.push(new Block(ui.x + 35 * 5, 50 + 35, "#A054DE"));
		this.blockList.push(new Block(ui.x + 35 * 6, 50 + 35, "#A054DE"));

		this.state = 0;
	}
	rotate() {
		let axisOfRotation;

		if (this.state == 0) {
			axisOfRotation = {
				x: this.blockList[2].x,
				y: this.blockList[2].y
			};

			for (var i = this.blockList.length - 1; i >= 0; i--) {
				this.blockList[i].x = axisOfRotation.x;
				this.blockList[i].y = axisOfRotation.y;
			}

			this.blockList[0].y = axisOfRotation.y - 35;
			this.blockList[2].y = axisOfRotation.y + 35;
			this.blockList[3].x = axisOfRotation.x + 35;

			this.state++;
		} else if (this.state == 1) {
			axisOfRotation = {
				x: this.blockList[1].x,
				y: this.blockList[1].y
			};

			for (var i = this.blockList.length - 1; i >= 0; i--) {
				this.blockList[i].x = axisOfRotation.x;
				this.blockList[i].y = axisOfRotation.y;
			}

			this.blockList[0].x = axisOfRotation.x - 35;
			this.blockList[2].x = axisOfRotation.x + 35;
			this.blockList[3].y = axisOfRotation.y + 35;

			this.state++;
		} else if (this.state == 2) {
			axisOfRotation = {
				x: this.blockList[1].x,
				y: this.blockList[1].y
			};

			for (var i = this.blockList.length - 1; i >= 0; i--) {
				this.blockList[i].x = axisOfRotation.x;
				this.blockList[i].y = axisOfRotation.y;
			}

			this.blockList[0].y = axisOfRotation.y - 35;
			this.blockList[2].y = axisOfRotation.y + 35;
			this.blockList[3].x = axisOfRotation.x - 35;

			this.state++;
		} else if (this.state == 3) {
			axisOfRotation = {
				x: this.blockList[1].x,
				y: this.blockList[1].y
			};

			for (var i = this.blockList.length - 1; i >= 0; i--) {
				this.blockList[i].x = axisOfRotation.x;
				this.blockList[i].y = axisOfRotation.y;
			}

			this.blockList[0].x = axisOfRotation.x - 35;
			this.blockList[1].x = axisOfRotation.x + 35;
			this.blockList[3].y = axisOfRotation.y - 35;

			this.state = 0;
		}
	}
}

class sBlock extends blockGroup {
	constructor() {
		super();
		this.blockList.push(new Block(ui.x + 35 * 5, 50, "#3ACC3C"));
		this.blockList.push(new Block(ui.x + 35 * 4, 50, "#3ACC3C"));
		this.blockList.push(new Block(ui.x + 35 * 4, 50 + 35, "#3ACC3C"));
		this.blockList.push(new Block(ui.x + 35 * 3, 50 + 35, "#3ACC3C"));

		this.state = 0;
	}

	rotate() {
		let axisOfRotation;
		if (this.state == 0) {
			axisOfRotation = {
				x: this.blockList[1].x,
				y: this.blockList[1].y
			};

			for (var i = this.blockList.length - 1; i >= 0; i--) {
				this.blockList[i].x = axisOfRotation.x;
				this.blockList[i].y = axisOfRotation.y;
			}

			this.blockList[1].x -= 35;
			this.blockList[2].x -= 35;
			this.blockList[2].y -= 35;
			this.blockList[3].y += 35;

			this.state++;
		} else if (this.state == 1) {
			axisOfRotation = {
				x: this.blockList[1].x,
				y: this.blockList[1].y
			};

			for (var i = this.blockList.length - 1; i >= 0; i--) {
				this.blockList[i].x = axisOfRotation.x;
				this.blockList[i].y = axisOfRotation.y;
			}

			this.blockList[0].x += 35;
			this.blockList[1].x += 35;
			this.blockList[1].y -= 35;
			this.blockList[2].x += 70;
			this.blockList[2].y -= 35;

			this.state = 0;
		}
	}
}

class zBlock extends blockGroup {
	constructor() {
		super();
		this.blockList.push(new Block(ui.x + 35 * 3, 50, "#EB4D4C"));
		this.blockList.push(new Block(ui.x + 35 * 4, 50, "#EB4D4C"));
		this.blockList.push(new Block(ui.x + 35 * 4, 50 + 35, "#EB4D4C"));
		this.blockList.push(new Block(ui.x + 35 * 5, 50 + 35, "#EB4D4C"));

		this.state = 0;
	}

	rotate() {
		let axisOfRotation;
		if (this.state == 0) {
			axisOfRotation = {
				x: this.blockList[1].x,
				y: this.blockList[1].y
			};

			for (var i = this.blockList.length - 1; i >= 0; i--) {
				this.blockList[i].x = axisOfRotation.x;
				this.blockList[i].y = axisOfRotation.y;
			}

			this.blockList[1].x += 35;
			this.blockList[2].x += 35;
			this.blockList[2].y -= 35;
			this.blockList[3].y += 35;

			this.state++;
		} else if (this.state == 1) {
			axisOfRotation = {
				x: this.blockList[1].x,
				y: this.blockList[1].y
			};

			for (var i = this.blockList.length - 1; i >= 0; i--) {
				this.blockList[i].x = axisOfRotation.x;
				this.blockList[i].y = axisOfRotation.y;
			}

			this.blockList[1].x -= 35;
			this.blockList[0].y -= 35;
			this.blockList[0].x -= 35;
			this.blockList[2].y -= 35;
			this.blockList[2].x -= 35 * 2;

			this.state = 0;
		}
	}
}

class jBlock extends blockGroup {
	constructor() {
		super();
		this.blockList.push(new Block(ui.x + 35 * 4, 50, "#4275DD"));
		this.blockList.push(new Block(ui.x + 35 * 4, 50 + 35, "#4275DD"));
		this.blockList.push(new Block(ui.x + 35 * 5, 50 + 35, "#4275DD"));
		this.blockList.push(new Block(ui.x + 35 * 6, 50 + 35, "#4275DD"));

		this.state = 0;
	}

	rotate() {
		let axisOfRotation;
		if (this.state == 0) {
			axisOfRotation = {
				x: this.blockList[1].x,
				y: this.blockList[1].y
			};

			for (var i = this.blockList.length - 1; i >= 0; i--) {
				this.blockList[i].x = axisOfRotation.x;
				this.blockList[i].y = axisOfRotation.y;
			}

			this.blockList[1].y -= 35;
			this.blockList[2].y += 35;
			this.blockList[3].y -= 35;
			this.blockList[3].x += 35;

			this.state++;
		} else if (this.state == 1) {
			axisOfRotation = {
				x: this.blockList[1].x,
				y: this.blockList[1].y
			};

			for (var i = this.blockList.length - 1; i >= 0; i--) {
				this.blockList[i].x = axisOfRotation.x;
				this.blockList[i].y = axisOfRotation.y;
			}

			this.blockList[1].x -= 35;
			this.blockList[2].x += 35;
			this.blockList[3].x += 35;
			this.blockList[3].y += 35;

			this.state++;
		} else if (this.state == 2) {
			axisOfRotation = {
				x: this.blockList[0].x,
				y: this.blockList[0].y
			};

			for (var i = this.blockList.length - 1; i >= 0; i--) {
				this.blockList[i].x = axisOfRotation.x;
				this.blockList[i].y = axisOfRotation.y;
			}

			this.blockList[1].y += 35;
			this.blockList[2].y += 35 * 2;
			this.blockList[3].y += 35 * 2;
			this.blockList[3].x -= 35;

			this.state++;
		} else if (this.state == 3) {
			axisOfRotation = {
				x: this.blockList[0].x,
				y: this.blockList[0].y
			};

			for (var i = this.blockList.length - 1; i >= 0; i--) {
				this.blockList[i].x = axisOfRotation.x;
				this.blockList[i].y = axisOfRotation.y;
			}

			this.blockList[0].x += 35;
			this.blockList[0].y += 35;
			this.blockList[1].y += 35;
			this.blockList[2].x -= 35;
			this.blockList[2].y += 35;
			this.blockList[3].x -= 35;

			this.state = 0;
		}
	}
}

class lBlock extends blockGroup {
	constructor() {
		super();
		this.blockList.push(new Block(ui.x + 35 * 6, 50, "#FDA82E"));
		this.blockList.push(new Block(ui.x + 35 * 4, 50 + 35, "#FDA82E"));
		this.blockList.push(new Block(ui.x + 35 * 5, 50 + 35, "#FDA82E"));
		this.blockList.push(new Block(ui.x + 35 * 6, 50 + 35, "#FDA82E"));

		this.state = 0;
	}

	rotate() {
		let axisOfRotation;
		if (this.state == 0) {
			axisOfRotation = {
				x: this.blockList[1].x,
				y: this.blockList[1].y
			};

			for (var i = this.blockList.length - 1; i >= 0; i--) {
				this.blockList[i].x = axisOfRotation.x;
				this.blockList[i].y = axisOfRotation.y;
			}

			this.blockList[0].y -= 35;

			this.blockList[2].y += 35;

			this.blockList[3].y += 35;
			this.blockList[3].x += 35;
			this.state++;
		} else if (this.state == 1) {
			axisOfRotation = {
				x: this.blockList[0].x,
				y: this.blockList[0].y
			};

			for (var i = this.blockList.length - 1; i >= 0; i--) {
				this.blockList[i].x = axisOfRotation.x;
				this.blockList[i].y = axisOfRotation.y;
			}

			this.blockList[1].y += 35;
			this.blockList[2].x += 35;
			this.blockList[3].x += 35 * 2;

			this.state++;
		} else if (this.state == 2) {
			axisOfRotation = {
				x: this.blockList[1].x,
				y: this.blockList[1].y
			};

			for (var i = this.blockList.length - 1; i >= 0; i--) {
				this.blockList[i].x = axisOfRotation.x;
				this.blockList[i].y = axisOfRotation.y;
			}

			this.blockList[0].y -= 35;

			this.blockList[1].x += 35;
			this.blockList[1].y -= 35;

			this.blockList[2].x += 35;

			this.blockList[3].x += 35;
			this.blockList[3].y += 35;

			this.state++;
		} else if (this.state == 3) {
			axisOfRotation = {
				x: this.blockList[3].x,
				y: this.blockList[3].y
			};

			for (var i = this.blockList.length - 1; i >= 0; i--) {
				this.blockList[i].x = axisOfRotation.x;
				this.blockList[i].y = axisOfRotation.y;
			}

			this.blockList[1].x -= 35;

			this.blockList[2].x -= 35;
			this.blockList[2].y -= 35;

			this.blockList[3].x += 35;

			this.state = 0;
		}
	}
}

var ui = new UI();
var currentBlock;
newBlock();

var placedBlocks = [];

function init() {
	animate();
}

function newBlock() {
	let int = getRandomInt(0, 7);

	switch (int) {
		case 0:
			currentBlock = new iBlock();
			break;
		case 1:
			currentBlock = new oBlock();
			break;
		case 2:
			currentBlock = new tBlock();
			break;
		case 3:
			currentBlock = new sBlock();
			break;
		case 4:
			currentBlock = new zBlock();
			break;
		case 5:
			currentBlock = new jBlock();
			break;
		case 6:
			currentBlock = new lBlock();
			break;

	}
}

function clearLines() {
	//Sorts placed blocks by y
	function ascending(a, b) {
		if (a.y < b.y) return -1;
		if (a.y > b.y) return 1;
		return 0;
	}

	if (placedBlocks.length > 0) {
		placedBlocks.sort(ascending);

		//Checks if 10 in a row...
		let counter = 0;
		let levelsToRemove = [];
		for (var i = 0; i < placedBlocks.length; i++) {
			if (i == 0) {
				counter++;
			} else {
				if (placedBlocks[i].y == placedBlocks[i - 1].y) {
					counter++;
				} else {
					counter = 1;
				}

				if (counter == 10) {
					levelsToRemove.push(placedBlocks[i].y);
					score++;
					counter = 1;
				}
			}
		}

		for (var i = levelsToRemove.length - 1; i >= 0; i--) {
			for (var block = placedBlocks.length - 1; block >= 0; block--) {
				if (placedBlocks[block].y == levelsToRemove[i]) {
					placedBlocks[block].kill();
				}
			}
		}

		return levelsToRemove;
	}
	return [];
}

function pushBlocksDown(levelsToRemove) {
	let blocksToPush = [];
	for (var i = 0; i < levelsToRemove.length; i++) {
		let level = levelsToRemove[i];

		//Push down all blocks above level
		for (var block = 0; block < placedBlocks.length; block++) {
			if (placedBlocks[block].y < level) {
				blocksToPush.push(placedBlocks[block]);
			}
		}
	}

	if (blocksToPush.length > 0) {
		for (var i = 0; i < blocksToPush.length; i++) {
			blocksToPush[i].y += 35;
		}
	}
}

function speedUp() {
	if (score >= 0) {
		gameSpeed = 500;
	}
	if (score >= 10) {
		gameSpeed = 450;
	}

	if (score >= 20) {
		gameSpeed = 400;
	}

	if (score >= 30) {
		gameSpeed = 350;
	}

	if (score >= 40) {
		gameSpeed = 300;
	}

	if (score >= 50) {
		gameSpeed = 250;
	}

	if (score >= 60) {
		gameSpeed = 200;
	}

	if (score >= 70) {
		gameSpeed = 150;
	}

	if (score >= 80) {
		gameSpeed = 100;
	}

	if (score >= 90) {
		gameSpeed = 50;
	}
}

function animate() {
	if (run == true) {
		requestAnimationFrame(animate);
		c.clearRect(0, 0, canvas.width, canvas.height);

		ui.update();

		if (currentBlock.locked == 2) {
			for (var block = currentBlock.blockList.length - 1; block >= 0; block--) {
				placedBlocks.push(currentBlock.blockList[block]);
			}
			newBlock();
		}

		currentBlock.update();

		for (var i = placedBlocks.length - 1; i >= 0; i--) {
			placedBlocks[i].update();
		}

		let levelsToRemove = clearLines();
		if (levelsToRemove.length > 0) {
			pushBlocksDown(levelsToRemove);
		}

		speedUp();
	}
}

init();

/***/ })
/******/ ]);
//# sourceMappingURL=main.js.map