
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
function draw_e(e)
{
    if (!isMousePressed) return;
    console.log("drawing...");
    context.beginPath();
    context.moveTo(prevX, prevY);
    //var currentX = e.clientX - canvas.offsetLeft;
    //var currentY = e.clientY - canvas.offsetTop;
    var currentX = e.clientX - canvas.getBoundingClientRect().left;
    var currentY = e.clientY - canvas.getBoundingClientRect().top;
    //canvas.getBoundingClientRect().left canvas.getBoundingClientRect().top
    context.lineTo(currentX, currentY);
    context.lineWidth = 2;
    context.strokeStyle = "black";
    context.stroke();
    context.closePath();
    prevX = currentX;
    prevY = currentY;
}
window.addEventListener("resize", function()
{
    canvas.width = window.innerWidth * 0.8;
    canvas.height = 400;
});
canvas.addEventListener("mousedown", function(e)
{
    isMousePressed = 1;
    //prevX = e.clientX - canvas.offsetLeft;
    //prevY = e.clientY - canvas.offsetTop;
    prevX = e.clientX - canvas.getBoundingClientRect().left;
    prevY = e.clientY - canvas.getBoundingClientRect().top;
    draw_e(e);
});
canvas.addEventListener("mouseup", function(e)
{
    isMousePressed = 0;
});
canvas.addEventListener("mouseout", function(e) { isMousePressed = 0; });
canvas.addEventListener("mousemove", draw_e);

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