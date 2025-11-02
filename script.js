const chatWindow = document.getElementById('chatWindow');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const micBtn = document.getElementById('micBtn');

function appendMessage(text, sender) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', sender);
  msgDiv.textContent = text;
  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function generateAIResponse(userText) {
  const lowerText = userText.toLowerCase();
  if (lowerText.includes('hello') || lowerText.includes('hi')) {
    return 'Hello! How can I assist you today?';
  }
  if (lowerText.includes('how are you')) {
    return "I'm an AI, but I'm doing great! Thanks for asking.";
  }
  if (lowerText.includes('time')) {
    return `Current time is: ${new Date().toLocaleTimeString()}`;
  }
  return "Sorry, I don't understand that yet. Try asking something else!";
}

function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;
  appendMessage(text, 'user');
  userInput.value = '';
  setTimeout(() => {
    const aiReply = generateAIResponse(text);
    appendMessage(aiReply, 'ai');
  }, 800);
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') sendMessage();
});

// Voice recognition setup
let recognition;
let recognizing = false;

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    recognizing = true;
    micBtn.classList.add('mic-active');
    micBtn.title = 'Listening... Click to stop';
  };

  recognition.onend = () => {
    recognizing = false;
    micBtn.classList.remove('mic-active');
    micBtn.title = 'Voice input';
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    userInput.value = transcript;
    userInput.focus();
  };

  micBtn.addEventListener('click', () => {
    if (recognizing) {
      recognition.stop();
      return;
    }
    recognition.start();
  });
} else {
  micBtn.style.display = 'none'; // Hide mic if unsupported
}
