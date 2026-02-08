import { createSlice, PayloadAction, configureStore } from '@reduxjs/toolkit';
import { Sheet, Topic, SubTopic, Question } from '../types';
import { sampleData } from '../data/sampleData';

interface SheetState {
  sheet: Sheet | null;
  loading: boolean;
  error: string | null;
}

const initialState: SheetState = {
  sheet: sampleData,
  loading: false,
  error: null,
};

const sheetSlice = createSlice({
  name: 'sheet',
  initialState,
  reducers: {
    // Topic actions
    addTopic: (state, action: PayloadAction<Omit<Topic, 'id' | 'order' | 'expanded'>>) => {
      if (state.sheet) {
        const newTopic: Topic = {
          ...action.payload,
          id: `topic-${Date.now()}`,
          order: state.sheet.topics.length,
          expanded: true,
          subtopics: [],
        };
        state.sheet.topics.push(newTopic);
      }
    },
    updateTopic: (state, action: PayloadAction<{ id: string; data: Partial<Topic> }>) => {
      if (state.sheet) {
        const topic = state.sheet.topics.find(t => t.id === action.payload.id);
        if (topic) {
          Object.assign(topic, action.payload.data);
        }
      }
    },
    deleteTopic: (state, action: PayloadAction<string>) => {
      if (state.sheet) {
        state.sheet.topics = state.sheet.topics.filter(t => t.id !== action.payload);
      }
    },
    toggleTopicExpand: (state, action: PayloadAction<string>) => {
      if (state.sheet) {
        const topic = state.sheet.topics.find(t => t.id === action.payload);
        if (topic) {
          topic.expanded = !topic.expanded;
        }
      }
    },
    reorderTopics: (state, action: PayloadAction<{ oldIndex: number; newIndex: number }>) => {
      if (state.sheet) {
        const { oldIndex, newIndex } = action.payload;
        const [removed] = state.sheet.topics.splice(oldIndex, 1);
        state.sheet.topics.splice(newIndex, 0, removed);
        state.sheet.topics.forEach((topic, index) => {
          topic.order = index;
        });
      }
    },

    // SubTopic actions
    addSubTopic: (state, action: PayloadAction<{ topicId: string; data: Omit<SubTopic, 'id' | 'order' | 'expanded' | 'questions'> }>) => {
      if (state.sheet) {
        const topic = state.sheet.topics.find(t => t.id === action.payload.topicId);
        if (topic) {
          const newSubTopic: SubTopic = {
            ...action.payload.data,
            id: `subtopic-${Date.now()}`,
            order: topic.subtopics.length,
            expanded: true,
            questions: [],
          };
          topic.subtopics.push(newSubTopic);
        }
      }
    },
    updateSubTopic: (state, action: PayloadAction<{ topicId: string; subtopicId: string; data: Partial<SubTopic> }>) => {
      if (state.sheet) {
        const topic = state.sheet.topics.find(t => t.id === action.payload.topicId);
        if (topic) {
          const subtopic = topic.subtopics.find(s => s.id === action.payload.subtopicId);
          if (subtopic) {
            Object.assign(subtopic, action.payload.data);
          }
        }
      }
    },
    deleteSubTopic: (state, action: PayloadAction<{ topicId: string; subtopicId: string }>) => {
      if (state.sheet) {
        const topic = state.sheet.topics.find(t => t.id === action.payload.topicId);
        if (topic) {
          topic.subtopics = topic.subtopics.filter(s => s.id !== action.payload.subtopicId);
        }
      }
    },
    toggleSubTopicExpand: (state, action: PayloadAction<{ topicId: string; subtopicId: string }>) => {
      if (state.sheet) {
        const topic = state.sheet.topics.find(t => t.id === action.payload.topicId);
        if (topic) {
          const subtopic = topic.subtopics.find(s => s.id === action.payload.subtopicId);
          if (subtopic) {
            subtopic.expanded = !subtopic.expanded;
          }
        }
      }
    },
    reorderSubTopics: (state, action: PayloadAction<{ topicId: string; oldIndex: number; newIndex: number }>) => {
      if (state.sheet) {
        const topic = state.sheet.topics.find(t => t.id === action.payload.topicId);
        if (topic) {
          const { oldIndex, newIndex } = action.payload;
          const [removed] = topic.subtopics.splice(oldIndex, 1);
          topic.subtopics.splice(newIndex, 0, removed);
          topic.subtopics.forEach((subtopic, index) => {
            subtopic.order = index;
          });
        }
      }
    },

    // Question actions
    addQuestion: (state, action: PayloadAction<{ topicId: string; subtopicId: string; data: Omit<Question, 'id' | 'order'> }>) => {
      if (state.sheet) {
        const topic = state.sheet.topics.find(t => t.id === action.payload.topicId);
        if (topic) {
          const subtopic = topic.subtopics.find(s => s.id === action.payload.subtopicId);
          if (subtopic) {
            const newQuestion: Question = {
              ...action.payload.data,
              id: `q-${Date.now()}`,
              order: subtopic.questions.length,
            };
            subtopic.questions.push(newQuestion);
          }
        }
      }
    },
    updateQuestion: (state, action: PayloadAction<{ topicId: string; subtopicId: string; questionId: string; data: Partial<Question> }>) => {
      if (state.sheet) {
        const topic = state.sheet.topics.find(t => t.id === action.payload.topicId);
        if (topic) {
          const subtopic = topic.subtopics.find(s => s.id === action.payload.subtopicId);
          if (subtopic) {
            const question = subtopic.questions.find(q => q.id === action.payload.questionId);
            if (question) {
              Object.assign(question, action.payload.data);
            }
          }
        }
      }
    },
    deleteQuestion: (state, action: PayloadAction<{ topicId: string; subtopicId: string; questionId: string }>) => {
      if (state.sheet) {
        const topic = state.sheet.topics.find(t => t.id === action.payload.topicId);
        if (topic) {
          const subtopic = topic.subtopics.find(s => s.id === action.payload.subtopicId);
          if (subtopic) {
            subtopic.questions = subtopic.questions.filter(q => q.id !== action.payload.questionId);
          }
        }
      }
    },
    toggleQuestionComplete: (state, action: PayloadAction<{ topicId: string; subtopicId: string; questionId: string }>) => {
      if (state.sheet) {
        const topic = state.sheet.topics.find(t => t.id === action.payload.topicId);
        if (topic) {
          const subtopic = topic.subtopics.find(s => s.id === action.payload.subtopicId);
          if (subtopic) {
            const question = subtopic.questions.find(q => q.id === action.payload.questionId);
            if (question) {
              question.completed = !question.completed;
            }
          }
        }
      }
    },
    reorderQuestions: (state, action: PayloadAction<{ topicId: string; subtopicId: string; oldIndex: number; newIndex: number }>) => {
      if (state.sheet) {
        const topic = state.sheet.topics.find(t => t.id === action.payload.topicId);
        if (topic) {
          const subtopic = topic.subtopics.find(s => s.id === action.payload.subtopicId);
          if (subtopic) {
            const { oldIndex, newIndex } = action.payload;
            const [removed] = subtopic.questions.splice(oldIndex, 1);
            subtopic.questions.splice(newIndex, 0, removed);
            subtopic.questions.forEach((question, index) => {
              question.order = index;
            });
          }
        }
      }
    },

    // Sheet actions
    setSheet: (state, action: PayloadAction<Sheet>) => {
      state.sheet = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  addTopic,
  updateTopic,
  deleteTopic,
  toggleTopicExpand,
  reorderTopics,
  addSubTopic,
  updateSubTopic,
  deleteSubTopic,
  toggleSubTopicExpand,
  reorderSubTopics,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  toggleQuestionComplete,
  reorderQuestions,
  setSheet,
  setLoading,
  setError,
} = sheetSlice.actions;

export const store = configureStore({
  reducer: {
    sheet: sheetSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
