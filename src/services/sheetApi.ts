import axios from 'axios';
import { Sheet } from '../types';

const API_BASE_URL = 'https://node.codolio.com/api/question-tracker/v1';

export const sheetApi = {
  // Fetch sheet by slug
  async getSheetBySlug(slug: string): Promise<Sheet> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/sheet/public/get-sheet-by-slug/${slug}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching sheet:', error);
      throw error;
    }
  },

  // Mock CRUD operations (since no database is required)
  async createTopic(sheetId: string, topicData: any): Promise<any> {
    // Mock API call - in real scenario, this would POST to server
    console.log('Creating topic:', topicData);
    return Promise.resolve({ id: `topic-${Date.now()}`, ...topicData });
  },

  async updateTopic(topicId: string, topicData: any): Promise<any> {
    // Mock API call - in real scenario, this would PUT to server
    console.log('Updating topic:', topicId, topicData);
    return Promise.resolve({ id: topicId, ...topicData });
  },

  async deleteTopic(topicId: string): Promise<void> {
    // Mock API call - in real scenario, this would DELETE from server
    console.log('Deleting topic:', topicId);
    return Promise.resolve();
  },

  async createSubTopic(topicId: string, subtopicData: any): Promise<any> {
    console.log('Creating subtopic:', subtopicData);
    return Promise.resolve({ id: `subtopic-${Date.now()}`, ...subtopicData });
  },

  async updateSubTopic(subtopicId: string, subtopicData: any): Promise<any> {
    console.log('Updating subtopic:', subtopicId, subtopicData);
    return Promise.resolve({ id: subtopicId, ...subtopicData });
  },

  async deleteSubTopic(subtopicId: string): Promise<void> {
    console.log('Deleting subtopic:', subtopicId);
    return Promise.resolve();
  },

  async createQuestion(subtopicId: string, questionData: any): Promise<any> {
    console.log('Creating question:', questionData);
    return Promise.resolve({ id: `q-${Date.now()}`, ...questionData });
  },

  async updateQuestion(questionId: string, questionData: any): Promise<any> {
    console.log('Updating question:', questionId, questionData);
    return Promise.resolve({ id: questionId, ...questionData });
  },

  async deleteQuestion(questionId: string): Promise<void> {
    console.log('Deleting question:', questionId);
    return Promise.resolve();
  },

  async updateQuestionOrder(subtopicId: string, questionIds: string[]): Promise<void> {
    console.log('Updating question order:', subtopicId, questionIds);
    return Promise.resolve();
  },
};
