import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable';
import { GripVertical, ChevronDown, ChevronRight, Plus, Edit2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Topic } from '../../types';
import { SubTopicCard } from '../subtopic/SubTopicCard';
import { getProgressPercentage } from '../../utils/helpers';
import { useDispatch } from 'react-redux';
import { toggleTopicExpand, addSubTopic, updateTopic, deleteTopic } from '../../store/useSheetStore';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useForm } from 'react-hook-form';

interface TopicCardProps {
  topic: Topic;
}

interface TopicFormData {
  title: string;
  description: string;
}

interface SubTopicFormData {
  title: string;
}

export const TopicCard: React.FC<TopicCardProps> = ({ topic }) => {
  const dispatch = useDispatch();
  const [isAddSubTopicModalOpen, setIsAddSubTopicModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: topic.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const progress = getProgressPercentage(topic);

  const subtopicForm = useForm<SubTopicFormData>({
    defaultValues: {
      title: '',
    },
  });

  const topicForm = useForm<TopicFormData>({
    defaultValues: {
      title: topic.title,
      description: topic.description || '',
    },
  });

  const handleToggleExpand = () => {
    dispatch(toggleTopicExpand(topic.id));
  };

  const handleAddSubTopic = (data: SubTopicFormData) => {
    dispatch(addSubTopic({
      topicId: topic.id,
      data,
    }));
    subtopicForm.reset();
    setIsAddSubTopicModalOpen(false);
  };

  const handleEditTopic = (data: TopicFormData) => {
    dispatch(updateTopic({
      id: topic.id,
      data,
    }));
    setIsEditModalOpen(false);
  };

  const handleDeleteTopic = () => {
    dispatch(deleteTopic(topic.id));
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <motion.div
        ref={setNodeRef}
        style={style}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 ${
          isDragging ? 'opacity-50 shadow-2xl z-50 rotate-2' : ''
        }`}
      >
        {/* Topic Header */}
        <div className=" relative bg-[linear-gradient(to_bottom,#111010_0%,#181616_88%,#ffb366_100%)]
 opacity-95 px-5 py-2"
>
          {/* Drag Handle */}
              <div
            {...attributes}
            {...listeners}
            className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing text-white/70 hover:text-white transition-colors"
          >
            <GripVertical size={24} />
          </div>

          <div className="flex items-start gap-4 ml-8">
            {/* Expand/Collapse */}
            <button
              onClick={handleToggleExpand}
              className="flex-shrink-0 p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors mt-1"
            >
              {topic.expanded ? <ChevronDown size={24} /> : <ChevronRight size={24} />}
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-white mb-1 truncate">
                {topic.title}
              </h2>
              {topic.description && (
                <p className="text-primary-100 text-sm line-clamp-2">
                  {topic.description}
                </p>
              )}
            </div>

            {/* Progress Circle */}
            <div className="flex-shrink-0 relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="25"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="4"
                  fill="none"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="white"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-sm">{progress}%</span>
              </div>
            </div>

           

 <div className="flex-shrink-0 flex items-center gap-2">
  <button
    onClick={() => setIsAddSubTopicModalOpen(true)}
    className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/40 transition-colors"
    title="Add SubTopic"
  >
    <Plus size={18} />
  </button>

  <button
    onClick={() => setIsEditModalOpen(true)}
    className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/40 transition-colors"
    title="Edit Topic"
  >
    <Edit2 size={18} />
  </button>

  <button
    onClick={() => setIsDeleteModalOpen(true)}
    className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/40 transition-colors"
    title="Delete Topic"
  >
    <Trash2 size={18} />
  </button>
</div> 



          </div>
        </div>

        {/* SubTopics */}
        <AnimatePresence>
          {topic.expanded && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                {topic.subtopics.length > 0 ? (
                  <SortableContext
                    items={topic.subtopics.map(st => st.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {topic.subtopics.map((subtopic) => (
                      <SubTopicCard
                        key={subtopic.id}
                        subtopic={subtopic}
                        topicId={topic.id}
                      />
                    ))}
                  </SortableContext>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p className="mb-4">No subtopics yet</p>
                    <Button
                      onClick={() => setIsAddSubTopicModalOpen(true)}
                      icon={<Plus size={20} />}
                    >
                      Add First SubTopic
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Add SubTopic Modal */}
      <Modal
        isOpen={isAddSubTopicModalOpen}
        onClose={() => {
          setIsAddSubTopicModalOpen(false);
          subtopicForm.reset();
        }}
        title="Add New SubTopic"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsAddSubTopicModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={subtopicForm.handleSubmit(handleAddSubTopic)}>
              Add SubTopic
            </Button>
          </>
        }
      >
        <form onSubmit={subtopicForm.handleSubmit(handleAddSubTopic)} className="space-y-4">
          <Input
            label="SubTopic Title"
            {...subtopicForm.register('title', { required: 'Title is required' })}
            error={subtopicForm.formState.errors.title?.message}
            placeholder="e.g., Easy Problems, Advanced Concepts"
          />
        </form>
      </Modal>

      {/* Edit Topic Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Topic"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={topicForm.handleSubmit(handleEditTopic)}>
              Save Changes
            </Button>
          </>
        }
      >
        <form onSubmit={topicForm.handleSubmit(handleEditTopic)} className="space-y-4">
          <Input
            label="Topic Title"
            {...topicForm.register('title', { required: 'Title is required' })}
            error={topicForm.formState.errors.title?.message}
            placeholder="e.g., Arrays, Linked Lists"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              {...topicForm.register('description')}
              rows={3}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Brief description of this topic..."
            />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Topic"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteTopic}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-gray-600">
          Are you sure you want to delete "{topic.title}"? This will also delete all subtopics and questions. This action cannot be undone.
        </p>
      </Modal>
    </>
  );
};
