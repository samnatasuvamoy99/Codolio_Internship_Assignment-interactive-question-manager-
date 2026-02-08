import { Topic, SubTopic } from '../types';

export const getProgressPercentage = (topic: Topic): number => {
  let totalQuestions = 0;
  let completedQuestions = 0;

  topic.subtopics.forEach(subtopic => {
    subtopic.questions.forEach(question => {
      totalQuestions++;
      if (question.completed) {
        completedQuestions++;
      }
    });
  });

  return totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;
};

export const getSubTopicProgress = (subtopic: SubTopic): { completed: number; total: number } => {
  const total = subtopic.questions.length;
  const completed = subtopic.questions.filter(q => q.completed).length;
  return { completed, total };
};

export const getDifficultyColor = (difficulty?: string): string => {
  switch (difficulty) {
    case 'Easy':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'Medium':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'Hard':
      return 'text-red-600 bg-red-50 border-red-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

export const generateId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
