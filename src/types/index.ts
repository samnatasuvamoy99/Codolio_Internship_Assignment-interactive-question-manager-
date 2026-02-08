export interface Question {
  id: string;
  title: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard'|'Basic';
  link?: string;
  videoLink?: string;
  completed: boolean;
  order: number;
}

export interface SubTopic {
  id: string;
  title: string;
  questions: Question[];
  order: number;
  expanded: boolean;
}

export interface Topic {
  id: string;
  title: string;
  description?: string;
  subtopics: SubTopic[];
  order: number;
  expanded: boolean;
}

export interface Sheet {
  id: string;
  title: string;
  description?: string;
  topics: Topic[];
}

export type DragType = 'topic' | 'subtopic' | 'question';

export interface DragItem {
  id: string;
  type: DragType;
  parentId?: string;
}
