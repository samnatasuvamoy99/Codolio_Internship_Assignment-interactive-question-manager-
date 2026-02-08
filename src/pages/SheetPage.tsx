import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
 
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus, BookOpen, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/useSheetStore';
import { addTopic, reorderTopics, reorderSubTopics, reorderQuestions } from '../store/useSheetStore';
import { TopicCard } from '../components/topic/TopicCard';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { useForm } from 'react-hook-form';
import { SubTopic } from '../types';

interface TopicFormData {
  title: string;
  description: string;
}



export const SheetPage: React.FC = () => {
  const dispatch = useDispatch();
  const { sheet, loading } = useSelector((state: RootState) => state.sheet);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isAddTopicModalOpen, setIsAddTopicModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const { register, handleSubmit, formState: { errors }, reset } = useForm<TopicFormData>({
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      setActiveId(null);
      return;
    }

    if (!sheet) return;

    // Handle topic reordering
    const activeTopicIndex = sheet.topics.findIndex(t => t.id === active.id);
    const overTopicIndex = sheet.topics.findIndex(t => t.id === over.id);

    if (activeTopicIndex !== -1 && overTopicIndex !== -1) {
      dispatch(reorderTopics({ oldIndex: activeTopicIndex, newIndex: overTopicIndex }));
      setActiveId(null);
      return;
    }

    // Handle subtopic reordering
    for (const topic of sheet.topics) {
      const activeSubTopicIndex = topic.subtopics.findIndex(st => st.id === active.id);
      const overSubTopicIndex = topic.subtopics.findIndex(st => st.id === over.id);

      if (activeSubTopicIndex !== -1 && overSubTopicIndex !== -1) {
        dispatch(reorderSubTopics({
          topicId: topic.id,
          oldIndex: activeSubTopicIndex,
          newIndex: overSubTopicIndex,
        }));
        setActiveId(null);
        return;
      }
    }

    // Handle question reordering
    for (const topic of sheet.topics) {
      for (const subtopic of topic.subtopics) {
        const activeQuestionIndex = subtopic.questions.findIndex(q => q.id === active.id);
        const overQuestionIndex = subtopic.questions.findIndex(q => q.id === over.id);

        if (activeQuestionIndex !== -1 && overQuestionIndex !== -1) {
          dispatch(reorderQuestions({
            topicId: topic.id,
            subtopicId: subtopic.id,
            oldIndex: activeQuestionIndex,
            newIndex: overQuestionIndex,
          }));
          setActiveId(null);
          return;
        }
      }
    }

    setActiveId(null);
  };

  const handleAddTopic = (data: TopicFormData) => {
    ///

    const newTopic = {
      ...data,
      subtopics: [] as SubTopic[],
    };
    dispatch(addTopic(newTopic));
    reset();
    setIsAddTopicModalOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your question sheet...</p>
        </div>
      </div>
    );
  }

  if (!sheet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">No sheet found</p>
          <Button onClick={() => window.location.reload()}>Reload</Button>
        </div>
      </div>
    );
  }

  const totalQuestions = sheet.topics.reduce((acc, topic) => {
    return acc + topic.subtopics.reduce((subAcc, subtopic) => {
      return subAcc + subtopic.questions.length;
    }, 0);
  }, 0);

  const completedQuestions = sheet.topics.reduce((acc, topic) => {
    return acc + topic.subtopics.reduce((subAcc, subtopic) => {
      return subAcc + subtopic.questions.filter(q => q.completed).length;
    }, 0);
  }, 0);

  const overallProgress = totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-[#111010] rounded-2xl shadow-3xl p-8 border-2 border-[#f57c06]">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-[#f57c06] to-[#d96e05] rounded-xl shadow-lg">
                    <BookOpen size={30} className="text-white border-2 border-bg-[#f57c06]" />
                  </div>
                  <div>

                    {/* logo design */}
                    <h1 className="text-4xl font-bold mb-2 font-display">
                      <span className="text-[#ffffff]">
                        {sheet.title.slice(0, 3)}
                      </span>
                      <span className="text-[#f57c06]">
                        {sheet.title.slice(3, 7)}
                      </span>
                      <span className="text-[#ffffff]">
                        {sheet.title.slice(7)}
                      </span>
                    </h1>

                    {sheet.description && (
                      <p className="text-[#8aa3af]  font-serif font-semibold   mt-6 text-lg">{sheet.description}</p>
                    )}
                  </div>
                </div>
                <Button
                  onClick={() => setIsAddTopicModalOpen(true)}
                  icon={<Plus size={30} />}
                  size="md"
                >
                  Add Topic
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-[#f39a45] via-[#f57c06] to-[#ffe0b8]
 rounded-xl p-4 border border-[#e36f05]
">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#ffffff] font-medium mb-1">Total Topics</p>
                      <p className="text-3xl font-bold text-[#ffffff]">{sheet.topics.length}</p>
                    </div>
                    <div className="p-3 bg-[#ffffff] rounded-lg">
                      <BookOpen size={24} className="text-[#1f2937]" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#f39a45] via-[#f57c06] to-[#ffe0b8]
rounded-xl p-4 border border-[#e36f05]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#ffffff] font-medium mb-1">Total Questions</p>
                      <p className="text-3xl font-bold text-[#ffffff]">{totalQuestions}</p>
                    </div>
                    <div className="p-3 bg-[#ffffff] rounded-lg">
                      <TrendingUp size={24} className="text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#f39a45] via-[#f57c06] to-[#ffe0b8]
 rounded-xl p-4 border border-[#e36f05]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#ffffff] font-medium mb-1">Overall Progress</p>
                      <p className="text-3xl font-bold text-[#ffffff]">{overallProgress}%</p>
                    </div>
                    <div className="relative w-12 h-12">
                      <svg className="w-12 h-12 transform -rotate-90">
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          stroke="#e9d5ff"
                          strokeWidth="4"
                          fill="none"
                        />

                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          stroke="#22c55e"
                          strokeWidth="4"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 20}`}
                          strokeDashoffset={`${2 * Math.PI * 20 * (1 - overallProgress / 100)}`}
                          strokeLinecap="round"
                        />

                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Topics List */}
          <div className="space-y-2">
            {sheet.topics.length > 0 ? (
              <SortableContext
                items={sheet.topics.map(t => t.id)}
                strategy={verticalListSortingStrategy}
              >
                {sheet.topics.map((topic) => (
                  <TopicCard key={topic.id} topic={topic} />
                ))}
              </SortableContext>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-200"
              >
                <div className="max-w-md mx-auto">
                  <div className="w-30 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BookOpen size={20} className="text-primary-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No topics yet</h3>
                  <p className="text-gray-600 mb-6">
                    Get started by creating your first topic to organize your questions
                  </p>
                  <Button
                    onClick={() => setIsAddTopicModalOpen(true)}
                    icon={<Plus size={20} />}
                    size="lg"
                  >
                    Create First Topic
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Add Topic Modal */}
      <Modal
        isOpen={isAddTopicModalOpen}
        onClose={() => {
          setIsAddTopicModalOpen(false);
          reset();
        }}
        title="Add New Topic"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsAddTopicModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit(handleAddTopic)}>
              Add Topic
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(handleAddTopic)} className="space-y-4">
          <Input
            label="Topic Title"
            {...register('title', { required: 'Title is required' })}
            error={errors.title?.message}
            placeholder="e.g., Arrays, Linked Lists, Dynamic Programming"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f57c06]"
              placeholder="Brief description of this topic..."
            />
          </div>
        </form>
      </Modal>

      <DragOverlay>
        {activeId ? (
          <div className="bg-white rounded-xl shadow-2xl p-4 border-2 border-[#f57c06] opacity-90">
            <p className="font-semibold text-gray-900">Dragging...</p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
