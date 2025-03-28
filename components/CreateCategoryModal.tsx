import React, { useState } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCategory: (category: { name: string; color: string }) => void;
}

const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({ 
  isOpen, 
  onClose, 
  onCreateCategory 
}) => {
  const [categoryName, setCategoryName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#3B82F6'); // Default blue

  // Predefined color palette for category selection
  const colorOptions = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F43F5E', // Rose
    '#8B5CF6', // Purple
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#6366F1', // Indigo
    '#14B8A6', // Teal
  ];

  const handleCreateCategory = () => {
    if (categoryName.trim()) {
      onCreateCategory({
        name: categoryName.trim(),
        color: selectedColor
      });
      // Reset form
      setCategoryName('');
      setSelectedColor('#3B82F6');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Create New Category</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="mb-4">
          <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-2">
            Category Name
          </label>
          <input 
            id="categoryName"
            type="text" 
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter category name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose Color
          </label>
          <div className="flex flex-wrap gap-2">
            {colorOptions.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full ${
                  selectedColor === color 
                    ? 'ring-2 ring-offset-2 ring-blue-500' 
                    : 'hover:opacity-80'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateCategory}
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
            disabled={!categoryName.trim()}
          >
            <FiPlus className="mr-1" />
            Create Category
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCategoryModal;