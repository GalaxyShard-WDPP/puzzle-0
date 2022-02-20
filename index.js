
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
    copyContext.clearRect(0, 0, canvas.width, canvas.height);
    copyCanvas.width = window.innerWidth * 0.8;
    copyCanvas.height = 400;
    canvas.width = copyCanvas.width;
    canvas.height = copyCanvas.height;
}
function fixView()
{
    copyContext.clearRect(0, 0, copyCanvas.width, copyCanvas.height);
    copyCanvas.width = window.innerWidth * 0.8;
    copyCanvas.height = 400;
    copyContext.drawImage(canvas,
        0, 0, canvas.width, canvas.height,
        0, 0, copyCanvas.width, copyCanvas.height,
    );
    canvas.width = copyCanvas.width;
    canvas.height = copyCanvas.height;
    context.drawImage(copyCanvas, 0, 0);
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
    var tempX = x;
    var tempY = y;
    if (isPencil)
    {
        context.lineWidth = 2;
        context.strokeStyle = "black";
        context.beginPath();
        context.moveTo(prevX, prevY);
        context.lineTo(x, y);
        context.stroke();
        context.closePath();
    }
    else
    {
        //context.lineWidth = 20;
        context.lineWidth = 25;
        context.strokeStyle = "white";
        context.fillStyle = "white";
        //context.strokeStyle = "black";
        //context.fillStyle = "black";
        context.beginPath();
        var r = 10;
        var d = r*2;
        context.translate(-r,-r);
        context.fillRect(prevX, prevY, d, d);
        context.fillRect(x, y, d, d);
        context.translate(r,r);
        context.moveTo(prevX, prevY);
        context.lineTo(x, y);
        context.stroke();
        context.closePath();
    }
    prevX = tempX;
    prevY = tempY;
}
window.addEventListener("resize", fixView);
function endDraw() { isMousePressed = 0; }
canvas.addEventListener("mousedown", function(e)
{
    prevX = e.clientX - canvas.getBoundingClientRect().left;
    prevY = e.clientY - canvas.getBoundingClientRect().top;
    isMousePressed = 1;
    draw_line(prevX, prevY);
});
canvas.addEventListener("touchstart", function(e)
{
    var touch = e.changedTouches[0];
    prevX = touch.clientX - canvas.getBoundingClientRect().left;
    prevY = touch.clientY - canvas.getBoundingClientRect().top;
    isMousePressed = 1;
    draw_line(prevX, prevY);
});
document.documentElement.addEventListener("mouseup", endDraw);
document.documentElement.addEventListener("touchend", endDraw);
document.documentElement.addEventListener("touchcancel", endDraw);
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