import { Sheet } from '../types';

export const sampleData: Sheet = {
  id: 'sheet-1',
  title: 'Codolio DSA Question Tracker',
  description: 'Master Data Structures & Algorithms with Codolio Unlock your coding potential with our carefully curated DSA question sheets designed for real interview preparation. Practice smarter, track your progress, and build problem-solving confidence step by step. Whether you re preparing for placements, coding contests, or technical interviews — Codolio helps you level up faster',
  topics: [
    {
      id: 'topic-1',
      title: 'Arrays',
      description: 'Master array manipulation and algorithms',
      order: 0,
      expanded: true,
      subtopics: [
        {
          id: 'subtopic-1-1',
          title: 'Easy Problems',
          order: 0,
          expanded: true,
          questions: [
            {
              id: 'q-1',
              title: 'Two Sum',
              difficulty: 'Easy',
              link: 'https://leetcode.com/problems/two-sum/',
              videoLink: 'https://youtube.com/watch?v=example1',
              completed: false,
              order: 0,
            },
            {
              id: 'q-2',
              title: 'Best Time to Buy and Sell Stock',
              difficulty: 'Easy',
              link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
              completed: true,
              order: 1,
            },
          ],
        },
        {
          id: 'subtopic-1-2',
          title: 'Medium Problems',
          order: 1,
          expanded: false,
          questions: [
            {
              id: 'q-3',
              title: '3Sum',
              difficulty: 'Medium',
              link: 'https://leetcode.com/problems/3sum/',
              completed: false,
              order: 0,
            },
          ],
        },
      ],
    },
    {
      id: 'topic-2',
      title: 'Linked Lists',
      description: 'Work with linked list data structures',
      order: 1,
      expanded: false,
      subtopics: [
        {
          id: 'subtopic-2-1',
          title: 'Basics',
          order: 0,
          expanded: true,
          questions: [
            {
              id: 'q-4',
              title: 'Reverse Linked List',
              difficulty: 'Easy',
              link: 'https://leetcode.com/problems/reverse-linked-list/',
              completed: false,
              order: 0,
            },
          ],
        },
      ],
    },
  ],
};
