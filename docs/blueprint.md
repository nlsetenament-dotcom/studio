# **App Name**: Altered Self

## Core Features:

- AI-Powered Conversation: Engage in realistic and evolving conversations with an AI companion, powered by Genkit and the gemini-2.5-flash model.
- Personality Progression: The AI companion's personality evolves over time based on user interactions and difficulty settings, with stringent rules preventing superficial progress.
- Realistic AI Responses: The AI uses getCurrentDateTimeTool to generate contextually relevant responses.
- Dynamic Difficulty Levels: Experience varied AI behaviors with different difficulty settings (Easy, Hard/Expert, Ultra Hard) affecting AI openness and responsiveness.
- Conflict system: AI tool with a system that makes the IA react negatively if the user is being rude. The intensity of this reaction is related to the state of the relationship.
- UI Message Display: Displays messages in a full-screen chat interface, user messages on the right with a soft pink background, and AI messages on the left with a crema background.
- Loading Animation: Implements loading screens with animated progress bars and fade-in transitions for a smoother user experience.

## Style Guidelines:

- Primary color: Soft pink (#F4C2C2) for user messages and interactive elements.
- Background color: Crema (#F5F5DC) to provide a warm and inviting feel to the chat interface.
- Accent color: Coral (#FF7F50) for highlighting interactive elements and progress bars.
- Headline and body font: 'Alegreya', a serif font, provides a literary and elegant feel, and will be used for both headlines and body text.
- Full-screen design for chat interface with a fixed header (avatar, name, relationship status) and fixed input bar.
- Typing animation with animated dots while the AI is generating a response, with realistic delays calculated based on response length.
- Zoom-in animation for the logo in the loading screen.