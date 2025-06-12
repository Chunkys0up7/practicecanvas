import React from 'react';

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts = [
  { key: 'Ctrl + N', description: 'New File' },
  { key: 'Ctrl + Shift + N', description: 'New Folder' },
  { key: 'Ctrl + S', description: 'Save File' },
  { key: 'Ctrl + F', description: 'Find in File' },
  { key: 'Ctrl + H', description: 'Replace in File' },
  { key: 'Ctrl + /', description: 'Toggle Comment' },
  { key: 'Ctrl + Z', description: 'Undo' },
  { key: 'Ctrl + Y', description: 'Redo' },
  { key: 'Ctrl + D', description: 'Select Next Occurrence' },
  { key: 'Ctrl + Shift + L', description: 'Select All Occurrences' },
  { key: 'Ctrl + Space', description: 'Trigger Suggestions' },
  { key: 'F12', description: 'Go to Definition' },
  { key: 'Alt + F12', description: 'Peek Definition' },
  { key: 'Shift + F12', description: 'Find All References' },
  { key: 'Ctrl + K', description: 'Show Command Palette' }
];

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="keyboard-shortcuts-title"
    >
      <div className="bg-gray-800 rounded-lg p-6 w-[600px] max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 id="keyboard-shortcuts-title" className="text-xl font-bold">Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            {shortcuts.map((shortcut) => (
              <div
                key={shortcut.key}
                className="flex items-center justify-between p-2 bg-gray-700 rounded"
              >
                <span className="text-gray-300">{shortcut.description}</span>
                <kbd className="px-2 py-1 bg-gray-600 rounded text-sm font-mono">
                  {shortcut.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-400">
          Press <kbd className="px-1 py-0.5 bg-gray-700 rounded">Esc</kbd> to close
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcuts; 