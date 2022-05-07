let data = {};
let picturesPerPage = 40;
let params;
function preload() {
  params = getURLParams();
  
  if (typeof params.page == 'undefined'){
	window.location.href = getURL()+"?page=0";
  }
  
  data = loadJSON("data.json", sortData);
}

let img;
function setup() {
  for(let i = 0; i<picturesPerPage; i++){
	img = createImg(data.items[i+picturesPerPage*int(params.page)].images.overall.images[0].sizes.xsmall.src, "");
	img.position(0, i*400);
	p = createP("Titel: " + data.items[i+picturesPerPage*int(params.page)].metadata.title)	
	p.style('font-size', '24px');
	p.position(200, i*400-25);
	p2 = createP("Datierung: " + data.items[i+picturesPerPage*int(params.page)].metadata.date)	
	p2.style('font-size', '24px');
	p2.position(200, i*400);
	p3 = createP("Art des Werks: " + data.items[i+picturesPerPage*int(params.page)].medium.split("(")[0].split("[")[0])	
	p3.style('font-size', '24px');
	p3.position(200, i*400+25);
	p4 = createP("Besitzer: " + data.items[i+picturesPerPage*int(params.page)].repository)	
	p4.style('font-size', '24px');
	p4.position(200, i*400+50);
	//p5 = createP("Sorting Number: " + data.items[i+picturesPerPage*int(params.page)].sortingNumber + " I: " + i)	
	//p5.style('font-size', '24px');
	//p5.position(200, i*400+75);
  }
  
  
	let buttonNext = createButton('Next');
	buttonNext.position(400, (picturesPerPage)*400 + 50);
	buttonNext.style('font-size', '24px');
	buttonNext.mousePressed(gotolink)
	
	if(params.page > 0){
		let buttonPrevious = createButton('Previous');
		buttonPrevious.position(200, (picturesPerPage)*400 + 50);
		buttonPrevious.style('font-size', '24px');
		buttonPrevious.mousePressed(gotolink2)
	}
}

function draw() {
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
}

function gotolink() {
	window.location.href = getURL().split("?")[0]+"?page=" + (int(params.page)+1);
}

function gotolink2() {
	window.location.href = getURL().split("?")[0]+"?page=" + (int(params.page)-1);
}