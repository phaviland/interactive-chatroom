var socket = io('http://localhost:3000/');
var c = document.getElementById('myCanvas');
var ctx = c.getContext('2d');

var square;
var squares = new Array();

window.requestAnimationFrame(animate);

socket.on('update', function (squaresList) {
    squares = squaresList;
});

function init(name) {
    square = { x: Math.floor(Math.random() * 790), y: Math.floor(Math.random() * 590), name: name, message: '' };

    socket.emit('signin', square, function (data) {
        if (data === true) {
            document.getElementById("nameForm").style.display = "none";
            document.getElementById("errorMessage").style.display = "none";
            document.getElementById("messageForm").style.display = "block";
        } else {
            document.getElementById('errorMessage').textContent = data;
        }

    });
}

function sendMessage(message) {
    socket.emit('sendmessage', message);
    document.getElementById('message').value = '';
}

function animate() {
    requestAnimationFrame(animate);

    ctx.beginPath();
    ctx.clearRect(0, 0, 800, 600);

    squares.forEach((obj, i) => {
        ctx.rect(obj.x, obj.y, 10, 10);
        ctx.font = '16px Arial';
        ctx.fillText(obj.name, obj.x, obj.y + 25);
        if (obj.message !== '')
            ctx.fillText(obj.message, obj.x, obj.y - 5);
    });

    ctx.closePath();
    ctx.stroke();
}

document.addEventListener('keydown', (event) => {
    const keyName = event.key;

    if (square === undefined)
        return;

    if (keyName === 'ArrowUp') {
        if (square.y > 10) {
            square.y = square.y - 10;
            socket.emit('move', square.x, square.y);
        }
    } else if (keyName === 'ArrowDown') {
        if (square.y < 590) {
            square.y = square.y + 10;
            socket.emit('move', square.x, square.y);
        }
    } else if (keyName === 'ArrowLeft') {
        if (square.x > 10) {
            square.x = square.x - 10;
            socket.emit('move', square.x, square.y);
        }
    } else if (keyName === 'ArrowRight') {
        if (square.x < 790) {
            square.x = square.x + 10;
            socket.emit('move', square.x, square.y);
        }
    }
}, false);