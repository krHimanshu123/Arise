/**
 * Voice interaction utilities for the AI chat
 * Handles both speech recognition (voice input) and speech synthesis (voice output)
 */

export class VoiceManager {
  constructor() {
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.isListening = false;
    this.isSupported = false;
    this.voices = [];
    this.currentUtterance = null;
    
    this.init();
  }

  init() {
    // Initialize speech recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition && this.synthesis) {
        this.isSupported = true;
        
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';
        this.recognition.maxAlternatives = 1;
        
        // Load available voices
        this.loadVoices();
        
        // Update voices when they change
        this.synthesis.onvoiceschanged = () => {
          this.loadVoices();
        };
      }
    }
  }

  loadVoices() {
    this.voices = this.synthesis.getVoices();
  }

  // Get the best available voice for text-to-speech
  getBestVoice() {
    if (this.voices.length === 0) return null;
    
    // Prefer English voices
    const englishVoices = this.voices.filter(voice => 
      voice.lang.startsWith('en-')
    );
    
    if (englishVoices.length > 0) {
      // Prefer neural/high-quality voices
      const neuralVoice = englishVoices.find(voice => 
        voice.name.toLowerCase().includes('neural') ||
        voice.name.toLowerCase().includes('premium') ||
        voice.name.toLowerCase().includes('enhanced')
      );
      
      if (neuralVoice) return neuralVoice;
      
      // Prefer female voices for better clarity
      const femaleVoice = englishVoices.find(voice =>
        voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('woman') ||
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('susan') ||
        voice.name.toLowerCase().includes('karen')
      );
      
      if (femaleVoice) return femaleVoice;
      
      // Use first English voice
      return englishVoices[0];
    }
    
    // Fallback to any voice
    return this.voices[0];
  }

  // Start listening for voice input
  startListening(onResult, onError, onEnd) {
    if (!this.isSupported || !this.recognition) {
      onError?.('Speech recognition not supported');
      return false;
    }

    if (this.isListening) {
      this.stopListening();
    }

    this.isListening = true;

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;
      
      onResult?.({
        transcript,
        confidence,
        isFinal: event.results[0].isFinal
      });
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      onError?.(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onEnd?.();
    };

    try {
      this.recognition.start();
      return true;
    } catch (error) {
      this.isListening = false;
      onError?.(error.message);
      return false;
    }
  }

  // Stop listening for voice input
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  // Speak text using text-to-speech
  speak(text, options = {}) {
    if (!this.isSupported || !text) return false;

    // Stop any current speech
    this.stopSpeaking();

    const {
      rate = 0.9,
      pitch = 1.0,
      volume = 0.8,
      onStart,
      onEnd,
      onError
    } = options;

    this.currentUtterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance.voice = this.getBestVoice();
    this.currentUtterance.rate = rate;
    this.currentUtterance.pitch = pitch;
    this.currentUtterance.volume = volume;

    this.currentUtterance.onstart = () => {
      onStart?.();
    };

    this.currentUtterance.onend = () => {
      this.currentUtterance = null;
      onEnd?.();
    };

    this.currentUtterance.onerror = (event) => {
      this.currentUtterance = null;
      onError?.(event.error);
    };

    try {
      this.synthesis.speak(this.currentUtterance);
      return true;
    } catch (error) {
      onError?.(error.message);
      return false;
    }
  }

  // Stop any current speech
  stopSpeaking() {
    if (this.synthesis.speaking) {
      this.synthesis.cancel();
    }
    this.currentUtterance = null;
  }

  // Check if currently speaking
  isSpeaking() {
    return this.synthesis.speaking;
  }

  // Get available voice options
  getVoiceOptions() {
    return this.voices.map(voice => ({
      name: voice.name,
      lang: voice.lang,
      isDefault: voice.default,
      isLocal: voice.localService
    }));
  }

  // Clean up resources
  destroy() {
    this.stopListening();
    this.stopSpeaking();
  }
}

// Utility functions for voice features
export const voiceUtils = {
  // Extract actionable voice commands
  parseVoiceCommand(transcript) {
    const cleaned = transcript.toLowerCase().trim();
    
    // Common voice command patterns
    const patterns = {
      weather: /(?:what'?s the weather|weather in|weather for|check weather)/i,
      time: /(?:what time|current time|what'?s the time)/i,
      todo: /(?:create todo|add todo|new todo|make a todo)/i,
      github: /(?:github stats|check github|repository stats)/i,
      calculate: /(?:calculate|compute|what'?s|how much is)/i,
      search: /(?:search for|look up|find)/i
    };

    for (const [action, pattern] of Object.entries(patterns)) {
      if (pattern.test(cleaned)) {
        return { action, confidence: 'high', original: transcript };
      }
    }

    return { action: null, confidence: 'none', original: transcript };
  },

  // Format text for better speech synthesis
  formatForSpeech(text) {
    return text
      // Remove markdown-style formatting
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      
      // Replace symbols with words
      .replace(/&/g, 'and')
      .replace(/@/g, 'at')
      .replace(/#/g, 'number')
      .replace(/\$/g, 'dollar')
      .replace(/%/g, 'percent')
      
      // Remove URLs
      .replace(/https?:\/\/[^\s]+/g, 'link')
      
      // Clean up multiple spaces and line breaks
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, '. ')
      .trim();
  },

  // Check if text should be spoken (filter out certain content)
  shouldSpeak(text) {
    if (!text || text.length === 0) return false;
    
    // Don't speak very long messages
    if (text.length > 500) return false;
    
    // Don't speak messages that are mostly technical/code
    const codeIndicators = ['```', 'function', 'const ', 'let ', 'var ', 'import ', 'export '];
    const hasCode = codeIndicators.some(indicator => text.includes(indicator));
    if (hasCode) return false;
    
    // Don't speak error messages that are too technical
    if (text.startsWith('Error:') && text.includes('API')) return false;
    
    return true;
  }
};

// Create a singleton instance
let voiceManagerInstance = null;

export function getVoiceManager() {
  if (typeof window === 'undefined') return null;
  
  if (!voiceManagerInstance) {
    voiceManagerInstance = new VoiceManager();
  }
  
  return voiceManagerInstance;
}