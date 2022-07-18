
// calculate height for the plane
      const calculateHeight = (element) => {
            const split = element.dimensions.replace(/[\])}[{(]/g, ' ').split(' ');
            const scale = 1 / 1.8;
            const splitWithoutCM = split.filter(
              (string) => string !== 'cm' && string !== ''
            );

            let size;
            let sideMeasured;

            for (const string of splitWithoutCM) {
              const stringSlicedAtDash = string.split('-')[0];

              if (!size) {
                if (/\d/.test(stringSlicedAtDash)) {
                  size = parseFloat(stringSlicedAtDash.replace(/,/g, '.'));
                }
              } else {
                sideMeasured = stringSlicedAtDash;

                break;
              }
            }

            switch (sideMeasured) {
              case 'oben':
                size =
                  (size / element.images.overall.images[0].sizes.medium.dimensions.width) *
                  element.images.overall.images[0].sizes.medium.dimensions.height;

                break;
              case 'Durchmesser':
                /* eslint-disable */
                const scaledDiameter = Math.sqrt(
                  Math.pow(
                    element.images.overall.images[0].sizes.medium.dimensions.width,
                    2
                  ) +
                    Math.pow(
                      element.images.overall.images[0].sizes.medium.dimensions.height,
                      2
                    )
                );

                const scale = size / scaledDiameter;

                size =
                  element.images.overall.images[0].sizes.medium.dimensions.height *
                  scale;

                break;
              default:
                break;
            }

            return (size / 100) * scale;
          };


		 
let data;

let objects = [];
let referenced;
let objectsDim = []
let yearToIndex = [];
let dataByYear = [];

let textS = 0.12;



function preload() {
  
  f = loadFont('IndieFlower-Regular.ttf');
  
  let url =
   'data.json';
  data = loadJSON(url, sortData);
}


function sortData(){
  data.items.sort((a, b) => {
    let fa = a.sortingNumber.toLowerCase(),
        fb = b.sortingNumber.toLowerCase();

    if (fa < fb) {
        return -1;
    }
    if (fa > fb) {
        return 1;
    }
    return 0;
	});

  data.items = data.items.filter(item => item.isBestOf);
  
  let ind = 0;
  
  for (let i=0; i<data.items.length; i++) {
	
	if(yearToIndex[data.items[i].sortingNumber.split("-")[0]] == undefined){
		yearToIndex[data.items[i].sortingNumber.split("-")[0]] = ind;
		dataByYear[ind] = [];
		ind++;
	}
	
	let scale = 10;
	let imageLink = data.items[i].images.overall.images[0].sizes.medium.src.replace("imageserver-2022", "data-proxy/image.php?subpath=");
	let height = calculateHeight(data.items[i])*scale;
	let width = height*(data.items[i].images.overall.images[0].sizes.medium.dimensions.width/data.items[i].images.overall.images[0].sizes.medium.dimensions.height);
	
	dataByYear[yearToIndex[data.items[i].sortingNumber.split("-")[0]]].push([i, loadImage(imageLink), width, height]);
  }
}






class Player extends RoverCam {
  constructor() {
    super();
    this.dimensions = createVector(1, 3, 1);
    this.velocity = createVector(0, 0, 0);
    this.gravity = createVector(0, 0.03, 0);
    this.grounded = false;
    this.pointerLock = false;
    this.sensitivity = 0.002;
    this.speed = 0.1;
  }
  
  controller() { // override
    if (player.pointerLock) {
      this.yaw(movedX * this.sensitivity);   // mouse left/right
      this.pitch(movedY * this.sensitivity); // mouse up/down
      if(keyIsDown(65) || keyIsDown(LEFT_ARROW))  this.moveY(this.speed); // a
      if(keyIsDown(68) || keyIsDown(RIGHT_ARROW)) this.moveY(-this.speed);// d
    }
    else { // otherwise yaw/pitch with keys
      if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) this.yaw(-0.02); // a
      if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) this.yaw(0.02); // d
      if (keyIsDown(82)) this.pitch(-0.02); // r
      if (keyIsDown(70)) this.pitch(0.02);  // f
    }
    if (keyIsDown(87) || keyIsDown(UP_ARROW)) this.moveX(this.speed);    // w
    if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) this.moveX(-this.speed); // s
    if (keyIsDown(69)) this.moveZ(0.05); // e
  }
  
  update() {
    if (keyIsPressed && key == 'e') {
      this.grounded = false;
      return;
    }
    this.velocity.add(this.gravity);
    this.position.add(this.velocity);

    if (this.grounded && keyIsPressed && keyCode == 32) { // space
      this.grounded = false;
      this.velocity.y = -1.5;
      this.position.y -= 0.2;
    }
	
	if (this.position.y > 0) {
		this.position.y = 0;
		this.velocity.y = 0;
	
	}
	
		
  }
}

// this is needed to catch the exit from pointerLock when user presses ESCAPE
function onPointerlockChange() {
  if (document.pointerLockElement === canvas.elt ||
    document.mozPointerLockElement === canvas.elt)
    console.log("locked");
  else {
    console.log("unlocked");
    player.pointerLock = false;
  }
}
document.addEventListener('pointerlockchange', onPointerlockChange, false);

var player, maze, f, help = false,canvas;




function setup() {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  strokeWeight(0.04);
  textFont(f);
  textSize(10);
  player = new Player();

  frameRate(60);
  strokeWeight(2);
  player.position.x = 0;
  player.position.z = 0;
  
 

  
  textSize(textS);
}


function draw() {
  
  background(155);

  player.update();
  drawTimeline();

}



function drawTimeline() {
	
	let yearDistance = 20;
	let pictureDistance = 5;
	let buffer = 5;
	
	objects = []
	objectsDim = []
	
	for(let i = 0; i<dataByYear.length; i++){
		
		yearArray = dataByYear[i];
		
		push();
		noStroke();
		let tX = buffer;
		if(i%2 != 0) tX *= -2;
		translate(i*yearDistance, -1, tX);
		rotateY(-PI/2);
		textSize(5);
		text(yearToIndex.indexOf(i), 0, 0);
		pop();
		
		for(let j = 0; j<yearArray.length; j++){
			
			let width = yearArray[j][2];
			let height = yearArray[j][3];
			
			let y = j*pictureDistance+buffer;
			let x = i*yearDistance;
			
			if(i%2 == 0) y *= -1;
			
			let p = createVector(x, 0, y);
			if(p5.Vector.dist(p, player.position) <= 100 && (referenced == undefined || referenced.includes(yearArray[j][0]))){ //EDIT HERE!!!
				drawPicture(yearArray[j][0], yearArray[j][1], width, height, x, y);
				objects.push([i, j, new IntersectPlane(1, 0, 0, -x, 0, y)]);
				objectsDim.push([x, y, width, height]);
			}
			
			
		}
		
		push();
		noStroke();
		tX = (yearArray.length*pictureDistance+buffer)/2;
		if(i%2 == 0) tX *= -1;
		translate(i*yearDistance, 2, tX);
		box(0.1, 0.1, yearArray.length*pictureDistance+buffer);
		pop()
	}
	
	  x = cos(player.pan)*cos(player.tilt);
	  y = sin(player.pan)*cos(player.tilt);
	  z = sin(player.tilt);

	
	  const Q = createVector(player.position.x, player.position.y, player.position.z); // A point on the ray and the default position of the camera.
	  const v = createVector(x, z, y); // The direction vector of the ray.

	  let intersect = createVector(0, 0, 0); // The point of intersection between the ray and a plane.
	  let closestLambda = 100000000; // The draw distance.

	  for (let x = 0; x < objects.length; x += 1) {
		let object = objects[x][2];
		let lambda = object.getLambda(Q, v); // The value of lambda where the ray intersects the object

		if (lambda < closestLambda && lambda > 0) {
		  // Find the position of the intersection of the ray and the object.
		  preIntersect = p5.Vector.add(Q, p5.Vector.mult(v, lambda));
		  dims = objectsDim[x];
		  
		  if(preIntersect.z >= dims[1]-dims[2]/2 && preIntersect.z <= dims[1]+dims[2]/2 && preIntersect.y >= -dims[3]/2-2 && preIntersect.y <= dims[3]/2-2){
			intersect = preIntersect.copy();  
			closestLambda = lambda;
			
			if (keyIsPressed && key == 'r') {
				id = dataByYear[objects[x][0]][objects[x][1]][0];
				referenced = [];
				referenced.push(id);
				for (let k=0; k<data.items.length; k++) {
					for(let l=0; l<data.items[id].references.length; l++){
						if(data.items[id].references[l].inventoryNumber == data.items[k].inventoryNumber){
							referenced.push(k);
						}
					}
				}
			}
		  }
		}
	  }
	
	
		push();
		noStroke();
		fill(255, 0 ,0);
		translate(intersect.x, intersect.y, intersect.z);
		sphere(0.1);
		pop(); 
	
	push();
	noStroke();
	translate(dataByYear.length*yearDistance/2, 2, 0);
	box(dataByYear.length*yearDistance, 0.1, 0.1);
	pop();
	
	if (keyIsPressed && key == 't') {
		referenced = undefined;
	}
	
}

function drawPicture(id, img, width, height, posx, posy){
	
	push();
	translate(posx, -2, posy);
	rotateY(-PI/2);
	push();
	texture(img);
	noStroke();
	plane(width,height);
	pop();
	
	textSize(textS);
	noStroke();
	translate(0,0,-0.1);
	plane(width,height);
	fill(0);
	rotateY(PI);
	translate(-width/2+0.1,0,0.1);
	text('Titel: '+data.items[id].metadata.title,0,0);
	translate(0,textS,0);
	text('Künstler: '+data.items[id].involvedPersons[0].name,0,0);
	translate(0,textS,0);
	text('Art: '+data.items[id].medium,0,0);
	translate(0,textS,0);
	text('Besitzer: '+data.items[id].repository,0,0);
	pop();
}

function mouseClicked() {
  if (!player.pointerLock) {
    player.pointerLock = true;
    requestPointerLock();
  } else {
    exitPointerLock();
    player.pointerLock = false;
  }
}

class IntersectPlane {
  constructor(n1, n2, n3, p1, p2, p3) {
    this.normal = createVector(n1, n2, n3); // The normal vector of the plane
    this.point = createVector(p1, p2, p3); // A point on the plane
    this.d = this.point.dot(this.normal);
  }

  getLambda(Q, v) {
    return (-this.d - this.normal.dot(Q)) / this.normal.dot(v);
  }
}






