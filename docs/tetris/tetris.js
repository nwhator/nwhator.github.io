const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('next');
const nextCtx = nextCanvas && nextCanvas.getContext('2d');
const scoreElem = document.getElementById('score');
const linesElem = document.getElementById('lines');
const levelElem = document.getElementById('level');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');

// Mobile control buttons (if present)
const btnLeft = document.getElementById('btn-left');
const btnRight = document.getElementById('btn-right');
const btnRotate = document.getElementById('btn-rotate');
const btnDown = document.getElementById('btn-down');
const btnDrop = document.getElementById('btn-drop');

const COLS = 10;
const ROWS = 20;
const BLOCK = 30; // logical block size

// Set canvas internal resolution for crisp rendering on high-DPI devices
const dpr = window.devicePixelRatio || 1;
canvas.width = COLS * BLOCK * dpr;
canvas.height = ROWS * BLOCK * dpr;
canvas.style.width = (COLS * BLOCK) + 'px';
canvas.style.height = (ROWS * BLOCK) + 'px';
ctx.scale(BLOCK * dpr, BLOCK * dpr);

if(nextCanvas && nextCtx){
  nextCanvas.width = 4 * BLOCK * dpr; // 4 blocks across for preview
  nextCanvas.height = 4 * BLOCK * dpr;
  nextCanvas.style.width = '120px';
  nextCanvas.style.height = '120px';
  nextCtx.scale(BLOCK * dpr, BLOCK * dpr);
}

function createMatrix(w, h){
  const m = [];
  while(h--) m.push(new Array(w).fill(0));
  return m;
}

function createPiece(type){
  switch(type){
    case 'T': return [[0,0,0],[1,1,1],[0,1,0]];
    case 'O': return [[2,2],[2,2]];
    case 'L': return [[0,3,0],[0,3,0],[0,3,3]];
    case 'J': return [[0,4,0],[0,4,0],[4,4,0]];
    case 'I': return [[0,5,0,0],[0,5,0,0],[0,5,0,0],[0,5,0,0]];
    case 'S': return [[0,6,6],[6,6,0],[0,0,0]];
    case 'Z': return [[7,7,0],[0,7,7],[0,0,0]];
  }
}

const colors = [null,'#ff6b6b','#ffd166','#ffd966','#6bf7ff','#a78bfa','#66f0a3','#ffb86b'];

function drawMatrix(matrix, offset){
  matrix.forEach((row,y)=>{
    row.forEach((value,x)=>{
      if(value){
        ctx.fillStyle = colors[value];
        ctx.fillRect(x+offset.x, y+offset.y, 1, 1);
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.lineWidth = 0.03;
        ctx.strokeRect(x+offset.x, y+offset.y, 1, 1);
      }
    });
  });
}

function merge(arena, player){
  player.matrix.forEach((row,y)=>{
    row.forEach((value,x)=>{
      if(value) arena[y + player.pos.y][x + player.pos.x] = value;
    });
  });
}

function collide(arena, player){
  const m = player.matrix;
  const o = player.pos;
  for(let y=0;y<m.length;y++){
    for(let x=0;x<m[y].length;x++){
      if(m[y][x] && (arena[y+o.y] && arena[y+o.y][x+o.x]) !== 0){
        return true;
      }
    }
  }
  return false;
}

// Rotate returns a new rotated matrix (safe for non-square matrices)
function rotate(matrix, dir){
  const h = matrix.length;
  const w = matrix[0].length;
  // create transposed matrix of size w x h
  const rotated = Array.from({length: w}, () => new Array(h).fill(0));
  for(let y=0;y<h;y++){
    for(let x=0;x<w;x++){
      rotated[x][y] = matrix[y][x];
    }
  }
  if(dir > 0) rotated.forEach(row => row.reverse());
  else rotated.reverse();
  return rotated;
}

// Bag / queue based piece generator for better randomness
let bag = [];
function refillBag(){
  bag = 'TJLOSZI'.split('');
  for(let i = bag.length -1; i>0; i--){
    const j = Math.floor(Math.random() * (i+1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
}

const nextQueue = [];
function ensureQueue(){
  while(nextQueue.length < 3){
    if(bag.length === 0) refillBag();
    const t = bag.shift();
    nextQueue.push(createPiece(t));
  }
}

function deepCopyMatrix(m){
  return m.map(row => row.slice());
}

function playerReset(){
  ensureQueue();
  // take the next piece and deep-copy it so later rotations don't mutate the queued prototype
  player.matrix = deepCopyMatrix(nextQueue.shift());
  ensureQueue();
  if(collide(arena, player)){
    arena.forEach(row => row.fill(0));
    score = 0; lines = 0; level = 0; updateScore();
  }
}

function playerDrop(){
  player.pos.y++;
  if(collide(arena, player)){
    player.pos.y--;
    merge(arena, player);
    sweep();
    playerReset();
  }
  dropCounter = 0;
}

function playerMove(dir){
  player.pos.x += dir;
  if(collide(arena, player)) player.pos.x -= dir;
}

function playerRotate(dir){
  const pos = player.pos.x;
  const oldMatrix = player.matrix;
  const rotated = rotate(oldMatrix, dir);
  player.matrix = rotated;
  let offset = 1;
  while(collide(arena, player)){
    player.pos.x += offset;
    offset = -(offset + (offset>0?1:-1));
    if(offset > rotated[0].length){
      // revert
      player.matrix = oldMatrix;
      player.pos.x = pos;
      return;
    }
  }
}

function sweep(){
  let rowCount = 0;
  outer: for(let y = arena.length -1; y>0; --y){
    for(let x=0;x<arena[y].length;x++){
      if(arena[y][x] === 0) continue outer;
    }
    const row = arena.splice(y,1)[0].fill(0);
    arena.unshift(row);
    ++y;
    rowCount++;
  }
  if(rowCount>0){
    lines += rowCount;
    score += (rowCount * 100) * (rowCount);
    level = Math.floor(lines/10);
    updateScore();
  }
}

function updateScore(){
  scoreElem.textContent = score;
  linesElem.textContent = lines;
  levelElem.textContent = level;
}

function draw(){
  // Clear main canvas (logical units)
  ctx.fillStyle = '#071229';
  ctx.fillRect(0,0,COLS,ROWS);
  drawMatrix(arena, {x:0,y:0});
  drawMatrix(player.matrix, player.pos);
  drawNext();
}

function drawNext(){
  if(!nextCtx) return;
  // clear next canvas (4x4 logical area)
  nextCtx.clearRect(0,0,4,4);
  if(nextQueue.length === 0) return;
  const next = nextQueue[0];
  const offset = {x: Math.floor((4 - next[0].length)/2) + 0.5, y: Math.floor((4 - next.length)/2) + 0.5};
  next.forEach((row,y)=>{
    row.forEach((val,x)=>{
      if(val){
        nextCtx.fillStyle = colors[val];
        nextCtx.fillRect(x + offset.x, y + offset.y, 1, 1);
        nextCtx.strokeStyle = 'rgba(0,0,0,0.2)';
        nextCtx.lineWidth = 0.03;
        nextCtx.strokeRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

let arena = createMatrix(COLS, ROWS);
let player = {pos:{x:0,y:0}, matrix:null};
let score = 0; let lines = 0; let level = 0;
let dropCounter = 0; let dropInterval = 1000;
let lastTime = 0;

function update(time = 0){
  const deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;
  if(!paused){
    const speed = Math.max(100, dropInterval - level*100);
    if(dropCounter > speed){
      playerDrop();
    }
    draw();
  } else {
    draw();
  }
  requestAnimationFrame(update);
}

function init(){
  arena = createMatrix(COLS, ROWS);
  player.pos.y = 0; player.pos.x = Math.floor(COLS/2) -1;
  bag = [];
  nextQueue.length = 0;
  refillBag();
  ensureQueue();
  player.matrix = nextQueue.shift();
  score = 0; lines = 0; level = 0; updateScore();
  lastTime = 0; dropCounter = 0; requestAnimationFrame(update);
}

let paused = false;
document.addEventListener('keydown', event=>{
  if(event.key === 'p' || event.key === 'P'){
    paused = !paused;
    if(pauseBtn) pauseBtn.textContent = paused ? 'Resume' : 'Pause';
    return;
  }
  if(paused) return;
  if(event.keyCode === 37) playerMove(-1);
  else if(event.keyCode === 39) playerMove(1);
  else if(event.keyCode === 40) playerDrop();
  else if(event.keyCode === 38) playerRotate(1);
  else if(event.code === 'Space'){
    // hard drop
    while(!collide(arena, player)) player.pos.y++;
    player.pos.y--;
    merge(arena, player);
    sweep();
    playerReset();
    dropCounter = 0;
  }
});

if(pauseBtn) pauseBtn.addEventListener('click', ()=>{
  paused = !paused;
  pauseBtn.textContent = paused ? 'Resume' : 'Pause';
});

// Mobile touch buttons (if exist)
if(btnLeft){ btnLeft.addEventListener('touchstart', e=>{ e.preventDefault(); playerMove(-1); }); }
if(btnRight){ btnRight.addEventListener('touchstart', e=>{ e.preventDefault(); playerMove(1); }); }
if(btnRotate){ btnRotate.addEventListener('touchstart', e=>{ e.preventDefault(); playerRotate(1); }); }
if(btnDown){ btnDown.addEventListener('touchstart', e=>{ e.preventDefault(); playerDrop(); }); }
if(btnDrop){ btnDrop.addEventListener('touchstart', e=>{ e.preventDefault(); while(!collide(arena, player)) player.pos.y++; player.pos.y--; merge(arena, player); sweep(); playerReset(); dropCounter = 0; }); }

startBtn.addEventListener('click', ()=>{
  paused = false; if(pauseBtn) pauseBtn.textContent = 'Pause';
  init();
});

// Start on load for convenience
init();
