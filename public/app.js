/* eslint-env browser */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

class VoiceBot {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.chatContainer = document.getElementById('chat-container');
        this.micButton = document.getElementById('micButton');
        this.clearButton = document.getElementById('clearButton');
        this.suggestionButtons = document.querySelectorAll('.suggestion-btn');
        
        this.initializeSpeechRecognition();
        this.setupEventListeners();
    }

    initializeSpeechRecognition() {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.handleUserMessage(transcript);
            };

            this.recognition.onend = () => {
                this.stopListening();
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.stopListening();
                this.addMessage('Sorry, there was an error with the speech recognition. Please try again.', 'bot');
            };
        } else {
            this.micButton.disabled = true;
            this.addMessage('Speech recognition is not supported in your browser. Please use Chrome or Edge.', 'bot');
        }
    }

    setupEventListeners() {
        this.micButton.addEventListener('click', () => {
            if (this.isListening) {
                this.stopListening();
            } else {
                this.startListening();
            }
        });

        this.clearButton.addEventListener('click', () => {
            this.clearChat();
        });

        this.suggestionButtons.forEach(button => {
            button.addEventListener('click', () => {
                const question = button.textContent;
                this.handleUserMessage(question);
            });
        });
    }

    startListening() {
        if (this.recognition) {
            this.recognition.start();
            this.isListening = true;
            this.micButton.classList.add('listening');
            this.micButton.innerHTML = `
                <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Stop Listening
            `;
        }
    }

    stopListening() {
        if (this.recognition) {
            this.recognition.stop();
            this.isListening = false;
            this.micButton.classList.remove('listening');
            this.micButton.innerHTML = `
                <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                </svg>
                Start Listening
            `;
        }
    }    async handleUserMessage(message) {
        this.addMessage(message, 'user');
        
        try {
            const response = await fetch('/api/chat/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            this.addMessage(data.message, 'bot');
            this.speakResponse(data.message);
        } catch (error) {
            console.error('Error:', error);
            this.addMessage('Sorry, there was an error processing your request. Please try again.', 'bot');
        }
    }

    addMessage(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = sender === 'user' ? 'user-message' : 'bot-message';
        messageDiv.textContent = message;
        this.chatContainer.appendChild(messageDiv);
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }

    speakResponse(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1;
            utterance.pitch = 1;
            window.speechSynthesis.speak(utterance);
        }
    }

    clearChat() {
        this.chatContainer.innerHTML = `
            <div class="bot-message">
                Hello! I'm your voice assistant. Click the microphone button and ask me anything!
            </div>
        `;
          fetch('/api/chat/clear', {
            method: 'POST',
        }).catch(error => {
            console.error('Error clearing chat:', error);
        });
    }
}

// Initialize the voice bot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new VoiceBot();
}); 