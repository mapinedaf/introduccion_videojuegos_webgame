
//Variables del juego
//Jugador
var myGamePiece;

//piso
var myFloor;

//obstaculos
var myObstacles = [];

var discos = [];

var mySound;

var distancia_score;
var distancia = 0;

var choques = 0;
var vidas = 10;

var mensage_game_over;

//Funciones
//Inicio del juego
function startGame() {

    myGameArea.start();

    //Propiedades del area de juego
    ancho_canvas = myGameArea.canvas.width;
    alto_canvas = myGameArea.canvas.height;

    //Propiedades del piso
    alto_piso = 20;
    gravedad_piso = 0

    //Propiedades del jugador
    alto_jugador = 15
    ancho_jugador = 15
    gravedad_jugador = 10

    mySound = new sound("//CANCIONNNN FONDO");
    mySound.play();

    //(ancho,alto,color,tipo,x,y,gravedad)
    myGamePiece = new component(alto_jugador, ancho_jugador, "red", "jugador", 200, 150, gravedad_jugador);
    myFloor = new component(ancho_canvas, alto_piso, "green", "piso", 0, alto_canvas - alto_piso, gravedad_piso);

    distancia_score = new component("30px", 200, "black", "score", 240, 240, 0);
    distancia_score.texto = "TEXTO";

    mensage_game_over= new component(0,0, "red", "gameover", 600, 240, 0);


    obstaculo = new component(0, 0, "gray", "obstaculo", ancho_canvas, 120, 0);
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 560;
        this.canvas.height = 315;

        this.frameNo = 0

        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 50);

    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    stop: function () {
        clearInterval(this.interval);
    }

}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) { return true; }
    return false;
}

var espacioAbajo = false

document.addEventListener('keydown', function (event) {

    if(vidas >0){
    //&& espacioAbajo === false      
    if (event.code === 'Space') {
        espacioAbajo = true
        console.log("Espacio")
        myGamePiece.gravedad = -5
        console.log(myGamePiece.gravedad)
        updateGameArea()


    }}
});

document.addEventListener('keyup', function (event) {
    //&& espacioAbajo === false 
    if (event.code === 'Space') {
        espacioAbajo = true
        console.log("Espacio")
        myGamePiece.gravedad = 5
        console.log(myGamePiece.gravedad)
        updateGameArea()


    }
});

function component(width, height, color, tipo, x, y, gravedad) {
    //Propiedades del componente 
    this.gamearea = myGameArea;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravedad = gravedad;
    this.gravedad_velocidad = 0;
    this.angulo = 0;
    this.tipo = tipo;
    this.factor = 20;
    this.texto;
    this.bounce = 0.9;
    this.colided = 0;

    this.velocidad_angular = 0.1;

    //Actualizacion del componente
    this.update = function () {


        if (choques > 0 ) {
            vidas--;
        }

        if(vidas <0){
            vidas =0;
        }

        choques = 0;
        ctx = myGameArea.context;
        this.cambio_factor()

        ctx.beginPath()
        ctx.moveTo(0, myGameArea.canvas.height - 70)
        ctx.lineTo(myGameArea.canvas.width, myGameArea.canvas.height - 70)
        ctx.stroke();
        //Rotacion
        //this.tipo === "jugador"
        if (this.tipo === "jugador") {
            ctx.fillStyle = color;
            ctx.save()
            ctx.translate(this.x, this.y)
            ctx.rotate(this.angulo)
            ctx.beginPath();
            ctx.arc(this.x / this.factor, this.y / this.factor, this.width, 0, Math.PI);
            ctx.fillStyle = "red";
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(this.x / this.factor, this.y / this.factor, this.width, Math.PI, 2 * Math.PI);
            ctx.fillStyle = "white";
            ctx.fill();
            ctx.stroke();
            //ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
            ctx.restore();
        } else if (this.tipo === "score") {
            ctx.font = "20px Arial"
            ctx.fillStyle = color;
            ctx.fillText("distancia: " + vidas.toFixed(1), 0, 20);



        }else if(this.tipo === "gameover"){
            console.log("GAME OVER")
            ctx.font = "60px Arial"
            ctx.fillStyle = "red";
            ctx.fillText("GAME OVER" , this.x, this.y )
        }
        else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

    }

    //movimiento del componente 
    this.newPos = function () {
        this.gravedad_velocidad += this.gravedad
        this.x += this.speedX;
        this.y += this.speedY + this.gravedad;
        this.tocar_fondo()
        this.tocar_cielo()

    }

    this.tocar_fondo = function () {
        var fondo = myGameArea.canvas.height - 35;
        if (this.y > fondo) {

            this.y = fondo;
            espacioAbajo = false

            console.log(this.y)

        }
    }

    this.tocar_cielo = function () {
        if (this.y < this.width * 1.8) {
            this.y = this.width * 1.8;
        }
    }

    this.cambio_factor = function () {
        var fondo = myGameArea.canvas.height - 70;
        if (this.y >= fondo) {
            if (this.factor <= 300) {
                this.factor += 5
            }
        } else {

            if (this.factor > 20) {
                this.factor -= 5
            }
        }
    }

    this.collider = function (obstaculo) {
        var izquierda = this.x;
        var derecha = this.x + this.width;
        var top = this.y;
        var bot = this.y + this.height;
        var obsIzq = obstaculo.x;
        var obsDer = obstaculo.x + obstaculo.width;
        var obsTop = obstaculo.y;
        var obsBot = obstaculo.y + obstaculo.height;

        if (bot < obsTop || top > obsBot || derecha < obsIzq || izquierda > obsDer) {
            return false;
        }
        return true;
    }

}

function acelerarJugadorY(g) {
    this.gravedad = g
}


function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    }
    this.stop = function () {
        this.sound.pause();
    }
}

//Funcion de alctualizacion del canvas 
function updateGameArea() {

    var x, y;

    for (let i = 0; i < myObstacles.length; i++) {
        if (myGamePiece.collider(myObstacles[i])) {

            console.log("Choco")
            choques++;

            break;
            return;
        } else {

        }
    }

    myGamePiece.colided = 0;
    for (let i = 0; i < discos.length; i++) {
        if (myGamePiece.collider(discos[i])) {
            console.log("Disco")
            vidas = vidas + .1;
            console.log(distancia);
            break;
            return;
        }
    }

    console.log("Despues del for")

    myGameArea.clear();

    distancia += 0.01
    myGamePiece.angulo += myGamePiece.velocidad_angular
    myGameArea.frameNo += 1;

    if (vidas > 0) {
        if (myGameArea.frameNo == 1 || everyinterval(25)) {
            x = myGameArea.canvas.width;
            y = myGameArea.canvas.height - 200
            myObstacles.push(new component(30, 30, "gray", "obstaculo", ancho_canvas + Math.floor(Math.random() * 260), Math.floor(Math.random() * 270), 0));
            myObstacles.push(new component(30, 30, "gray", "obstaculo", ancho_canvas + Math.floor(Math.random() * 160), Math.floor(Math.random() * 129), 0));
            discos.push(new component(10, 10, "green", "obstaculo", ancho_canvas + Math.floor(Math.random() * 260), Math.floor(Math.random() * 270), 0));
            discos.push(new component(10, 10, "green", "obstaculo", ancho_canvas + Math.floor(Math.random() * 130), Math.floor(Math.random() * 270), 0));

            if (everyinterval(50)) {
                myObstacles.push(new component(60, 30, "blue", "obstaculo", ancho_canvas + Math.floor(Math.random() * 260), Math.floor(Math.random() * 270), 0));
                discos.push(new component(10, 10, "green", "obstaculo", ancho_canvas + Math.floor(Math.random() * 360) + Math.floor(Math.random() * 50), Math.floor(Math.random() * 270), 0));
            }

            if (everyinterval(75)) {
                myObstacles.push(new component(30, 60, "orange", "obstaculo", ancho_canvas + Math.floor(Math.random() * 260), Math.floor(Math.random() * 270), 0));
                discos.push(new component(10, 10, "green", "obstaculo", ancho_canvas + Math.floor(Math.random() * 260) + Math.floor(Math.random() * 60), Math.floor(Math.random() * 270), 0));


            }

        }
    }else{
        myGamePiece.velocidad_angular = -100;
        myGamePiece.x +=6; 
        myGamePiece.gravedad = 10;
        mensage_game_over.x = mensage_game_over.x <=20? 20 : mensage_game_over.x -10;
    }
    for (i = 0; i < myObstacles.length; i += 1) {

        if (myObstacles[i].color === "blue") {
            myObstacles[i].x += -12;
            myObstacles[i].update();

        } else {
            myObstacles[i].x += -6;
            myObstacles[i].update();
        }
        if(i % 4 ==0){
        discos[i].x -= 6;
        discos[i].update();}
    }


    console.log("PRueba");
    myFloor.update();
    obstaculo.update();
    obstaculo.x -= 20;
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    myGamePiece.newPos();
    myGamePiece.update();
    distancia_score.update();
    mensage_game_over.update();

}