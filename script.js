import {number} from './important.js'

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var code = document.getElementById("myCode");
var typese = document.getElementById('typess');
ctx.beginPath();
var codes="";
let content="";
let widthsm=10,stsm=1,wightpxsm=10,heightpxsm=10
let typesis=["Глобальная система отсчёта координат","Относительная система отсчёта координат"]
let typels=0
let xpos=0,ypos=0;
//кнопки
function safeFileTxt(){
    const blob = new Blob([codes], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'G-code.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 1000);
}
document.querySelector('[data-button-save-txt]').addEventListener('click', safeFileTxt);
function safeFileGcode(){
    const blob = new Blob([codes], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'G-code.gcode';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 1000);
}
document.querySelector('[data-button-save-txt]').addEventListener('click', safeFileGcode);


function types(){
    typels+=1
    if(typels==2){
        typels=0;
    }
    typese.innerText=typesis[typels];
    codes=""
    if(content!=""){
        drow(content)
    }
    else if(drow_code!=""){
        drow_drow(drow_code)
    }
    code.innerText=codes
}
document.querySelector('[data-button-types]').addEventListener('click', types);

function reload(){
    codes=""
    drow(content)
    code.innerText=codes
}

document.querySelector('[data-button-reload]').addEventListener('click', reload);

function clear_info(){
    codes=""
    content=""
    drow_code=""
    if(number==1){
        drow_drow(drow_code)
    }
    else{
        drow(content)
    }
    code.innerText=""
}

document.querySelector('[data-clear-info-button]').addEventListener('click', clear_info);

function clear(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath()
}
document.querySelector('[data-clear-button]').addEventListener('click', clear);
//логика
function readFileContent(file) {
    const reader = new FileReader();

    reader.onload = (e) => {
        content = e.target.result;
        drow(content);
        code.innerText=codes
    }

    reader.onerror = (e) => {
        console.error("Ошибка при чтении файла:", e);
    };

    reader.readAsText(file);
}

function drow(msg){
    clear()
    let t="", s="" , type="";
    hols(msg);
    msg=msg.split("</title>")[1]
    msg=msg.split("</g>")[0]
    t=msg.split("<")
    for(let i=2;i<t.length;i++){
        s=t[i].split("/>")[0]
        type=s.split(" ")[0]
        if(type=="line"){
            line(s)
        }
        if(type=="rect"){
            rect(s)
        }
        if(type=="polygon"){
            polygon(s)
        }
    }
}

function hols(msg){
    let width = parseFloat(msg.split(" width=\"")[1].split("\""))*(sizeInput.value/100);
    let height = parseFloat(msg.split(" height=\"")[1].split("\""))*(sizeInput.value/100);
    wightpxsm=width/widthsm
    heightpxsm=height/widthsm
    ctx.moveTo(0, height);
    ctx.lineTo(width, height);
    ctx.lineTo(width, 0);
    ctx.stroke();
}

function line(msg){
    let x1 = parseFloat(msg.split(" x1=\"")[1].split("\""))*(sizeInput.value/100);
    let x2 = parseFloat(msg.split(" x2=\"")[1].split("\""))*(sizeInput.value/100);
    let y1 = parseFloat(msg.split(" y1=\"")[1].split("\""))*(sizeInput.value/100);
    let y2 = parseFloat(msg.split(" y2=\"")[1].split("\""))*(sizeInput.value/100);

    if(typels==0){
        codes+="G00 X"+convert_width(x1)+" Y"+convert_height(y1)+"\n";
        codes+="G01 X"+convert_width(x2)+" Y"+convert_height(y2)+" F100\n";
    }
    else{
        codes+="G00 X"+convert_width(x1-xpos)+" Y"+convert_height(y1-ypos)+"\n";
        xpos=x1
        ypos=y1
        codes+="G01 X"+convert_width(x2-xpos)+" Y"+convert_height(y2-ypos)+" F100\n";
        xpos=x2
        ypos=2
    }
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function rect(msg){
    let x = parseFloat(msg.split(" x=\"")[1].split("\""))*(sizeInput.value/100);
    let y = parseFloat(msg.split(" y=\"")[1].split("\""))*(sizeInput.value/100);
    let width = parseFloat(msg.split(" width=\"")[1].split("\""))*(sizeInput.value/100);
    let height = parseFloat(msg.split(" height=\"")[1].split("\""))*(sizeInput.value/100);

    if(typels==0){
        codes+="G00 X"+convert_width(x)+" Y"+convert_height(y)+"\n";
        codes+="G01 X"+convert_width(x)+" Y"+convert_height(y+height)+" F100\n";
        codes+="G01 X"+convert_width(x + width)+" Y"+convert_height(y+height)+" F100\n";
        codes+="G01 X"+convert_width(x + width)+" Y"+convert_height(y)+" F100\n";
        codes+="G01 X"+convert_width(x)+" Y"+convert_height(y)+" F100\n";
    }
    else{
        codes+="G00 X"+convert_width(x-xpos)+" Y"+convert_height(y-ypos)+"\n";
        xpos=x
        ypos=y
        codes+="G01 X"+convert_width(x-xpos)+" Y"+convert_height(y+height-ypos)+" F100\n";
        xpos=x
        ypos=y+height
        codes+="G01 X"+convert_width(x + width-xpos)+" Y"+convert_height(y+height-ypos)+" F100\n";
        xpos=x+ width
        ypos=y+height
        codes+="G01 X"+convert_width(x + width-xpos)+" Y"+convert_height(y-ypos)+" F100\n";
        xpos=x+ width
        ypos=y
        codes+="G01 X"+convert_width(x-xpos)+" Y"+convert_height(y-ypos)+" F100\n";
        xpos=x
        ypos=y
    }
    ctx.moveTo(x, y);
    ctx.lineTo(x, y+height);
    ctx.lineTo(x + width, y+height);
    ctx.lineTo(x + width, y);
    ctx.lineTo(x, y);
    ctx.stroke();
}

function polygon(msg){
    let sides = parseFloat(msg.split(" sides=\"")[1].split("\""));
    let points = msg.split(" points=\"")[1].split("\"")[0].split(" ");

    ctx.moveTo(points[0].split(",")[0]*(sizeInput.value/100), points[0].split(",")[1]*(sizeInput.value/100));
    if(typels==0){
        codes+="G00 X"+convert_width(parseFloat(points[0].split(",")[0]))+" Y"+convert_height(parseFloat(points[0].split(",")[1]))+"\n";
    }
    else{
        codes+="G00 X"+convert_width(parseFloat(points[0].split(",")[0])+xpos)+" Y"+convert_height(parseFloat(points[0].split(",")[1])+ypos)+"\n";
        xpos=parseFloat(points[0].split(",")[0])
        ypos=parseFloat(points[0].split(",")[1])
    }
    for(let i=1;i<sides+1;i++){
        ctx.lineTo(points[i].split(",")[0]*(sizeInput.value/100), points[i].split(",")[1]*(sizeInput.value/100));
        if(typels==0){
            codes+="G01 X"+convert_width(parseFloat(points[i].split(",")[0]))+" Y"+convert_height(parseFloat(points[i].split(",")[1]))+"\n";
        }
        else{
            codes+="G01 X"+convert_width(parseFloat(points[i].split(",")[0])+xpos)+" Y"+convert_height(parseFloat(points[i].split(",")[1])+ypos)+"\n";
            xpos=parseFloat(points[i].split(",")[0])
            ypos=parseFloat(points[i].split(",")[1])
        }
    }
    ctx.stroke();
}

function convert_width(px){
    let sm = px/wightpxsm
    let stap =sm*stsm
    stap=parseInt(stap)
    return stap
}

function convert_height(px){
    let sm = px/heightpxsm
    let stap=sm*stsm
    stap=parseInt(stap)
    return stap
}

// чтение нажатий

const fileInput = document.getElementById('myFile');
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0]; // Получаем выбранный файл
        if (file) {
            codes=""
            readFileContent(file);
        }
    });

const sizeInput = document.getElementById('cowbell');
const size = document.getElementById('cowbellt');
size.innerText=sizeInput.value+"%"
sizeInput.addEventListener('input', (event) => {
    const size = document.getElementById('cowbellt');
    size.innerText=sizeInput.value+"%"
    drow(content);
});

const widthshsmget = document.getElementById('tentaclesshsm');
widthshsmget.addEventListener('change', (event) => {
    stsm=widthshsmget.value;
    console.log(stsm,"stsm")
});
const widthsmget = document.getElementById('tentaclessm');
widthsmget.addEventListener('change', (event) => {
    widthsm=widthsmget.value;
});

const widthHolst = document.getElementById('widthHolst');
widthHolst.addEventListener('change', (event) => {
    heightpxsm=1000/widthHolst.value;
});

const heightHolst = document.getElementById('heightHolst');
heightHolst.addEventListener('change', (event) => {
    heightpxsm=1000/heightHolst.value;
});
//рисование
let x_start,y_start,x_finish,y_finish, drow_code=""
const corect= 1000/700
document.querySelector('canvas').addEventListener('mousedown', start)
document.querySelector('canvas').addEventListener('mouseup', finish)

function start(e){
    if(number==1){
        console.log(e.offsetX,e.offsetY,"start")
        drow_code+=" x1="+(e.offsetX*corect)+", y1="+(e.offsetY*corect)+","
    }
}

function finish(e){
    if(number==1){
        console.log(e.offsetX,e.offsetY,"finish")
        drow_code+=" x2="+(e.offsetX*corect)+", y2="+(e.offsetY*corect)+",;"
        codes=""
        drow_drow(drow_code);
        code.innerText=codes
    }
}

function drow_drow(msg){
    clear()
    let t=msg.split(";")
    for(let i=0;i<t.length-1;i++){
        line_drow(t[i])
    }
}

function line_drow(msg){
    let x1 = parseFloat(msg.split("x1=")[1].split(",")[0]);
    let x2 = parseFloat(msg.split("x2=")[1].split(",")[0]);
    let y1 = parseFloat(msg.split("y1=")[1].split(",")[0]);
    let y2 = parseFloat(msg.split("y2=")[1].split(",")[0]);

    if(typels==0){
        codes+="G00 X"+convert_width(x1)+" Y"+convert_height(y1)+"\n";
        codes+="G01 X"+convert_width(x2)+" Y"+convert_height(y2)+" F100\n";
    }
    else{
        codes+="G00 X"+convert_width(x1-xpos)+" Y"+convert_height(y1-ypos)+"\n";
        xpos=x1
        ypos=y1
        codes+="G01 X"+convert_width(x2-xpos)+" Y"+convert_height(y2-ypos)+" F100\n";
        xpos=x2
        ypos=2
    }
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}