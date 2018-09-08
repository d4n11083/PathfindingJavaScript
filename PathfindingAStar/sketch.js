/*
 * Estamos utilizando la librería p5.js, por lo tanto se requiere de una función
 * setup que es donde va la lógica de la aplicación, por así decirlo, el la función
 * draw()
 */

/*
 *Quita elementos de un array
 */
function quitarDelArray(arr, elemento){
  for(var i = arr.length-1; i>=0; i--){
    if(arr[i] == elemento){
    arr.splice(i,1);
    }
  }
}

/*
*Calcula el h de cada celda
*/
function heuristico(a,b){
  var d = abs(a.i-b.i) + abs(a.j-b.j);
  return d;
}

//Cantidad de filas y columnas que tiene la cuadricula
var columnas = 25;
var filas = 25;

//Este va a ser nuestro array, que al final va a ser la cuadricula
var cuadricula = new Array(columnas)

//La lista abierta y la lista cerrada
var openSet = []; //Son los elementos por evaluar
var closedSet = []; // Son los elementos ya evaluados y no tengo que volver a evaluar.

//El inicio y el final
var inicio;
var final;

//Largo y ancho de cada cuadrito de la cuadricula
var w, h; //Para conocer el largo y ancho de cada cuadradito.

//Camino final del camino optimo (backtracking)
var camino = [];

//Creando el Objeto celda que tiene la información Heurística
function Celda(i,j){
  this.i = i;
  this.j = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.vecinos = [];
  this.previous = undefined;
  this.wall = false;

  if (random(1) < 0.3){
    this.wall = true;
  }


  this.show = function(col) {
    fill(col);
    if(this.wall){
      fill(0);
    }
    noStroke();
    rect( this.i*w, this.j*h, w-1, h-1 );
  }

  this.anadirVecinos = function(cuadr){
    var i = this.i;
    var j = this.j;

    if ( i < columnas - 1){
      this.vecinos.push(cuadr[i + 1][j]);
    }
    if ( i > 0){
      this.vecinos.push(cuadr[i - 1][j]);
    }
    if ( j < filas - 1){
      this.vecinos.push(cuadr[i][j + 1]);
    }
    if ( j > 0 ){
      this.vecinos.push(cuadr[i][j - 1]);
    }

  }
}


function setup() {

  //Se crea el canvas donde se va a pintar la cuadrícula
  createCanvas(400,400);
  w = width / columnas;
  h = height / filas;

  //Creando una matriz cols X rows
  for(var i = 0; i < columnas ; i++){
    cuadricula[i] = new Array(filas);
  }

   for(var i = 0; i < columnas; i++){
     for(var j = 0; j < filas; j++){
       cuadricula[i][j] = new Celda(i, j); //Cada cuadrito es una Celda
     }
   }

   //Se añaden los vecinos de cada celda
   for(var i = 0; i < columnas; i++){
     for(var j = 0; j < filas; j++){
       cuadricula[i][j].anadirVecinos(cuadricula);
      }
   }

   //Inicio y final del algoritmo.
  inicio = cuadricula[0][0];   //Donde empieza
  final  = cuadricula[columnas - 1][filas - 1]; //Donde termina
  inicio.wall = false;
  final.wall = false;

  //Se inicia la lista abierta con el primer elemento
  openSet.push(inicio);
}

function draw(){
  //Si todavía sigo búscando un camino.
  if (openSet.length > 0 ){

    var menorIndice = 0; //La mejor celda a la cual ir
    for(var i = 0; i < openSet.length; i++){
      if(openSet[i].f < openSet[menorIndice].f) {
        menorIndice = i;
      }
    }
    var actual = openSet[menorIndice];

    //Si ya terminé
    if (actual === final) {
      noLoop();
      console.log("Finalizado!");
    }

    //Muevo la celda que era la mejor opción a la lista cerrada.
    quitarDelArray(openSet, actual); //La quito de la lista abierta
    closedSet.push(actual);         //La coloco en la lista cerrada.

    //Se revisan todos los vecinos
    var vecinos = actual.vecinos;
    for( var i = 0; i < vecinos.length; i++ ){
      var vecino = vecinos[i];

      //Si se encuetra la mejor celda a la cual seguir
      if( !closedSet.includes(vecino) && !vecino.wall ){
      var tempG = actual.g + 1;
      if(openSet.includes(vecino)){
        if(tempG < vecino.g){
          vecino.g = tempG;
        }
      }else{
        vecino.g = tempG;
        openSet.push(vecino);
      }

        vecino.h = heuristico(vecino, final);
        vecino.f = vecino.g + vecino.h;
        vecino.previous = actual;

      }
    }
  }
    else{
    //No hay solución
  }

  background(0);

  for(var i = 0 ; i < columnas; i++){
    for (var j = 0; j < filas; j++){
      cuadricula[i][j].show(color(255));
    }
  }

  for( var i = 0 ; i < closedSet.length; i++){
    closedSet[i].show(color(255,0,0));
  }

  for(var i = 0; i < openSet.length; i++){
    openSet[i].show(color(34,255,67));
  }

  camino = [];
  var temporal = actual;
  camino.push(temporal);

  while( temporal.previous ){
    camino.push(temporal.previous);
    temporal = temporal.previous;
  }

  for (var i = 0; i < camino.length; i++){
    camino[i].show(color(0,0,255));

  }


}
