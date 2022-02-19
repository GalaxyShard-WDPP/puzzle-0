
let line = document.createElement("p");
document.getElementById("text").appendChild(line);

let string = "You scanned the QR code!<br>If you read it yourself, you may discover something interesting.<br>";
var index = 0;


var canvas = document.getElementById("draw");
var context = canvas.getContext("2d");
var isMousePressed;
var prevX, prevY;
function resetCanvas()
{
    context.clearRect(0, 0, canvas.width, canvas.height);
}
function fixView()
{
    if (canvas.width - (window.innerWidth * 0.8) > 5)
    {
        canvas.width = window.innerWidth * 0.8;
        canvas.height = 400;
    }
}
fixView();
function draw_line(x, y)
{
    if (!isMousePressed) return;
    context.beginPath();
    context.moveTo(prevX, prevY);
    //var currentX = e.clientX - canvas.getBoundingClientRect().left;
    //var currentY = e.clientY - canvas.getBoundingClientRect().top;
    context.lineTo(x, y);
    context.lineWidth = 2;
    context.strokeStyle = "black";
    context.stroke();
    context.closePath();
    prevX = x;
    prevY = y;

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
canvas.addEventListener("touchend", endDraw);
canvas.addEventListener("touchcancel", endDraw);
canvas.addEventListener("mouseup", endDraw);
canvas.addEventListener("mouseout", endDraw);
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