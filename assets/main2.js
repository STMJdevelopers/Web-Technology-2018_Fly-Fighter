let btnMulai = document.getElementById('mulai'),
    c = document.getElementById('canvas'),
    scoreShow = document.getElementById('score'),
    livesShow = document.getElementById('nyawa'),
    text = document.getElementsByClassName('instruction'),
    banner1 = document.getElementsByClassName('banner1'),
    banner2 = document.getElementsByClassName('banner2');


let score = 0;
let lives = 10;

let ctx = c.getContext('2d');

let imgShip = new Image(),
    imgEnemy = new Image(),
    laserAudio = new Audio();

let peluru = [],
    enemy = [];

let bAtas = 10,
    bBawah = 130,
    bKiri = 10,
    bKanan = 280;

ship = {
    x: bKanan / 2,
    y: bBawah
}

for (i = 0; i < 5; i++) {
    enemy[i] = {
        x: bKiri + i * 65,
        y: bAtas,
        status: "live"
    }
}

for (i = 0; i < 3; i++) {
    peluru[i] = {
        x: ship.x + 5,
        y: ship.y + 4,
        width: 2,
        height: 10,
        status: 'ready',
        inscr: true
    }
}


imgShip.src = '/assets/ship.png';
imgEnemy.src = '/assets/musuh.png';
laserAudio.src = '/assets/laser.mp3';

var reload = function () {
    for (i = 0; i < 3; i++) {
        peluru[i] = {
            x: ship.x + 5,
            y: ship.y + 4,
            width: 2,
            height: 10,
            status: 'ready',
            inscr: true
        }
    }
}
var drawShip = function () {
    ctx.drawImage(imgShip, 0, 0, 50, 57, ship.x, ship.y, 50 / 4, 57 / 4);
}

var drawEnemy = function () {
    if (enemy[0].status == "dead" &&
        enemy[1].status == "dead" &&
        enemy[2].status == "dead" &&
        enemy[3].status == "dead" &&
        enemy[4].status == "dead") {
        for (i = 0; i < enemy.length; i++) {
            peluru[i] = {
                x: ship.x + 5,
                y: ship.y + 4,
                width: 2,
                height: 10,
                status: 'ready',
                inscr: true
            }
            // ctx.drawImage(imgEnemy, 0, 0, 50, 38, enemy[i].x, enemy[i].y, 50 / 4, 38 / 4);
        }
    } else {
        for (i = 0; i < enemy.length; i++) {
            // gambar ship seng urip
            if (enemy[i].status == "live") {
                enemy[i].y += .52;
                ctx.drawImage(imgEnemy, 0, 0, 50, 38, enemy[i].x, enemy[i].y, 50 / 4, 38 / 4);
            }
            if(ship.y <= enemy[i].y+50/4 && ship.y >= enemy[i].y){
                if (ship.x <= enemy[i].x + 50 / 4 && ship.x >= enemy[i].x){
                    lives -= 1;
                    for(j=0; j<enemy.length;j++){
                        enemy[j].y = -10;
                    }
                }
            }
            // lek musuh wis ngliwati wates
            if(enemy[i].y >= bBawah+10){
                lives -=1;
                for(j=0;j<enemy.length;j++){
                    enemy[j].y = -10;
                }
                return
            }
        }
    }
}

var drawPeluru = function () {
    if (peluru[0].status == "expired" && peluru[1].status == "expired" && peluru[2].status == "expired") {
        reload();
    } else {
        for (i = 0; i < peluru.length; i++) {
            if (peluru[i].y < -10) {
                peluru[i].status = "expired";
            }
            if (peluru[i].status == "used") {
                peluru[i].y -= 1;
            }
            ctx.fillStyle = 'red';
            ctx.fillRect(peluru[i].x, peluru[i].y, peluru[i].width, peluru[i].height);
            // console.log(peluru[i].x + " :: " + peluru[i].y)
        }
    }
}

var tembak = function () {
    for(i=0;i<peluru.length;i++){
        for(j=0;j<enemy.length;j++){
            if (peluru[i].status === "used" && enemy[j].status == "live") {
                if ((peluru[i].x <= enemy[j].x + 50 / 4) && (peluru[i].x >= enemy[j].x)) {
                    if(peluru[i].y <= enemy[j].y + 38/4 && peluru[i].y >= enemy[j].y){
                        enemy[j].status = "dead";
                        peluru[i].y = -10;
                        score += 10;
                    }
                }
            }
        }
    }
}

let update = function(){
    scoreShow.innerHTML = score;
    livesShow.innerHTML = lives;

    if (lives <= 0) {
        clearInterval(run);
        banner2[0].style.display = 'block';
        text.innerHTML = "Mohon Maaf<br/> kamu gagal memenangkan permainan";
    }
    if (lives >= 1 && score >= 50) {
        clearInterval(run);
        banner2[0].style.display = 'block';
        text.innerHTML = "Selamat<br/> kamu telah memenangkan permainan";
    }
}

function draw() {
    // menggambar dicanvas sekaligus aksi
    drawShip();
    drawEnemy();
    drawPeluru();
    // aksi tembak
    tembak();
    // update score & lives board
    update();
}

function load() {
    ctx.clearRect(0, 0, 600, 600);
    draw();
}

function init() {
    run = setInterval(function () {
        load()
    }, 50);
}

btnMulai.addEventListener('click', function () {
    init();
    banner1[0].style.display = 'none';

    document.addEventListener('keydown', function (con) {
        switch (con.code) {
            case 'ArrowUp':
                ship.y -= 10;
                for (i = 0; i < 3; i++) {
                    if (peluru[i].status == "ready")
                        peluru[i].y -= 10;
                }
                break;
            case 'ArrowDown':
                ship.y += 10;
                for (i = 0; i < 3; i++) {
                    if (peluru[i].status == "ready")
                        peluru[i].y += 10;
                }
                break;
            case 'ArrowLeft':
                ship.x -= 10;
                for (i = 0; i < 3; i++) {
                    if (peluru[i].status == "ready")
                        peluru[i].x -= 10;
                }
                break;
            case 'ArrowRight':
                ship.x += 10;
                for (i = 0; i < 3; i++) {
                    if (peluru[i].status == "ready")
                        peluru[i].x += 10;
                }
                break;
            case 'Space':
                if (peluru[0].status == "used" && peluru[1].status == "used" && peluru[2].status == "used") {
                    console.log("peluru habis");
                }
                for (i = 0; i < 3; i++) {
                    if (peluru[i].status == "ready") {
                        peluru[i].status = "used";
                        console.log("digunakan")
                        return;
                    }
                }
                break;
        }
        console.log(con.code);
    })
})