import React, { useState, useEffect, useRef } from 'react';

export interface Command {
  id: string;
  title: string;
  description: string;
  shortcut: string;
  action: () => void;
}

interface CommandPaletteProps {
  commands: Command[];
  isOpen: boolean;
  onClose: () => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({
  commands,
  isOpen,
  onClose,
}) => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredCommands = commands.filter(
    command =>
      command.title.toLowerCase().includes(search.toLowerCase()) ||
      command.description.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
      searchInputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev =>
          prev < filteredCommands.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        event.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          onClose();
        }
        break;
      case 'Escape':
        event.preventDefault();
        onClose();
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50">
      <div
        ref={containerRef}
        className="bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl mx-4"
        onKeyDown={handleKeyDown}
      >
        <div className="p-4 border-b border-gray-700">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Type a command or search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="max-h-96 overflow-y-auto">
          {filteredCommands.map((command, index) => (
            <div
              key={command.id}
              className={`flex items-center justify-between px-4 py-3 cursor-pointer ${
                index === selectedIndex ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
              onClick={() => {
                command.action();
                onClose();
              }}
            >
              <div>
                <div className="text-white font-medium">{command.title}</div>
                <div className="text-gray-400 text-sm">{command.description}</div>
              </div>
              <div className="text-gray-400 text-sm">{command.shortcut}</div>
            </div>
          ))}
          {filteredCommands.length === 0 && (
            <div className="px-4 py-3 text-gray-400">
              No commands found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette; 