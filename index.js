
let line = document.createElement("p");
document.getElementById("text").appendChild(line);

let string = "You scanned the QR code!<br>If you read it yourself, you may discover something interesting.<br>";
var index = 0;

var canvas = document.getElementById("draw");
var copyCanvas = document.createElement("canvas");
var copyContext = copyCanvas.getContext("2d");
var context = canvas.getContext("2d");
var isMousePressed;
var prevX, prevY;
var isPencil = true;
function swapTool()
{
    isPencil = !isPencil;
    document.getElementById("toolBtn").innerHTML = isPencil ? "Use Eraser" : "Use Pencil";
}
function resetCanvas()
{
    context.clearRect(0, 0, canvas.width, canvas.height);
    //context.fill();
}
function fixView()
{
    //if (Math.abs(canvas.width - (window.innerWidth * 0.8)) > 1)
    //{
    copyContext.drawImage(canvas, 0, 0);
    canvas.width = window.innerWidth * 0.8;
    canvas.height = 400;
    context.drawImage(copyCanvas, 0, 0);
    //}
}
fixView();
function moveTowards(currX, currY, x, y, maxDelta)
{
    var toX = x-currX;
    var toY = y-currY;
    var sqrDist = toX*toX + toY*toY;
    if (sqrDist < maxDelta*maxDelta)
        return {x:x, y:y};
    
    var dist = Math.sqrt(sqrDist);
    return {x:toX/dist*maxDelta, y:toY/dist*maxDelta};
}
function approx(a, b)
{
    return Math.abs(a-b) < 0.01;
}
function draw_line(x, y)
{
    if (!isMousePressed) return;
    context.beginPath();
    var tempX = x;
    var tempY = y;
    if (isPencil)
    {
        context.lineWidth = 2;
        context.strokeStyle = "black";
        context.moveTo(prevX, prevY);
        context.lineTo(x, y);
        context.stroke();
        context.closePath();
    }
    else
    {
        context.lineWidth = 20*1.25;
        context.strokeStyle = "white";
        context.fillStyle = "white";
        //context.strokeStyle = "black";
        //context.fillStyle = "black";
        context.translate(-10,-10);
        context.fillRect(prevX, prevY, 20, 20);
        context.fillRect(x, y, 20, 20);
        context.translate(10,10);
        context.moveTo(prevX, prevY);
        context.lineTo(x, y);
        context.stroke();
        context.closePath();
    }
    prevX = tempX;
    prevY = tempY;
}
window.addEventListener("resize", fixView);
//function startDraw()
//{
    //isMousePressed = 1;
    //draw_e(e);
//}
function endDraw() { isMousePressed = 0; }
canvas.addEventListener("mousedown", function(e)
{
    prevX = e.clientX - canvas.getBoundingClientRect().left;
    prevY = e.clientY - canvas.getBoundingClientRect().top;
    //startDraw();
    isMousePressed = 1;
    draw_line(prevX, prevY);
});
canvas.addEventListener("touchstart", function(e)
{
    var touch = e.changedTouches[0];
    prevX = touch.clientX - canvas.getBoundingClientRect().left;
    prevY = touch.clientY - canvas.getBoundingClientRect().top;
    //startDraw();
    isMousePressed = 1;
    draw_line(prevX, prevY);
});
//canvas.addEventListener("touchend", endDraw);
//canvas.addEventListener("touchcancel", endDraw);
//canvas.addEventListener("mouseup", endDraw);
document.documentElement.addEventListener("mouseup", endDraw);
document.documentElement.addEventListener("touchend", endDraw);
document.documentElement.addEventListener("touchcancel", endDraw);
//canvas.addEventListener("mouseout", endDraw);
canvas.addEventListener("mousemove", function(e)
{
    draw_line(e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top);
});
canvas.addEventListener("touchmove", function(e)
{
    if (!isMousePressed) return;
    e.preventDefault();
    var touch = e.changedTouches[0];
    draw_line(touch.clientX - canvas.getBoundingClientRect().left, touch.clientY - canvas.getBoundingClientRect().top);
});

function showHints()
{
    document.body.classList.add("show-inside");
    //document.getElementById("hints").style.display = "block";
    
    let hints = document.getElementById("hints");
    hints.hidden = false;
    setInterval(function(){hints.classList.add("hints-show");},0);
}

function writeText()
{
    let id = setInterval(function() {
        line.innerHTML += string.charAt(index);
        index++;
        if (string.charAt(index) == "<")
        {
            let lastIndex = index;
            index = string.indexOf(">", lastIndex)+1;
            line.innerHTML += string.substring(lastIndex, index);
            clearInterval(id);
            setTimeout(writeText, 500);
        }
        else if (index >= string.length)
        {
            setTimeout(showHints, 500);
            clearInterval(id);
        }
    }, 25);
}

setTimeout(writeText, 500);