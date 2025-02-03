
//Variables del juego
//Jugador
var myGamePiece;

//piso
var myFloor;

//obstaculos
var myObstacles = [];

var mySound;

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
    alto_jugador = 30
    ancho_jugador = 30
    gravedad_jugador = 10

    mySound = new sound("//CANCIONNNN FONDO");
    mySound.play();

    //(ancho,alto,color,tipo,x,y,gravedad)
    myGamePiece = new component(alto_jugador, ancho_jugador, "red", "jugador", 200, 150, gravedad_jugador);
    myFloor = new component(ancho_canvas, alto_piso, "green", "piso", 0, alto_canvas - alto_piso, gravedad_piso);

    obstaculo = new component(0, 0, "gray", "obstaculo", ancho_canvas, 220, 0);
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 560;
        this.canvas.height = 315;

        this.frameNo = 0

        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);

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
    if (event.code === 'Space' && espacioAbajo === false) {
        espacioAbajo = true
        console.log("Espacio")
        myGamePiece.gravedad = -10
        console.log(myGamePiece.gravedad)
        updateGameArea()
        const idTimeout = setTimeout(() => {
            console.log("¡Hola Mundo!");
            myGamePiece.gravedad = 10
        }, 200);


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
    this.tipo = tipo

    //Actualizacion del componente
    this.update = function () {
        ctx = myGameArea.context;

        //Rotacion
        if (this.tipo === "jugador") {
            ctx.fillStyle = color;
            ctx.save()
            ctx.translate(this.x, this.y)
            ctx.rotate(this.angulo)
            ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
            ctx.restore();
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
    }

    this.tocar_fondo = function () {
        var fondo = myGameArea.canvas.height - 35;
        if (this.y > fondo) {
            this.y = fondo;
            espacioAbajo = false
            this.angulo = 0
            console.log(this.y)

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
    this.play = function(){
      this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
  } 

//Funcion de alctualizacion del canvas
function updateGameArea() {

    var x, y;

    for (let i = 0; i < myObstacles.length; i++) {
        if (myGamePiece.collider(myObstacles[i])) {
            myGameArea.stop();
            return;
        }
    }

    myGameArea.clear();
    if (espacioAbajo) {
        myGamePiece.angulo += 0.2
    }

    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(100)) {
        x = myGameArea.canvas.width;
        y = myGameArea.canvas.height - 200
        myObstacles.push(new component(60, 30, "gray", "obstaculo", ancho_canvas, 220, 0));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -4;
        myObstacles[i].update();
    }
    myFloor.update();
    obstaculo.update();
    obstaculo.x -= 2;
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    myGamePiece.newPos();
    myGamePiece.update();
}