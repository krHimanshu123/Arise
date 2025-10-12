# 🚀 Quick Setup Guide for AI Chat in Hero Section

## Setup Instructions

### 1. Environment Configuration

Copy the template environment file:
```bash
cp .env.chat.template .env.local
```

### 2. Required API Key

Add your Google Gemini API key to `.env.local`:

```env
# Required for AI Chat functionality
GEMINI_API_KEY=your_gemini_api_key_here
```

**Get your free Gemini API key:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key and paste it in your `.env.local` file

### 3. Optional Enhancements

For enhanced functionality, also add:

```env
# For GitHub repository stats
GITHUB_TOKEN=your_github_token_here

# For weather functionality  
OPENWEATHER_API_KEY=your_openweather_api_key_here
```

### 4. Start the Application

```bash
npm run dev
```

### 5. Test the Chat

1. Visit your home page at `http://localhost:3000`
2. **For signed-in users**: Click the "AI Chat" button in the hero section
3. **For signed-out users**: The AI Chat card will link to `/chat`
4. Try asking questions like:
   - "Help me improve my resume"
   - "What's the weather in New York?"
   - "Give me interview tips"
   - "Create a todo: Practice coding"

## Features Available in Hero Chat

- ✅ **Instant Career Advice**: Resume tips, interview prep, career guidance
- ✅ **Agent Actions**: Weather, GitHub stats, todos, calculations
- ✅ **Quick Responses**: Optimized for shorter conversations
- ✅ **Persistent History**: Conversations saved across sessions
- ✅ **Mobile Optimized**: Works perfectly on all devices
- ✅ **Link to Full Chat**: Easy access to the complete chat experience

## Troubleshooting

**Chat not working?**
- Ensure `GEMINI_API_KEY` is set in `.env.local`
- Check browser console for any errors
- Verify API key is valid

**Actions failing?**
- Check if optional API keys are needed for specific actions
- Some actions work without additional keys (time, calculator)

**Not seeing the chat button?**
- Make sure you're signed in to see the button in the header
- Signed-out users will see the AI Chat card in the feature grid

## Architecture

The hero chat uses a simplified `HeroChatWindow` component that:
- Shows only the last 10 messages for performance
- Has a compact design for the modal
- Links to the full chat experience
- Shares the same conversation history

This gives users a quick taste of the AI assistant while encouraging them to explore the full chat interface for extended conversations.

---

**Your AI Career Assistant is now ready to help users directly from the hero section! 🎉**