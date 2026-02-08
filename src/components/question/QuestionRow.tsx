import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, ExternalLink, Video, Edit2, Trash2, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Question } from '../../types';
import { getDifficultyColor } from '../../utils/helpers';
import { useDispatch } from 'react-redux';
import { toggleQuestionComplete, updateQuestion, deleteQuestion } from '../../store/useSheetStore';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useForm } from 'react-hook-form';

interface QuestionRowProps {
  question: Question;
  topicId: string;
  subtopicId: string;
}

interface QuestionFormData {
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  link: string;
  videoLink: string;
}

export const QuestionRow: React.FC<QuestionRowProps> = ({ question, topicId, subtopicId }) => {
  const dispatch = useDispatch();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const { register, handleSubmit, formState: { errors } } = useForm<QuestionFormData>({
    defaultValues: {
      title: question.title,
      difficulty: question.difficulty || 'Easy',
      link: question.link || '',
      videoLink: question.videoLink || '',
    },
  });

  const handleToggleComplete = () => {
    dispatch(toggleQuestionComplete({ topicId, subtopicId, questionId: question.id }));
  };

  const handleEdit = (data: QuestionFormData) => {
    dispatch(updateQuestion({
      topicId,
      subtopicId,
      questionId: question.id,
      data,
    }));
    setIsEditModalOpen(false);
  };

  const handleDelete = () => {
    dispatch(deleteQuestion({ topicId, subtopicId, questionId: question.id }));
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <motion.div
        ref={setNodeRef}
        style={style}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`group relative flex items-center gap-3 px-4 py-3 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all duration-200 ${
          isDragging ? 'opacity-50 shadow-xl z-50' : ''
        } ${question.completed ? 'bg-green-50/50' : ''}`}
      >
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="flex-shrink-0 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors"
        >
          <GripVertical size={18} />
        </div>

        {/* Checkbox */}
        <button
          onClick={handleToggleComplete}
          className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
            question.completed
              ? 'bg-[#f57c06] border-[#111010]'
              : 'border-[#1f2937] hover:border-[#f57c06]'
          }`}
        >
          {question.completed && <Check size={14} className="text-white" />}
        </button>

        {/* Question Title */}
        <div className="flex-1 min-w-0">
          <p className={`font-medium  text-gray-900 truncate ${question.completed ? 'line-through text-gray-500' : ''}`}>
            {question.title}
          </p>
        </div>

        {/* Difficulty Badge */}
        {question.difficulty && (
          <div className={`flex-shrink-0  px-2.5 py-0.5 text-xs font-medium rounded-full border ${getDifficultyColor(question.difficulty)}`}>
            {question.difficulty}
          </div>
        )}

        {/* Links */}
        <div className="flex-shrink-0 flex items-center gap-2">
          {question.link && (
            <a
              href={question.link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg hover:bg-primary-50 text-primary-600 transition-colors"
              title="Problem Link"
            >
              <ExternalLink size={16} />
            </a>
          )}
          {question.videoLink && (
            <a
              href={question.videoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
              title="Video Solution"
            >
              <Video size={16} />
            </a>
          )}
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
            title="Edit Question"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
            title="Delete Question"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </motion.div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Question"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit(handleEdit)}>
              Save Changes
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(handleEdit)} className="space-y-4">
          <Input
            label="Question Title"
            {...register('title', { required: 'Title is required' })}
            error={errors.title?.message}
            placeholder="Enter question title"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Difficulty
            </label>
            <select
              {...register('difficulty')}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f57c06]"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <Input
            label="Problem Link"
            {...register('link')}
            placeholder="https://leetcode.com/problems/..."
            type="url"
          />

          <Input
            label="Video Solution Link"
            {...register('videoLink')}
            placeholder="https://youtube.com/watch?v=..."
            type="url"
          />
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Question"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-gray-600">
          Are you sure you want to delete "{question.title}"? This action cannot be undone.
        </p>
      </Modal>
    </>
  );
};
