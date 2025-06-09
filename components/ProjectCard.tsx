
import React from 'react';
import { Project } from '../types';
import { Briefcase, Calendar, Code, FileText } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onSelect: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div 
      className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-indigo-500/30 transition-all duration-300 cursor-pointer flex flex-col"
      onClick={() => onSelect(project.id)}
    >
      {project.thumbnailUrl && (
        <img src={project.thumbnailUrl} alt={project.name} className="w-full h-40 object-cover"/>
      )}
      {!project.thumbnailUrl && (
        <div className="w-full h-40 bg-gray-700 flex items-center justify-center">
          <Briefcase size={48} className="text-gray-500" />
        </div>
      )}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-white mb-1 truncate">{project.name}</h3>
        <p className="text-xs text-gray-400 mb-2 flex items-center">
          <Calendar size={14} className="mr-1.5" />
          Last Modified: {formatDate(project.lastModified)}
        </p>
        <p className="text-sm text-gray-300 mb-3 flex-grow min-h-[40px]">{project.description.substring(0,100)}{project.description.length > 100 ? '...' : ''}</p>
        
        {project.components && project.components.length > 0 && (
          <div className="mb-2">
            <h4 className="text-xs font-medium text-gray-400 mb-1 flex items-center"><Code size={14} className="mr-1.5"/>Components:</h4>
            <div className="flex flex-wrap gap-1">
              {project.components.slice(0, 3).map((comp) => (
                <span key={comp} className="text-xs bg-gray-700 text-indigo-300 px-1.5 py-0.5 rounded-full">
                  {comp}
                </span>
              ))}
              {project.components.length > 3 && (
                <span className="text-xs bg-gray-700 text-indigo-300 px-1.5 py-0.5 rounded-full">
                  +{project.components.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
        {project.template && (
           <p className="text-xs text-gray-400 flex items-center mt-auto pt-2 border-t border-gray-700">
            <FileText size={14} className="mr-1.5"/>Template: {project.template}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
