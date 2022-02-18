
let line = document.createElement("p");
document.getElementById("text").appendChild(line);

let string = "You scanned the QR code!<br>Try reading it yourself, and you will discover something interesting.<br>";
var index = 0;
//document.getElementById("hints").style.opacity = 0;
function showHints()
{
    //console.log("showing hints")
    document.body.classList.add("show-inside");
    document.getElementById("hints").classList.add("hints-show");
    //console.log("showed hints");
}

function writeText()
{
    let id = setInterval(function() {
        line.innerHTML += string.charAt(index);
        index++;
        if (string.charAt(index) == "<")
        {
            let lastIndex = index;
            index = string.indexOf(">", index)+1;
            line.innerHTML += string.substring(lastIndex, index);
            clearInterval(id);
            setTimeout(writeText, 500);
        }
        if (index >= string.length)
        {
            showHints();
            clearInterval(id);
        }
    }, 25);
}

setTimeout(writeText, 500);