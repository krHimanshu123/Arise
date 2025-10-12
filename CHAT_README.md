# 🤖 Arise AI Chat - Professional Agentic Chatbot

A production-ready, professional AI-powered chatbot built with Next.js 15, featuring agentic capabilities, voice interactions, and seamless integration with your existing Arise career coaching platform.

## ✨ Features

### 🧠 **Advanced AI Capabilities**
- **Google Gemini Integration**: Powered by Google's latest Gemini AI model for intelligent conversations
- **Agentic Actions**: Execute real-world tasks like fetching data, managing todos, checking weather
- **Context Memory**: Persistent conversation history with localStorage (server-side ready)
- **Multi-turn Conversations**: Maintains context across multiple interactions

### 🎨 **Professional UI/UX**
- **Modern Design**: Clean, professional interface with gradient backgrounds and glass-morphism effects
- **Framer Motion Animations**: Smooth transitions, message bubbles, typing indicators
- **Fully Responsive**: Optimized for mobile, tablet, and desktop
- **Dark Theme**: Matches your existing Arise brand aesthetic
- **Real-time Status**: Visual feedback for agent actions and task execution

### 🗣️ **Voice Interactions**
- **Speech Recognition**: Voice input using Web Speech API
- **Text-to-Speech**: AI responses can be spoken aloud
- **Smart Voice Commands**: Automatic parsing of voice commands
- **Voice Controls**: Easy toggle for voice features

### ⚙️ **Agent Actions**
- **GitHub Integration**: Fetch repository statistics and information
- **Weather Service**: Get real-time weather data for any location
- **Todo Management**: Create, read, update, and delete todo items
- **Mathematical Calculator**: Perform calculations and mathematical operations
- **Time Services**: Get current time in any timezone
- **Web Search**: Simulated search functionality (extensible to real APIs)
- **Email Integration**: Send emails (simulation ready for production services)

## 🚀 Setup Instructions

### 1. Environment Variables

Copy the template file and configure your API keys:

```bash
cp .env.chat.template .env.local
```

Add your API keys to `.env.local`:

```env
# Required: Google Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Enhanced functionality
GITHUB_TOKEN=your_github_token_here
OPENWEATHER_API_KEY=your_openweather_api_key_here
```

### 2. Get API Keys

#### **Google Gemini API Key** (Required)
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env.local` file

#### **GitHub Token** (Optional - for higher rate limits)
1. Go to [GitHub Settings > Personal Access Tokens](https://github.com/settings/tokens)
2. Generate a new token with `public_repo` scope
3. Add it to your `.env.local` file

#### **OpenWeather API Key** (Optional - for weather features)
1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your free API key
3. Add it to your `.env.local` file

### 3. Install Dependencies

All required packages are already included in your `package.json`:

```bash
npm install
```

### 4. Start Development

```bash
npm run dev
```

Visit `http://localhost:3000/chat` to access the AI assistant.

## 📁 File Structure

```
app/
├── api/
│   ├── chat/
│   │   └── gemini/
│   │       └── route.js          # Gemini AI integration
│   └── actions/                  # Agent action endpoints
│       ├── github/route.js       # GitHub stats
│       ├── weather/route.js      # Weather data
│       ├── todo/route.js         # Todo management
│       ├── email/route.js        # Email sending
│       ├── time/route.js         # Time services
│       ├── calculate/route.js    # Mathematical calculations
│       └── search/route.js       # Web search
└── (main)/
    └── chat/
        └── page.jsx              # Chat interface page

components/
└── chat/
    ├── ChatWindow.jsx            # Main chat container
    ├── MessageBubble.jsx         # Individual message component
    ├── InputBox.jsx              # Input with voice support
    └── TaskCard.jsx              # Action status display

lib/
├── chat-actions.js               # Action dispatcher
└── voice-manager.js              # Voice interaction utilities
```

## 🎯 Usage Examples

### Basic Conversation
```
User: "Hello! How are you today?"
AI: "Hello! I'm doing great and ready to help you with questions or tasks..."
```

### Agent Actions
```
User: "What's the weather in Tokyo?"
AI: [Executes weather action] 🌤️ Weather in Tokyo: Clear, 22°C (feels like 24°C)

User: "Fetch GitHub stats for microsoft/vscode"
AI: [Executes GitHub action] 📊 vscode: 180,234 stars, 31,456 forks, 6,123 open issues

User: "Create a todo: Review project proposal"
AI: [Executes todo action] ✅ Todo created: "Review project proposal"
```

### Voice Interactions
- Click the microphone button to start voice input
- AI responses can be spoken aloud (toggle with speaker button)
- Voice commands are automatically parsed and executed

## 🔧 Agent Actions Reference

### Available Actions

| Action | Description | Parameters | Example |
|--------|-------------|------------|---------|
| `fetch_github_stats` | Get GitHub repository information | `owner`, `repo` | "Get stats for facebook/react" |
| `fetch_weather` | Get weather for a location | `location` | "Weather in London" |
| `create_todo` | Create a new todo item | `title`, `description?` | "Create todo: Buy groceries" |
| `get_time` | Get current time | `timezone?` | "What time is it in Tokyo?" |
| `calculate` | Perform calculations | `expression` or `operation`, `a`, `b` | "Calculate 15% of 250" |
| `search_web` | Search the web | `query` | "Search for Next.js tutorials" |
| `send_email` | Send an email | `to`, `subject`, `body?` | "Send email to john@example.com" |

### Action Responses

Actions return structured data that's automatically formatted for display:

```javascript
// GitHub stats response
{
  name: "repository-name",
  stargazers_count: 1234,
  forks_count: 567,
  description: "Project description..."
}

// Weather response  
{
  location: "Tokyo",
  temperature: 22,
  description: "Clear sky",
  humidity: 65
}
```

## 🔒 Security & Production Notes

### API Security
- All API keys are server-side only (never exposed to client)
- Input validation and sanitization on all endpoints
- Rate limiting recommended for production
- CORS configuration for additional security

### Voice Privacy
- Voice recognition uses browser's built-in Speech API
- No audio data is sent to external servers
- Voice features work offline (recognition) and online (synthesis)

### Action Safety
- Action allowlist prevents unauthorized commands
- Input validation on all action parameters
- Error handling with graceful fallbacks
- Audit logging recommended for production

## 🚀 Production Deployment

### Environment Setup
1. Set up production environment variables
2. Configure database for persistent chat history
3. Set up email service (SendGrid, Postmark, etc.)
4. Configure monitoring and logging

### Performance Optimizations
- Implement response caching for repeated actions
- Add database connection pooling
- Set up CDN for static assets
- Enable gzip compression

### Monitoring
- Track API usage and response times
- Monitor action success/failure rates
- Log chat interactions for improvement
- Set up alerts for system health

## 🔧 Customization

### Adding New Actions

1. **Create API endpoint** in `app/api/actions/[action]/route.js`
2. **Add action to dispatcher** in `lib/chat-actions.js`
3. **Update AI prompt** in `app/api/chat/gemini/route.js`
4. **Test the integration**

Example new action:
```javascript
// app/api/actions/calendar/route.js
export async function POST(req) {
  const { title, date, time } = await req.json();
  // Integrate with calendar API
  return NextResponse.json({ event_id: "123", status: "created" });
}
```

### Styling Customization

The UI uses Tailwind CSS with your existing design system:
- Colors match your gradient brand palette
- Glass-morphism effects for modern look
- Responsive breakpoints for all devices
- Dark theme integration

### Voice Customization

Configure voice settings in `lib/voice-manager.js`:
```javascript
const voiceSettings = {
  rate: 0.9,        // Speech speed
  pitch: 1.0,       // Voice pitch
  volume: 0.8,      // Volume level
  language: 'en-US' // Language/accent
};
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of the Arise career coaching platform. All rights reserved.

## 🆘 Support

For support and questions:
- Check the troubleshooting section below
- Open an issue for bugs or feature requests
- Contact the development team for urgent issues

---

## 🔧 Troubleshooting

### Common Issues

**Voice not working:**
- Ensure HTTPS connection (required for microphone access)
- Check browser permissions for microphone
- Try refreshing the page

**API errors:**
- Verify API keys in `.env.local`
- Check API key permissions and quotas
- Ensure environment variables are properly loaded

**Actions not executing:**
- Check browser console for errors
- Verify API endpoint responses
- Test actions individually via API routes

**Styling issues:**
- Clear browser cache
- Check Tailwind CSS compilation
- Verify responsive breakpoints

### Browser Compatibility

- **Chrome/Edge**: Full support for all features
- **Firefox**: Full support with voice features
- **Safari**: Limited voice synthesis support
- **Mobile browsers**: Touch-optimized interface

### Performance Tips

- Clear chat history periodically
- Disable voice if not needed
- Use specific action commands for better responses
- Keep messages concise for better processing

---

**Built with ❤️ for the Arise platform**