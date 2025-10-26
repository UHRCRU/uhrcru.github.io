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
    
  // Collapsible project sections
  document.addEventListener('DOMContentLoaded', function() {
    const toggleButtons = document.querySelectorAll('.projects-toggle-btn');
    toggleButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        const targetSelector = btn.getAttribute('data-target');
        const target = document.querySelector(targetSelector);
        if (target) {
          const isVisible = target.style.display === 'block';
          // Hide all sections first
          document.querySelectorAll('.projects-collapsible').forEach(sec => sec.style.display = 'none');
          // Toggle current
          target.style.display = isVisible ? 'none' : 'block';
        }
      });
    });
  });

const chatToggle = document.getElementById('chat-toggle');
const chatInterface = document.getElementById('chat-interface');
const userInput = document.getElementById('user-input');
const messagesContainer = document.getElementById('chat-messages');

chatToggle.addEventListener('click', () => {
  chatInterface.classList.toggle('open');
});

userInput.addEventListener('keypress', async (e) => {
  if (e.key === 'Enter') {
    const userMessage = userInput.value.trim();
    if (userMessage) {
      // Add user message to UI
      addMessage(userMessage, 'user');
      
      // Send message to Firebase AI chatbot function
      const botReply = await sendMessageToChatbot(userMessage);

      // Add bot response to UI
      addMessage(botReply, 'bot');

      // Clear input field
      userInput.value = '';
    }
  }
});

const FUNCTION_URL = "https://us-central1-uhrcru-backend.cloudfunctions.net/chat";

async function sendMessageToChatbot(message, { timeoutMs = 15000 } = {}) {
  const threadId = localStorage.getItem("assistantThreadId") || null;
  const body = { message };
  if (threadId) body.threadId = threadId;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const resp = await fetch(FUNCTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
      credentials: "omit"
    });

    clearTimeout(timeout);

    // network-level error
    if (!resp.ok) {
      // try to parse JSON error (server may return { error, reply } shapes)
      let errBody;
      try { errBody = await resp.json(); } catch (e) { throw new Error(`Network error: ${resp.status}`); }
      const errMsg = errBody.error || errBody.reply || JSON.stringify(errBody);
      throw new Error(errMsg);
    }

    const json = await resp.json();

    // Expected server shape: { reply: string, threadId?: string }
    if (json.threadId) {
      try { localStorage.setItem("assistantThreadId", json.threadId); } catch (e) { /* storage failures are non-fatal */ }
    }

    if (typeof json.reply === "string" && json.reply.trim()) {
      return json.reply;
    }

    // fallback message if server returned an unexpected shape
    return "Sorry, I couldn't get a response right now.";
  } catch (err) {
    if (err.name === "AbortError") {
      console.error("Chat request timed out");
      return "The request timed out. Please try again.";
    }
    console.error("Chat error:", err);
    return "Oops! Something went wrong.";
  }
}


function addMessage(text, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${sender}`;
  messageDiv.textContent = text;
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
