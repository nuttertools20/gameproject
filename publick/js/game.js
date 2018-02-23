window.onload = init;

let map;
let mapCtx;
let drawBtn;
let clearBtn;
let gameWidth = 900;
let gameHeight = 800;
let pl;
let plCtx;
let player;
let enemies = [];
let enCtx;
let en;
let bullets = [];
let bull;
let bullCtx;
// let blasters = [];
// let blast;
// let blastCtx;
let explosives = [];
let expl;
let explCtx;
let stats;
let statsCtx;
let isPlaying;
let health;
let mapY = 0;
let mapY1 = -gameHeight;
let background = new Image();
background.src = "images/space.jpg";
let background1 = new Image();
background1.src = "images/space.jpg";
let tiles = new Image();
tiles.src = "images/tiles.png";
let requestAnimFrame = window.requestAnimationFrame ||
					   window.webkitRequestAnimationFrame ||
					   window.mozRequestAnimationFrame ||
					   window.oRequestAnimationFrame ||
					   window.msRequestAnimationFrame;
let spawnInterval;
let countEnemies = 1;					   
function init() {
	map = document.getElementById("map");
	mapCtx = map.getContext("2d");
	pl = document.getElementById("player");
	plCtx = pl.getContext("2d");
	en = document.getElementById("enemy");
	enCtx = en.getContext("2d");
	bull = document.getElementById("bullet");
	bullCtx = bull.getContext("2d");
	bullCtx1 = bull.getContext("2d");
	// blast = document.getElementById("blast");
	// blastCtx = blast.getContext("2d");
	expl = document.getElementById("explosive");
	explCtx = expl.getContext("2d");
	stats = document.getElementById("stats");
	statsCtx = stats.getContext("2d");
	map.width = gameWidth;
	map.height = gameHeight;
	pl.width = gameWidth;
	pl.height = gameHeight;
	en.width = gameWidth;
	en.height = gameHeight;
	bull.width = gameWidth;
	bull.height = gameHeight;
	// blast.width = gameWidth;
	// blast.height = gameHeight;
	expl.width = gameWidth;
	expl.height = gameHeight;
	stats.width = gameWidth;
	stats.height = gameHeight;
	statsCtx.fillStyle = "#2D30A1";
	statsCtx.font = "bold 20pt courier";
	player = new Player();
	health = 100;
	startloop();	
	createEnemy();
	document.addEventListener("keydown", checkKeyDown, false);
	document.addEventListener("keyup", checkKeyUp, false);
}

loop = ()=>{
	if (isPlaying){
		draw();
		update();
		requestAnimFrame(loop);
	}
}
startloop = ()=>{
	isPlaying = true;
	loop();	
}
stoploop = ()=>{
	isPlaying = false;
}
update = ()=>{
	drawBg();
	moveBg();
	player.chooseDir();
	player.borderForPlayer();
	informStats();
	player.playerHealth();
	for(let i = 0; i < enemies.length; i++){
		enemies[i].update();	
	}
	for(let i = 0; i < bullets.length; i++){
		bullets[i].update();
	}

}
moveBg = ()=>{
	let val = 4;
	mapY += 10;
	mapY1 += 10;
	if(mapY >gameHeight){
		mapY = -gameHeight + 10;
	}
	if(mapY1 >gameHeight){
		mapY1 = -gameHeight + 10;
	}
}
draw = ()=>{
	player.draw();
	clearEnemy();
	clearBullet();
	for(let i = 0; i < enemies.length; i++){
		enemies[i].draw();	
	}
	for(let i = 0; i < bullets.length; i++){
		bullets[i].draw();
	}
}
resetHealth = ()=>{
	if(health <= 0){
		health = 100;
	}
}
let Player = function(){
	let isUp = false; 
	let isDown = false; 
	let isLeft = false; 
	let isRight = false;
	let fire = false; 
	let srcX = 0;
	let srcY = 0;
	this.drawX = 200;
	this.drawY = 650;
	height = 120;
	width = 120;
	this.speed = 12;
	this.draw = ()=>{
		this.clearPlayer();
		plCtx.drawImage(tiles, srcX, srcY, width, height, 
		this.drawX, this.drawY, width, height);
	}
	this.clearPlayer = ()=>{
		plCtx.clearRect(0, 0, gameWidth, gameHeight);
	}
	
	this.chooseDir = ()=>{
		if(this.isUp)
			this.drawY -= this.speed;
		if(this.isDown)
			this.drawY += this.speed;
		if(this.isRight)
			this.drawX += this.speed;
		if(this.isLeft)
			this.drawX -= this.speed;
		if(this.fire){
			bullet();
		}		
	}
	this.borderForPlayer = ()=>{
		if(this.drawX < 0) this.drawX = 0;
		if(this.drawX > gameWidth - width+45) this.drawX = gameWidth - width+45;
		if(this.drawY < 0)  this.drawY = 0;  
		if(this.drawY > gameHeight - height +30)  this.drawY = gameHeight - height +30; 
	}
	this.playerHealth = ()=>{
		for(let i = 0; i < enemies.length; i++){
			if(
			   this.drawX + 20 >= enemies[i].drawX &&
			   this.drawY + 50>= enemies[i].drawY &&
			   this.drawY + 50<= enemies[i].drawY + height &&
			   this.drawX + 20 <= enemies[i].drawX + width 
			   ){
				 health--;
				resetHealth();
				}
			if(
			   this.drawX - 46 <= enemies[i].drawX  &&
			   this.drawY <= enemies[i].drawY &&
			   this.drawY >= enemies[i].drawY - height &&
			   this.drawX - 46 >= enemies[i].drawX - width 
			   ){
				 health--;
				resetHealth();
				}
		}
	}
}

let Bullet = function(){
	let srcX = 0;
	let srcY = 347;
	this.drawX = player.drawX;
	this.drawX1 = player.drawX + 67;
	this.drawY = player.drawY-6;
	height = 120;
	width = 120;
	speed = 12;
	
	this.draw = ()=>{
		bullCtx.drawImage(tiles, srcX, srcY, width, height, 
		this.drawX, this.drawY, width, height);	
		bullCtx1.drawImage(tiles, srcX, srcY, width, height, 
		this.drawX1, this.drawY, width, height);	
	}
	this.update = ()=>{	
		this.drawY -= speed;
		if(this.drawY < 0){
			this.deleteBullet();
		}
	}	
	this.deleteBullet = ()=>{
		bullets.splice(bullets.indexOf(this), 1);
	}
} 
function bullet(){
	for(let i = 0; i < 1; i++){
		bullets[i] = new Bullet();
	}
} 
function clearBullet() {
	bullCtx.clearRect(0, 0, gameWidth, gameHeight);
}

// let Blaster = function(){
// 	let srcX = 0;
// 	let srcY = 347;
// 	this.drawX;
// 	this.drawY;
// 	height = 120;
// 	width = 120;
// 	speed = 12;
	
// 	this.draw = ()=>{
// 		blastCtx.drawImage(tiles, srcX, srcY, width, height, 
// 		this.drawX, this.drawY, width, height);		
// 	}
// 	this.update = ()=>{	
// 		this.drawY -= speed;
// 		if(this.drawY > 800){
// 			this.deleteBlast();
// 		}
// 	}	
// 	this.deleteBlast = ()=>{
// 		blasters.splice(blasters.indexOf(this), 1);
// 	}
// } 
// function blaster(){
// 	for(let i = 0; i < 1; i++){
// 		blasters[i] = new Blaster();
// 	}
// } 
// function clearBlast() {
// 	blastCtx.clearRect(0, 0, gameWidth, gameHeight);
// }

let Explosive = function(){
	let srcX = 0;
	let srcY = 530;
	this.drawX;
	this.drawY;
	height = 120;
	width = 120;
	
	this.draw = ()=>{
		for(let i = 0; i < enemies.length; i++){
			this.drawX = enemies[i].drawX;  
			this.drawY = enemies[i].drawY; 
			explCtx.drawImage(tiles, srcX, srcY, width, height, 
			this.drawX, this.drawY, width, height);	
			}
		setInterval(()=>{
			clearExplosive();
			this.deleteExplosive();
		}, 1000);
			
	}	
	this.deleteExplosive = ()=>{
		explosives.splice(explosives.indexOf(this), 1);
	}
} 

function explosive(){
	for(let i = 0; i < 1; i++){
		explosives[i] = new Explosive();
		explosives[i].draw();
	}
} 

function clearExplosive() {
	explCtx.clearRect(0, 0, gameWidth, gameHeight);
}

function checkKeyDown(e){
	var keyID = e.keyCode || e.which;
	var keyChar = String.fromCharCode(keyID);

	if (keyChar == "W"){
		player.isUp = true;
		e.preventDefault();
	}
	if (keyChar == "S"){
		player.isDown = true;
		e.preventDefault();
	}
	if (keyChar == "D"){
		player.isRight = true;
		e.preventDefault();
	}
	if (keyChar == "A"){
		player.isLeft = true;
		e.preventDefault();
	}
	if (keyChar == "X"){
		player.fire = true;
		e.preventDefault();
	
	}
}
function checkKeyUp(e){
	var keyID = e.keyCode || e.which;
	var keyChar = String.fromCharCode(keyID);

	if (keyChar == "W"){
		player.isUp = false;
		e.preventDefault();
	}
	if (keyChar == "S"){
		player.isDown = false;
		e.preventDefault();
	}
	if (keyChar == "D"){
		player.isRight = false;
		e.preventDefault();
	}
	if (keyChar == "A"){
		player.isLeft = false;
		e.preventDefault();
	}	
	if (keyChar == "X"){
		player.fire = false;
		e.preventDefault();
	}	
}
let Enemy = function(){
	let srcX = 0;
	let srcY = 210;
	this.drawX = Math.floor(Math.random() * (gameWidth - 150));
	this.drawY = Math.floor(Math.random() * (-150));
	height = 120;
	width = 120;
	let speed = 8;
	this.draw = ()=>{
		enCtx.drawImage(tiles, srcX, srcY, width, height, 
		this.drawX, this.drawY, width, height);
	}
	this.update = ()=>{
		this.drawY += speed;
		if(this.drawY > gameHeight){
			this.deleteEnemy();
		}
		this.destroyEnemy();
		
	}
	this.deleteEnemy = ()=>{
		enemies.splice(enemies.indexOf(this), 1);
	}
	this.destroyEnemy = ()=>{
		for(let i = 0; i < bullets.length; i++){
			if(
			   this.drawX +110 >= bullets[i].drawX &&
			   this.drawY >= bullets[i].drawY &&
			   this.drawY <= bullets[i].drawY + height &&
			   this.drawX +110<= bullets[i].drawX + width ||
			   this.drawX +110>= bullets[i].drawX1 &&
			   this.drawY >= bullets[i].drawY &&
			   this.drawY <= bullets[i].drawY + height &&
			   this.drawX +110<= bullets[i].drawX1 + width
			   ){
				   	
					
					explosive();
					this.deleteEnemy();
					clearEnemy();
					bullets[i].deleteBullet();
					clearBullet();
			}
		}
		  for(let i = 0; i < bullets.length; i++){
			if(
			   this.drawX -17 <= bullets[i].drawX &&
			   this.drawY -150 <= bullets[i].drawY &&
			   this.drawY -150 >= bullets[i].drawY - height &&
			   this.drawX -17>= bullets[i].drawX - width ||
			   this.drawX -17<= bullets[i].drawX1 &&
			   this.drawY -150 <= bullets[i].drawY &&
			   this.drawY -150 >= bullets[i].drawY - height &&
			   this.drawX -17>= bullets[i].drawX1 - width 
			   ){
					
					explosive();
					this.deleteEnemy();
					clearEnemy();
					bullets[i].deleteBullet();
					clearBullet();
				}
			}		
	}		
}
clearEnemy = ()=>{
	enCtx.clearRect(0, 0, gameWidth, gameHeight);
}
spawnEnemy = function(count){
	for(let i = 0; i < count; i++){
		enemies[i] = new Enemy();
	}
}
createEnemy = ()=>{
	stopCreateEnemy();
	spawnInterval = setInterval(()=>{
		spawnEnemy(countEnemies);
	}, 3000);
}
stopCreateEnemy = ()=>{
	clearInterval(spawnInterval);	
}
// drawRect = ()=>{
// 	mapCtx.fillStyle = "red";
// 	mapCtx.fillRect(10, 10, 100, 100);
// }
informStats = ()=>{
	statsCtx.clearRect(0, 0, gameWidth, gameHeight);	
	statsCtx.fillText("HEALTH:" + health, 10, 20);
}
clearRect = ()=>{
	mapCtx.clearRect(0, 0, gameWidth, gameHeight);
}
drawBg = ()=>{
	mapCtx.clearRect(0, 0, gameWidth, gameHeight);
	mapCtx.drawImage(background, 0, 0, 800, 480, 
		0, mapY, gameWidth, gameHeight);
	mapCtx.drawImage(background1, 0, 0, 800, 480, 
		0, mapY1, gameWidth, gameHeight);
}
