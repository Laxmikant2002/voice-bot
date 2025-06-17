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
        this.recognitionTimeout = null;
        
        this.initializeSpeechRecognition();
        this.setupEventListeners();
        this.addStatusIndicator();
    }

    initializeSpeechRecognition() {
        // Check for different implementations of the Speech Recognition API
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = true; // Get interim results for better feedback
            this.recognition.lang = 'en-US';
            
            let finalTranscript = '';
            
            this.recognition.onstart = () => {
                console.log('Voice recognition started');
                this.updateStatusIndicator('Listening...', 'listening');
            };

            this.recognition.onresult = (event) => {
                let interimTranscript = '';
                
                // Build the transcript from all results
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interimTranscript += transcript;
                    }
                }
                
                // Show interim results in the status indicator
                if (interimTranscript !== '') {
                    this.updateStatusIndicator(`Listening: ${interimTranscript}`, 'listening');
                }
                
                // Only send the message when we have a final result
                if (finalTranscript !== '') {
                    this.handleUserMessage(finalTranscript);
                    finalTranscript = ''; // Reset for next listening session
                }
            };

            this.recognition.onend = () => {
                console.log('Voice recognition ended');
                this.stopListening();
                this.updateStatusIndicator('Idle', 'idle');
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.stopListening();
                this.updateStatusIndicator('Error', 'error');
                
                const errorMessages = {
                    'network': 'Network error occurred. Check your internet connection.',
                    'no-speech': 'No speech was detected. Please try again.',
                    'aborted': 'Speech recognition was aborted.',
                    'audio-capture': 'No microphone was found or microphone is disabled.',
                    'not-allowed': 'Microphone permission denied. Please allow microphone access.'
                };
                
                const errorMessage = errorMessages[event.error] || 'Sorry, there was an error with the speech recognition. Please try again.';
                this.addMessage(errorMessage, 'bot');
            };
        } else {
            this.micButton.disabled = true;
            this.addMessage('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.', 'bot');
        }
    }
    
    addStatusIndicator() {
        // Add a status indicator element below the mic button
        const controlsDiv = this.micButton.parentElement;
        
        const statusIndicator = document.createElement('div');
        statusIndicator.id = 'status-indicator';
        statusIndicator.className = 'text-sm text-center mt-2 text-gray-600';
        statusIndicator.textContent = 'Idle';
        
        controlsDiv.appendChild(statusIndicator);
        this.statusIndicator = statusIndicator;
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
    }    startListening() {
        if (this.recognition) {
            try {
                // Add pulsing animation and visual feedback
                this.recognition.start();
                this.isListening = true;
                this.micButton.classList.add('listening');
                this.micButton.classList.add('pulse-animation');
                
                // Update UI with modern stop button
                this.micButton.innerHTML = `
                    <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    Stop Listening
                `;
                
                // Add timeout for safety (browser might not fire onend)
                if (this.recognitionTimeout) {
                    clearTimeout(this.recognitionTimeout);
                }
                
                // Auto-stop after 30 seconds if no response
                this.recognitionTimeout = setTimeout(() => {
                    if (this.isListening) {
                        this.stopListening();
                        this.addMessage("I didn't catch that. Could you please try again?", 'bot');
                    }
                }, 30000);
                
                // Show listening indicator in chat
                this.addListeningIndicator();
            } catch (error) {
                console.error('Error starting voice recognition:', error);
                this.addMessage('There was an error starting the voice recognition. Please try again.', 'bot');
                this.stopListening();
            }
        }
    }

    stopListening() {
        if (this.recognition) {
            try {
                this.recognition.stop();
            } catch (error) {
                console.error('Error stopping recognition:', error);
            }
            
            this.isListening = false;
            this.micButton.classList.remove('listening');
            this.micButton.classList.remove('pulse-animation');
            
            // Update UI with modern mic button
            this.micButton.innerHTML = `
                <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                </svg>
                Start Listening
            `;
            
            // Clear timeout if exists
            if (this.recognitionTimeout) {
                clearTimeout(this.recognitionTimeout);
                this.recognitionTimeout = null;
            }
            
            // Remove listening indicator if exists
            this.removeListeningIndicator();
        }
    }
    
    updateStatusIndicator(text, status) {
        if (this.statusIndicator) {
            this.statusIndicator.textContent = text;
            
            // Reset classes
            this.statusIndicator.className = 'text-sm text-center mt-2';
            
            // Add appropriate color based on status
            switch (status) {
                case 'listening':
                    this.statusIndicator.classList.add('text-green-600', 'font-medium');
                    break;
                case 'processing':
                    this.statusIndicator.classList.add('text-blue-600', 'font-medium');
                    break;
                case 'error':
                    this.statusIndicator.classList.add('text-red-600', 'font-medium');
                    break;
                default:
                    this.statusIndicator.classList.add('text-gray-600');
            }
        }
    }
    
    addListeningIndicator() {
        // Remove any existing indicator
        this.removeListeningIndicator();
        
        // Add visual indicator that the bot is listening
        const listeningDiv = document.createElement('div');
        listeningDiv.id = 'listening-indicator';
        listeningDiv.className = 'bot-message listening-indicator';
        
        // Create wave animation for the listening indicator
        const wave = document.createElement('div');
        wave.className = 'listening-wave';
        wave.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        `;
        
        listeningDiv.appendChild(document.createTextNode('Listening'));
        listeningDiv.appendChild(wave);
        
        this.chatContainer.appendChild(listeningDiv);
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }
    
    removeListeningIndicator() {
        const indicator = document.getElementById('listening-indicator');
        if (indicator) {
            indicator.remove();
        }
    }    async handleUserMessage(message) {
        // Validate input
        if (!message || message.trim() === '') {
            this.updateStatusIndicator('No message detected', 'error');
            return;
        }
        
        // Remove listening indicator if present
        this.removeListeningIndicator();
        
        // Use streaming API for better user experience
        if ('ReadableStream' in window && 'TextDecoder' in window) {
            // Use streaming response if browser supports it
            await this.sendStreamingMessage(message);
            return;
        }
        
        // Fallback to non-streaming for older browsers
        // Add user message to chat
        this.addMessage(message, 'user');
        
        // Show processing indicator
        this.updateStatusIndicator('Processing your request...', 'processing');
        
        try {
            const response = await fetch('/api/chat/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Server error: ${response.status}`);
            }

            const data = await response.json();
            
            // Display which AI service responded (if available)
            let aiSource = '';
            if (data.source) {
                aiSource = `<div class="ai-source">${data.source}</div>`;
            }
            
            // Add bot message with AI source if available
            this.addMessage(data.message, 'bot', aiSource);
            
            // Reset status indicator
            this.updateStatusIndicator('Idle', 'idle');
            
            // Speak the response
            this.speakResponse(data.message);
        } catch (error) {
            console.error('Error processing request:', error);
            this.addMessage('Sorry, there was an error processing your request. Please try again.', 'bot');
            this.updateStatusIndicator('Error occurred', 'error');
        }
    }    // Method to send a message and receive a streaming response
    async sendStreamingMessage(message) {
        if (!message.trim()) return;
        
        // Add user message to chat
        this.addMessage(message, 'user');
        
        // Create a placeholder for the bot response that will be updated in real-time
        const botMessageDiv = document.createElement('div');
        botMessageDiv.className = 'bot-message typing';
        
        // Create typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = '<span></span><span></span><span></span>';
        botMessageDiv.appendChild(typingIndicator);
        
        // Create content container that will be updated as chunks arrive
        const contentContainer = document.createElement('div');
        contentContainer.className = 'content-container';
        botMessageDiv.appendChild(contentContainer);
        
        // Add source container that will be updated when we know the AI source
        const sourceContainer = document.createElement('div');
        sourceContainer.className = 'ai-source';
        botMessageDiv.appendChild(sourceContainer);
        
        // Add to chat container
        this.chatContainer.appendChild(botMessageDiv);
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
        
        // Show processing indicator
        this.updateStatusIndicator('Streaming response...', 'streaming');
        
        try {
            // Create EventSource for SSE connection
            const response = await fetch('/api/chat/stream', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Server error: ${response.status}`);
            }
            
            // Set up response reader
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let responseText = '';
            let source = '';
              // Read stream chunks until done
            let streamDone = false;
            while (!streamDone) {
                const { done, value } = await reader.read();
                if (done) {
                    streamDone = true;
                    break;
                }const chunk = decoder.decode(value, { stream: true });
                // Process SSE format - each message starts with "data: " and ends with "\n\n"
                const events = chunk.split('\n\n').filter(Boolean);
                
                for (const event of events) {
                    if (event.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(event.slice(5)); // Remove "data: " prefix
                            
                            if (data.done) {
                                // Stream complete
                                break;
                            } else if (data.error) {
                                // Handle error
                                throw new Error(data.message || 'Error in streaming response');
                            } else if (data.chunk) {
                                // Update text with new chunk
                                responseText += data.chunk;
                                contentContainer.textContent = responseText;
                                
                                // Update AI source if available
                                if (data.source && !source) {
                                    source = data.source;
                                    sourceContainer.textContent = source;
                                }
                                
                                // Auto-scroll to show new content
                                this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
                            }
                        } catch (parseError) {
                            console.error('Error parsing SSE data:', parseError);
                        }
                    }
                }
            }
            
            // Replace typing indicator with final message
            botMessageDiv.classList.remove('typing');
            typingIndicator.remove();
            
            // Reset status indicator
            this.updateStatusIndicator('Idle', 'idle');
            
            // Speak the response
            this.speakResponse(responseText);
            
        } catch (error) {
            console.error('Error with streaming request:', error);
            contentContainer.textContent = 'Sorry, there was an error processing your request. Please try again.';
            sourceContainer.textContent = 'Error';
            botMessageDiv.classList.remove('typing');
            typingIndicator.remove();
            this.updateStatusIndicator('Error occurred', 'error');
        }
    }    addMessage(message, sender, extraHTML = '') {
        const messageDiv = document.createElement('div');
        messageDiv.className = sender === 'user' ? 'user-message' : 'bot-message';
        
        // Create a paragraph for the message text
        const messageParagraph = document.createElement('p');
        messageParagraph.textContent = message;
        messageDiv.appendChild(messageParagraph);
        
        // Add any extra HTML (like AI source indicator)
        if (extraHTML) {
            messageDiv.insertAdjacentHTML('beforeend', extraHTML);
        }
        
        // Add timestamp
        const timestamp = document.createElement('div');
        timestamp.className = 'message-timestamp';
        timestamp.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        messageDiv.appendChild(timestamp);
        
        // Add to chat container with smooth animation
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(10px)';
        this.chatContainer.appendChild(messageDiv);
        
        // Trigger reflow
        void messageDiv.offsetWidth;
        
        // Apply fade-in animation
        messageDiv.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
        
        // Scroll to bottom
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }    speakResponse(text) {
        if ('speechSynthesis' in window) {
            // Clean and optimize text for speech
            const cleanText = this.optimizeForSpeech(text);
            
            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.rate = 1;
            utterance.pitch = 1;
            
            // Add natural pauses at punctuation
            utterance.onboundary = (event) => {
                if (event.name === 'sentence' || event.name === 'word') {
                    // Add slight pause at sentence boundaries
                    if (text[event.charIndex] === '.') {
                        // Small delay between sentences
                        setTimeout(() => {}, 300);
                    }
                }
            };
            
            window.speechSynthesis.speak(utterance);
        }
    }// Optimize text for speech synthesis
    optimizeForSpeech(text) {
        // Remove markdown formatting
        let cleanText = text
            .replace(/\*\*(.*?)\*\*/g, '$1') // Bold text
            .replace(/\*(.*?)\*/g, '$1')     // Italic text
            .replace(/`(.*?)`/g, '$1')       // Code blocks
            .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Links
            .replace(/#{1,6}\s(.*?)(?:\n|$)/g, '$1. ') // Headers
            .replace(/\n\s*[-*+]\s/g, '. ') // List items
            .replace(/\n/g, '. ')           // Newlines to periods for better pausing
            .replace(/\s{2,}/g, ' ')        // Multiple spaces to single space
            .replace(/\.\s*\./g, '.')       // Multiple periods to single
            .trim();
            
        // Handle common abbreviations and symbols for better pronunciation
        cleanText = cleanText
            .replace(/(\d+)%/g, '$1 percent')
            .replace(/&/g, ' and ')
            .replace(/\$/g, ' dollar ')
            .replace(/@/g, ' at ')
            .replace(/#/g, ' number ')
            .replace(/(\d):(\d)/g, '$1 $2') // Time formatting: 2:30 -> 2 30
            .replace(/(\d+)x(\d+)/g, '$1 by $2'); // Dimensions: 1920x1080 -> 1920 by 1080
            
        return cleanText;
    }    clearChat() {
        // Stop listening if active
        if (this.isListening) {
            this.stopListening();
        }
        
        // Clear chat container with animation
        const allMessages = this.chatContainer.querySelectorAll('.user-message, .bot-message');
        
        if (allMessages.length > 0) {
            // Animate messages out
            allMessages.forEach((message, index) => {
                setTimeout(() => {
                    message.style.opacity = '0';
                    message.style.transform = 'translateY(10px)';
                    
                    // Remove after animation
                    setTimeout(() => message.remove(), 300);
                }, index * 100); // Stagger removal
            });
            
            // Add welcome message after all removed
            setTimeout(() => {
                const welcomeMessage = document.createElement('div');
                welcomeMessage.className = 'bot-message';
                welcomeMessage.innerHTML = `
                    <p>Hello! I'm your voice assistant. Click the microphone button and ask me anything!</p>
                `;
                this.chatContainer.appendChild(welcomeMessage);
            }, (allMessages.length * 100) + 300);
        } else {
            // If no messages, just add welcome back
            this.chatContainer.innerHTML = `
                <div class="bot-message">
                    <p>Hello! I'm your voice assistant. Click the microphone button and ask me anything!</p>
                </div>
            `;
        }
        
        // Reset status
        this.updateStatusIndicator('Idle', 'idle');
        
        // Clear on the server
        fetch('/api/chat/clear', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        }).catch(error => {
            console.error('Error clearing chat:', error);
        });
    }
}

// Initialize the voice bot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new VoiceBot();
});