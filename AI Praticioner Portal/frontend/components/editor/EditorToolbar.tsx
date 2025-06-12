import React from 'react';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';

interface EditorToolbarProps {
  onSave?: () => void;
  onFormat?: () => void;
  onSettings?: () => void;
  isDirty?: boolean;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onSave,
  onFormat,
  onSettings,
  isDirty = false,
}) => {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 border-b border-gray-700">
      <Button
        variant="ghost"
        size="sm"
        onClick={onSave}
        disabled={!isDirty}
        className="flex items-center gap-1"
      >
        <Icon name="save" className="w-4 h-4" />
        Save
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onFormat}
        className="flex items-center gap-1"
      >
        <Icon name="format" className="w-4 h-4" />
        Format
      </Button>
      <div className="flex-1" />
      <Button
        variant="ghost"
        size="sm"
        onClick={onSettings}
        className="flex items-center gap-1"
      >
        <Icon name="settings" className="w-4 h-4" />
        Settings
      </Button>
    </div>
  );
}; 