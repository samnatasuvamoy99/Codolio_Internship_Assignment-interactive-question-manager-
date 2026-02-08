<<<<<<< HEAD
# Codolio_Internship_Assignment-interactive-question-manager-
======= Header Section 

![image alt](https://github.com/samnatasuvamoy99/Codolio_Internship_Assignment-interactive-question-manager-/blob/66da69fa08c6e73031b50f5be30908f6b1229244/Screenshot%202026-02-08%20235554.png)

========= Body

![image alt](https://github.com/samnatasuvamoy99/Codolio_Internship_Assignment-interactive-question-manager-/blob/8d4a41a8e3d76976d0823cfb5d2874da9a8ddc6d/Main_Page.png)

========== Question ui

![image alt](https://github.com/samnatasuvamoy99/Codolio_Internship_Assignment-interactive-question-manager-/blob/b877220b32e7fbe25324ed14e07775ff18939c22/Question_Tropic.png)
# Question Tracker - Interactive DSA Question Management System

A modern, feature-rich web application for managing hierarchical DSA (Data Structures & Algorithms) questions organized by topics and subtopics. Built with React, TypeScript, Redux Toolkit, and dnd-kit for seamless drag-and-drop functionality.

![Question Tracker](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.0.1-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-cyan)

##  Features

### Core Functionality
-  **Topic Management**: Create, edit, and delete topics with descriptions
- **SubTopic Organization**: Nested subtopics within topics for better organization
- **Question Tracking**: Add questions with difficulty levels, links, and video solutions
- **Drag & Drop Reordering**: Intuitive drag-and-drop for topics, subtopics, and questions
-  **Progress Tracking**: Visual progress indicators at topic and overall levels
-  **Expand/Collapse**: Smooth animations for expanding/collapsing sections
-  **Completion Status**: Mark questions as completed with visual feedback

### User Experience
-  **Modern UI**: Clean, professional design with Tailwind CSS
-  **Smooth Animations**: Powered by Framer Motion
- **Responsive Design**: Works seamlessly on desktop and mobile
-  **Accessibility**: Keyboard navigation and focus management
-  **Intuitive Controls**: Hover states and clear action buttons

##  Tech Stack

### Frontend Framework
- **React 18.2** - Component-based UI library
- **TypeScript 5.3** - Type-safe development
- **Vite** - Fast build tool and dev server

### State Management
- **Redux Toolkit** - Modern Redux with less boilerplate
- **React Redux** - Official React bindings for Redux

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Beautiful icon library

### Drag & Drop
- **@dnd-kit/core** - Modern drag-and-drop toolkit
- **@dnd-kit/sortable** - Sortable list functionality
- **@dnd-kit/utilities** - Utility functions

### Form Handling
- **React Hook Form** - Performant form validation

### API Integration
- **Axios** - HTTP client for API calls

## Project Structure

```
src/
├── components/
│   ├── topic/
│   │   └── TopicCard.tsx         # Topic component with subtopics
│   ├── subtopic/
│   │   └── SubTopicCard.tsx      # SubTopic component with questions
│   ├── question/
│   │   └── QuestionRow.tsx       # Individual question row
│   └── common/
│       ├── Button.tsx            # Reusable button component
│       ├── Modal.tsx             # Modal dialog component
│       └── Input.tsx             # Form input component
├── pages/
│   └── SheetPage.tsx             # Main page with DnD context
├── store/
│   └── useSheetStore.ts          # Redux store with slices
├── services/
│   └── sheetApi.ts               # API service layer
├── hooks/
│   └── useToggle.ts              # Custom React hooks
├── utils/
│   └── helpers.ts                # Utility functions
├── data/
│   └── sampleData.ts             # Sample data for testing
├── types/
│   └── index.ts                  # TypeScript type definitions
├── styles/
│   └── global.css                # Global styles
├── App.tsx                       # Root component
└── main.tsx                      # Application entry point
```

##  Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd question-tracker
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Start development server**
```bash
npm run dev
# or
yarn dev
```

4. **Build for production**
```bash
npm run build
# or
yarn build
```

5. **Preview production build**
```bash
npm run preview
# or
yarn preview
```

##  Usage

### Adding a Topic
1. Click "Add Topic" button in the header
2. Enter topic title and optional description
3. Click "Add Topic" to create

### Adding a SubTopic
1. Hover over a topic to reveal action buttons
2. Click the "+" button
3. Enter subtopic title
4. Click "Add SubTopic"

### Adding a Question
1. Expand a subtopic
2. Click "Add Question" or the "+" button
3. Fill in question details:
   - Title (required)
   - Difficulty (Easy/Medium/Hard)
   - Problem link
   - Video solution link
4. Click "Add Question"

### Reordering Elements
1. Click and hold the grip icon (⋮⋮) on any topic, subtopic, or question
2. Drag to desired position
3. Release to drop

### Marking Questions Complete
- Click the checkbox next to any question to mark it as complete
- Progress bars update automatically

### Editing & Deleting
- Hover over any element to reveal edit and delete buttons
- Click edit to modify details
- Click delete to remove (with confirmation)

##  Design Philosophy

The application follows a **modern, professional aesthetic** with:

- **Clean Typography**: DM Serif Display for headings, Inter for body text
- **Cohesive Color Scheme**: Blue primary colors with semantic accent colors
- **Smooth Interactions**: Framer Motion animations for delightful UX
- **Visual Hierarchy**: Clear distinction between topics, subtopics, and questions
- **Progress Visualization**: Circular progress indicators and linear progress bars

##  API Integration

The app includes a service layer (`sheetApi.ts`) with:

- `getSheetBySlug()` - Fetch sheet data from Codolio API
- Mock CRUD operations for topics, subtopics, and questions
- Easy to extend with real backend endpoints

### Example API Usage

```typescript
import { sheetApi } from './services/sheetApi';

// Fetch sheet data
const sheet = await sheetApi.getSheetBySlug('striver-sde-sheet');

// Create topic (mock)
await sheetApi.createTopic(sheetId, { title: 'Arrays', description: '...' });
```

##  State Management

Redux Toolkit provides:

- **Centralized State**: Single source of truth
- **Immutable Updates**: Safe state modifications
- **DevTools Integration**: Time-travel debugging
- **Type Safety**: Full TypeScript support

### Key Actions

- `addTopic`, `updateTopic`, `deleteTopic`
- `addSubTopic`, `updateSubTopic`, `deleteSubTopic`
- `addQuestion`, `updateQuestion`, `deleteQuestion`
- `reorderTopics`, `reorderSubTopics`, `reorderQuestions`
- `toggleTopicExpand`, `toggleSubTopicExpand`
- `toggleQuestionComplete`

## Features in Detail

### Progress Tracking
- **Topic Level**: Shows % completion based on all questions in subtopics
- **Overall Progress**: Displayed in header showing total completion
- **Visual Indicators**: Circular progress rings and linear bars

### Drag & Drop
- **Smooth Animations**: Natural movement during drag operations
- **Visual Feedback**: Hover states and drag overlays
- **Collision Detection**: Intelligent drop zone detection
- **Accessibility**: Keyboard support for reordering

### Form Validation
- **React Hook Form**: Performant validation without re-renders
- **Error Messages**: Clear, inline error feedback
- **Required Fields**: Enforced validation rules

## Development

### Code Quality
```bash
# Run ESLint
npm run lint

# Type checking
tsc --noEmit
```

### Folder Conventions
- Components use PascalCase naming
- Hooks use camelCase with 'use' prefix
- Utilities use descriptive function names
- Types are defined in centralized files




##  Acknowledgments

- Codolio for API reference
- React team for amazing framework
- Tailwind Labs for utility-first CSS
- dnd-kit team for excellent drag-and-drop



>>>>>>> 22bfb4f (Initial commit)
