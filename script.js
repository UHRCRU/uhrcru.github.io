let canvas = document.querySelector("canvas");
let ctx = canvas.getContext('2d');
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
//let str = "A+jk js:2 @dfs 17 tr YY ufds M5r P87 #18 $!& ^dfs $Ew er JH # $ * . (! ;) ,: :";
let str = "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z 0 1 2 3 4 5 6 7 8 9";
let matrix = str.split("");
let font = 15;
let col = width / font;
let arr = [];

for(let i=0; i<col; i++) {
    arr[i] = 1;
}

const draw = () => {
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#00FF00";
    ctx.font = `${font}px system-ui`;

    for(let i=0; i<arr.length; i++) {
        let txt = matrix[Math.floor(Math.random() * matrix.length)];
        ctx.fillText(txt, i * font, arr[i] * font);

        if(arr[i] * font > height && Math.random() > 0.975) {
            arr[i] = 0;
        }
        arr[i]++;
    }
}
//setInterval(draw, 20);
let lastTime = 0;
const fps = 30; // Adjust this value to control the speed (lower = slower)
const interval = 1000 / fps;

function animate(currentTime) {
    if (currentTime - lastTime >= interval) {
        draw();
        lastTime = currentTime;
    }
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
// Remove the setInterval(draw, 20); line

window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    col = width / font;
    arr = Array(Math.ceil(col)).fill(1);
});
