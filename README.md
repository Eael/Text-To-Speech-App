# Text-To-Speech App

A modern, responsive React frontend application that converts text to speech using the Web Speech API. This app can be hosted as a static website and works in all modern browsers that support speech synthesis.

## Features

- 🎤 **Text-to-Speech Conversion**: Enter any text and convert it to natural-sounding speech
- 🎛️ **Voice Controls**: Choose from available system voices with different languages and accents
- ⚡ **Playback Controls**: Play, pause, resume, and stop speech playback
- 🎚️ **Customizable Settings**:
  - Speech rate (0.5x to 2x speed)
  - Pitch adjustment (0.5 to 2.0)
  - Volume control (0% to 100%)
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- ♿ **Accessible**: Built with accessibility best practices
- 🌐 **Browser Compatible**: Works in all modern browsers with Web Speech API support

## Demo

The app provides a clean, intuitive interface with:
- Large text input area (up to 5,000 characters)
- Real-time character count
- Visual feedback during speech playback
- Voice selection dropdown
- Slider controls for speech parameters

## Installation & Setup

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/Eael/Text-To-Speech-App.git
cd Text-To-Speech-App
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Building for Production

Create a production build optimized for deployment:

```bash
npm run build
```

This creates a `build` folder with static files that can be hosted on any web server.

### Testing

Run the test suite:

```bash
npm test
```

## Deployment Options

### Static Hosting Services

The built application can be deployed to any static hosting service:

- **Netlify**: Drag and drop the `build` folder
- **Vercel**: Connect your GitHub repository
- **GitHub Pages**: Upload build files to gh-pages branch
- **AWS S3**: Upload build files to S3 bucket with static website hosting
- **Firebase Hosting**: Use Firebase CLI to deploy

### Simple Static Server

For local testing of the production build:

```bash
npm install -g serve
serve -s build
```

## Browser Compatibility

The Web Speech API is supported in:
- Chrome/Chromium (recommended)
- Edge
- Safari
- Firefox (limited voice selection)

**Note**: HTTPS is required for speech synthesis to work in production environments.

## Project Structure

```
src/
├── components/           # React components
│   ├── TextInput.tsx    # Text input area
│   ├── PlaybackControls.tsx  # Play/pause/stop controls
│   └── ControlPanel.tsx # Voice and speech settings
├── hooks/               # Custom React hooks
│   └── useSpeechSynthesis.ts  # Speech API integration
├── App.tsx              # Main application component
├── App.css              # Application styles
└── index.tsx            # Application entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Technologies Used

- **React 19**: Modern React with hooks
- **TypeScript**: Type-safe JavaScript
- **Web Speech API**: Browser-native speech synthesis
- **CSS3**: Modern styling with flexbox and grid
- **React Testing Library**: Component testing

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built with Create React App
- Uses the browser's native Web Speech API
- Responsive design inspired by modern web applications