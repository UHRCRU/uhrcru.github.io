let canvas = document.querySelector("canvas");
let ctx = canvas.getContext('2d');
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789 !@#$%^&*()_+-=[]{}|\\;:'\",.<>?/`~";
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

let lastTime = 0;
const fps = 30;
const interval = 1000 / fps;

function animate(currentTime) {
    if (currentTime - lastTime >= interval) {
        draw();
        lastTime = currentTime;
    }
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

let resizeTimeout;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        col = width / font;
        arr = Array(Math.ceil(col)).fill(1);
        ctx.fillStyle = "rgba(0,0,0,1)";
        ctx.fillRect(0, 0, width, height);
    }, 250);
});

document.addEventListener('DOMContentLoaded', function() {
    const emailIcon = document.getElementById('email-icon');
    const emailAddress = document.getElementById('email-address');
    const originalEmail = emailAddress.textContent;
    
    emailIcon.addEventListener('click', function(event) {
        event.preventDefault();
        
        if (emailAddress.style.display === 'none' || emailAddress.style.display === '') {
            emailAddress.style.display = 'inline';
            glitchEffect(emailAddress, originalEmail);
        } else {
            emailAddress.style.display = 'none';
        }
    });
    
    function glitchEffect(element, text) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:'\",.<>?/`~";
        let iterations = 0;
        const maxIterations = 5; // Reduced from 10 to 5
        const interval = 30; // Reduced from 50 to 30
        
        const glitchInterval = setInterval(() => {
            let newText = text.split('').map((char, index) => {
                if (index < iterations) {
                    return char;
                }
                return chars[Math.floor(Math.random() * chars.length)];
            }).join('');
            
            element.textContent = newText;
            
            if (iterations >= text.length) {
                clearInterval(glitchInterval);
                element.textContent = text;
            }
            
            iterations += 1 / maxIterations;
        }, interval);
    }
});