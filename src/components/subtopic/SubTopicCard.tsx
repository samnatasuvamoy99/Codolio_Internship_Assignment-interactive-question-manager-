import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { GripVertical, ChevronDown, ChevronRight, Plus, Edit2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SubTopic } from '../../types';
import { QuestionRow } from '../question/QuestionRow';
import { getSubTopicProgress } from '../../utils/helpers';
import { useDispatch } from 'react-redux';
import { toggleSubTopicExpand, addQuestion, updateSubTopic, deleteSubTopic } from '../../store/useSheetStore';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useForm } from 'react-hook-form';

interface SubTopicCardProps {
  subtopic: SubTopic;
  topicId: string;
}

interface QuestionFormData {
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  link: string;
  videoLink: string;
}

interface SubTopicFormData {
  title: string;
}

export const SubTopicCard: React.FC<SubTopicCardProps> = ({ subtopic, topicId }) => {
  const dispatch = useDispatch();
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: subtopic.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const progress = getSubTopicProgress(subtopic);
  const progressPercentage = progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;

  const questionForm = useForm<QuestionFormData>({
    defaultValues: {
      title: '',
      difficulty: 'Easy',
      link: '',
      videoLink: '',
    },
  });

  const subtopicForm = useForm<SubTopicFormData>({
    defaultValues: {
      title: subtopic.title,
    },
  });

  const handleToggleExpand = () => {
    dispatch(toggleSubTopicExpand({ topicId, subtopicId: subtopic.id }));
  };

  const handleAddQuestion = (data: QuestionFormData) => {
    dispatch(addQuestion({
      topicId,
      subtopicId: subtopic.id,
      data: { ...data, completed: false },
    }));
    questionForm.reset();
    setIsAddQuestionModalOpen(false);
  };

  const handleEditSubTopic = (data: SubTopicFormData) => {
    dispatch(updateSubTopic({
      topicId,
      subtopicId: subtopic.id,
      data,
    }));
    setIsEditModalOpen(false);
  };

  const handleDeleteSubTopic = () => {
    dispatch(deleteSubTopic({ topicId, subtopicId: subtopic.id }));
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <motion.div
        ref={setNodeRef}
        style={style}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`bg-gray-50 rounded-xl border border-gray-200 overflow-hidden ${
          isDragging ? 'opacity-50 shadow-2xl z-50' : ''
        }`}
      >
        {/* SubTopic Header */}
        <div className="group flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="flex-shrink-0 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors"
          >
            <GripVertical size={18} />
          </div>

          {/* Expand/Collapse */}
          <button
            onClick={handleToggleExpand}
            className="flex-shrink-0 p-1 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          >
            {subtopic.expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>

          {/* Title */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{subtopic.title}</h3>
          </div>

          {/* Progress */}
          <div className="flex-shrink-0 text-sm text-gray-600">
            {progress.completed}/{progress.total}
          </div>

          {/* Actions */}
          <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsAddQuestionModalOpen(true)}
              className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
              title="Add Question"
            >
              <Plus size={16} />
            </button>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
              title="Edit SubTopic"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
              title="Delete SubTopic"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {progress.total > 0 && (
          <div className="h-1 bg-gray-200">
            <div
              className="h-full bg-[#f57c06]  transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        )}

        {/* Questions List */}
        <AnimatePresence>
          {subtopic.expanded && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-2">
                {subtopic.questions.length > 0 ? (
                  <SortableContext
                    items={subtopic.questions.map(q => q.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {subtopic.questions.map((question) => (
                      <QuestionRow
                        key={question.id}
                        question={question}
                        topicId={topicId}
                        subtopicId={subtopic.id}
                      />
                    ))}
                  </SortableContext>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p className="mb-3">No questions yet</p>
                    <Button
                      size="sm"
                      onClick={() => setIsAddQuestionModalOpen(true)}
                      icon={<Plus size={16} />}
                    >
                      Add First Question
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Add Question Modal */}
      <Modal
        isOpen={isAddQuestionModalOpen}
        onClose={() => {
          setIsAddQuestionModalOpen(false);
          questionForm.reset();
        }}
        title="Add New Question"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsAddQuestionModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={questionForm.handleSubmit(handleAddQuestion)}>
              Add Question
            </Button>
          </>
        }
      >
        <form onSubmit={questionForm.handleSubmit(handleAddQuestion)} className="space-y-4">
          <Input
            label="Question Title"
            {...questionForm.register('title', { required: 'Title is required' })}
            error={questionForm.formState.errors.title?.message}
            placeholder="Enter question title"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Difficulty
            </label>
            <select
              {...questionForm.register('difficulty')}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <Input
            label="Problem Link"
            {...questionForm.register('link')}
            placeholder="https://leetcode.com/problems/..."
            type="url"
          />

          <Input
            label="Video Solution Link"
            {...questionForm.register('videoLink')}
            placeholder="https://youtube.com/watch?v=..."
            type="url"
          />
        </form>
      </Modal>

      {/* Edit SubTopic Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit SubTopic"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={subtopicForm.handleSubmit(handleEditSubTopic)}>
              Save Changes
            </Button>
          </>
        }
      >
        <form onSubmit={subtopicForm.handleSubmit(handleEditSubTopic)} className="space-y-4">
          <Input
            label="SubTopic Title"
            {...subtopicForm.register('title', { required: 'Title is required' })}
            error={subtopicForm.formState.errors.title?.message}
            placeholder="Enter subtopic title"
          />
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete SubTopic"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteSubTopic}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-gray-600">
          Are you sure you want to delete "{subtopic.title}"? This will also delete all {subtopic.questions.length} question(s). This action cannot be undone.
        </p>
      </Modal>
    </>
  );
};
