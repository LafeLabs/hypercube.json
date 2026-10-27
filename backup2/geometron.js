function load_file(name) {
    return fetch('load-file.php?filename=' + name).then(res => res.text());
}

function save_file(name,data){
    fetch('save-file.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
        body: 'data=' + data + '&filename=' + name
    });
}

function list_files(fork) {
    var query = fork ? '?directory=' + encodeURIComponent(fork) : '';
    return fetch('list-files.php' + query)
        .then(res => res.json())
        .then(files => {
            return files; 
        });
}

class GVM {       //Geometron Virtual Machine
  constructor() {

    this.action = 0o177;
    this.address = 0o220;
    this.glyph = [];
    this.svgString = "";
    this.cursorStack = [];
    
    this.hypercube = [];
    for(let index = 0; index < 1024; index++){
        this.hypercube.push([0o177]);
    }


    this.canvas = {
        "width": 200,
        "height": 200,
        "unit": 100,
        "x0": 100,
        "y0": 100,
        "theta0": -Math.PI/2,
        "viewStep":50
    };
    this.cursor = {
        "x": 100,
        "y": 100,
        "r": 100,
        "word":"",
        "theta": -Math.PI/2,
        "thetaStep": Math.PI/2,
        "scaleFactor": 2,
        "font":"Arial",
        "bezier":{
            "cpx1":0,
            "cpy1":0,
            "cpx2":0,
            "cpy2":0,
            "x2":0,
            "y2":0
        }
    };
    this.style = {
        "color0": "black",
        "color1": "black",
        "color2": "red",
        "color3": "orange",
        "color4": "yellow",
        "color5": "green",
        "color6": "blue",
        "color7": "purple",
        "fill0": "black",
        "fill1": "black",
        "fill2": "red",
        "fill3": "orange",
        "fill4": "yellow",
        "fill5": "green",
        "fill6": "blue",
        "fill7": "purple",
        "line0": 2,
        "line1": 6,
        "line2": 2,
        "line3": 2,
        "line4": 2,
        "line5": 2,
        "line6": 2,
        "line7": 2
    };
    this.robot = {};
    this.vr = {};
    this.quantum = {};
    this.synth = {};
    this.keyboard = {
        "mode":0
    };
    this.mouse = {
        "x":0,
        "y":0,
        "z":0
    }
  }
}



function saveHypercube(gvm){
    data = encodeURIComponent(JSON.stringify(gvm.hypercube,null,"    "));
    fetch('save-file.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
        body: 'data=' + data + '&filename=hypercube.json'
    });
}

function importShapeStack(gvm,shapeStack){
    for(let shapeIndex = 0;shapeIndex < shapeStack.length;shapeIndex++){
        if(shapeStack[shapeIndex].length > 1){
            let glyphAddress = parseInt(shapeStack[shapeIndex].split(":")[0],8);
            let glyph = [];
            let glyphStringArray = shapeStack[shapeIndex].split(":")[1].split(",");
            for(let actionIndex = 0;actionIndex < glyphStringArray.length;actionIndex++){
                if(glyphStringArray[actionIndex].length > 1){
                    glyph.push(parseInt(glyphStringArray[actionIndex],8));
                }
            }
            gvm.hypercube[glyphAddress] = glyph;
        }
    }
}

function loadHyperCube(gvm,hypercube){
    for(let index = 0;index < hypercube.length;index++){
        gvm.hypercube[index] = hypercube[index];
    }
    return gvm;
}

function drawGlyph(canvas, gvm){

    gvm.cursor.x = gvm.canvas.x0;
    gvm.cursor.y = gvm.canvas.y0;
    gvm.cursor.r = gvm.canvas.unit;
    gvm.cursor.theta = gvm.canvas.theta0;
    gvm.cursor.scaleFactor = 2;
    gvm.cursor.thetaStep = Math.PI/2;
    gvm.svgString = "";
    gvm.cursor.word = "";
    gvm.cursorStack = [];
    
    gvm.svgString = "<svg width=\"" + gvm.canvas.width.toString() + "\" height=\"" + gvm.canvas.height.toString() + "\" viewbox = \"0 0 " + gvm.canvas.width.toString() + " " + gvm.canvas.height.toString() + "\"  xmlns=\"http://www.w3.org/2000/svg\">\n";
    gvm.svgString += "<!--<json></json>-->";
    ctx = canvas.getContext("2d");
    canvas.width = gvm.canvas.width;
    canvas.height = gvm.canvas.height;

    ctx.clearRect(0, 0, gvm.canvas.width, gvm.canvas.height);
    ctx.fillStyle = gvm.style.fill0 || "black";
    ctx.strokeStyle = gvm.style.color0 || "black";
    ctx.lineWidth = gvm.style.line0 || 2;     
    
    for(let index = 0; index < gvm.glyph.length; index++){
        geometronAction(ctx, gvm,gvm.glyph[index]);
    }
    
    gvm.svgString += "</svg>";    
}


function spellGlyph(canvas, gvm){
    gvm.canvas.x0 = 30;
    gvm.canvas.y0 = 30 + gvm.canvas.unit;
    gvm.style.line0 = 2;
    gvm.cursor.x = gvm.canvas.x0;
    gvm.cursor.y = gvm.canvas.y0;
    gvm.cursor.r = gvm.canvas.unit;
    gvm.cursor.theta = gvm.canvas.theta0;
    gvm.cursor.scaleFactor = 2;
    gvm.cursor.thetaStep = Math.PI/2;
    gvm.svgString = "";
    gvm.cursor.word = "";
    gvm.cursorStack = [];
    
    gvm.svgString = "<svg width=\"" + gvm.canvas.width.toString() + "\" height=\"" + gvm.canvas.height.toString() + "\" viewbox = \"0 0 " + gvm.canvas.width.toString() + " " + gvm.canvas.height.toString() + "\"  xmlns=\"http://www.w3.org/2000/svg\">\n";
    ctx = canvas.getContext("2d");
    canvas.width = gvm.canvas.width;
    canvas.height = gvm.canvas.height;

    ctx.clearRect(0, 0, gvm.canvas.width, gvm.canvas.height);
    ctx.fillStyle = gvm.style.fill0 || "black";
    ctx.strokeStyle = gvm.style.color0 || "black";
    ctx.lineWidth = gvm.style.line0 || 2;     
    
    for(let index = 0; index < gvm.glyph.length; index++){
        if(gvm.glyph[index] < 0o1000){
            geometronAction(ctx, gvm,gvm.glyph[index] + 0o1000);
        } else{
            geometronAction(ctx, gvm,gvm.glyph[index]);
        }
        if(gvm.cursor.x > gvm.canvas.width - gvm.canvas.unit - 10){
            gvm.cursor.x = 10;
            gvm.cursor.y += gvm.canvas.unit + 10;
        }
    }
    
    gvm.svgString += "</svg>";    
}


function rootMagic(gvm,action){
    if(action >= 0o10 && action <= 0o37){
        codeString = "";
        for(let index = 0;index < hypercube[action].length;index++){
            codeString += String.fromCharCode(hypercube[action][index] - 512);
        }
        eval(codeString);
    }
}



function geometronAction(ctx, gvm,action){
    let x2, y2, localString, localInt, pathX2, pathY2; 
    if((action >= 0o200 && action <= 0o277) || (action >= 0o1000 && action <= 0o1777) || (action >= 0o500 && action <= 0o677)){
        for(let index = 0;index < gvm.hypercube[action].length;index++){
            geometronAction(ctx, gvm,gvm.hypercube[action][index]);
        }
    }
    if(action >= 0o40 && action < 0o177){
        gvm.cursor.word += String.fromCodePoint(action);
    }
    if(action >= 0o300 && action <= 0o377){
        codeString = "";
        for(let index = 0;index < hypercube[action].length;index++){
            codeString += String.fromCharCode(hypercube[action][index] - 512);
        }
        eval(codeString);
    }
    
}


