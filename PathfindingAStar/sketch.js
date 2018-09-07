/*
 * Estamos utilizando la librería p5.js, por lo tanto se requiere de una función
 * setup que es donde va la lógica de la aplicación, por así decirlo, el la función
 * draw()
 */
var columnas = 5;
var filas = 5;
var cuadricula = new Array(columnas)

//Creando el Objeto celda que tiene la información Heurística
function Celda(){
  this.f = 0;
  this.g = 0;
  this.h = 0;
}

function setup() {
  createCanvas(400,400);
  console.log('A*');

  //Creando una matriz cols X rows
  for(var i = 0; i < columnas ; i++){
    cuadricula[i] = new Array(filas);
    for(var j = 0; i < filas; j++){
      cuadricula[i][j] = new Celda(); //Cada cuadrito es una Celda
    }
  }






  console.log(grid);

}

function draw(){
  background(56);
}
