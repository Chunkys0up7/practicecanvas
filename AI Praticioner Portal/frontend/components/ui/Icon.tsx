import React from 'react';
import {
  DocumentArrowDownIcon as SaveIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  CodeBracketIcon,
  FolderIcon,
  DocumentIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
}

const iconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  save: SaveIcon,
  settings: Cog6ToothIcon,
  format: DocumentDuplicateIcon,
  code: CodeBracketIcon,
  folder: FolderIcon,
  file: DocumentIcon,
  chevronRight: ChevronRightIcon,
  chevronDown: ChevronDownIcon,
};

export const Icon: React.FC<IconProps> = ({ name, className, ...props }) => {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <IconComponent
      className={className}
      role="img"
      aria-hidden="true"
      {...props}
    />
  );
}; 