/*
 * Estamos utilizando la librería p5.js, por lo tanto se requiere de una función
 * setup que es donde va la lógica de la aplicación, por así decirlo, el la función
 * draw()
 */

function quitarDelArray(arr, elemento){
  for(var i = arr.length-1; i>=0; i--){
    if(arr[i] == elemento){
    arr.splice(i,1);
    }
  }
}

function heuristico(a,b){
  //var d = dist(a.i, a.j, b.i, b.j);
  var d = abs(a.i-b.i) + abs(a.j-b.j);
  return d;
}

var columnas = 25;
var filas = 25;
var cuadricula = new Array(columnas)
var openSet = []; //Son los elementos por evaluar
var closedSet = []; // Son los elementos ya evaluados y no tengo que volver a evaluar.
var inicio;
var final;
var w, h; //Para conocer el largo y ancho de cada cuadradito.
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
  createCanvas(400,400);
  console.log('A*');

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

   for(var i = 0; i < columnas; i++){
     for(var j = 0; j < filas; j++){
       cuadricula[i][j].anadirVecinos(cuadricula);
      }
   }


  inicio = cuadricula[0][0];
  final  = cuadricula[columnas - 1][filas - 1];
  inicio.wall = false;
  final.wall = false;

  openSet.push(inicio);

  console.log(cuadricula.length);
  console.log(cuadricula);

}

function draw(){

  if (openSet.length > 0 ){
    var menorIndice = 0;
    for(var i = 0; i < openSet.length; i++){
      if(openSet[i].f < openSet[menorIndice].f) {
        menorIndice = i;
      }
    }
    var actual = openSet[menorIndice];

    if (actual === final) {
      noLoop();
      console.log("Finalizado!");
    }

    quitarDelArray(openSet, actual);
    closedSet.push(actual);

    var vecinos = actual.vecinos;
    for( var i = 0; i < vecinos.length; i++ ){
      var vecino = vecinos[i];

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
    //no solution
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
