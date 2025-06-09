
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../types';
import { fetchProjects } from '../services/mockApiService';
import ProjectCard from '../components/ProjectCard';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Filter, Search, PlusCircle } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);
      try {
        const data = await fetchProjects();
        setProjects(data);
        setFilteredProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        // Handle error state in UI if necessary
      } finally {
        setIsLoading(false);
      }
    };
    loadProjects();
  }, []);

  useEffect(() => {
    let currentProjects = [...projects];
    if (activeFilter !== 'All') {
      // Example filter logic - can be expanded
      if (activeFilter === 'Recent') { // Assuming projects are already somewhat sorted or have a timestamp
        currentProjects.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
      } else { // Filter by template name if filter matches a template
        currentProjects = currentProjects.filter(p => p.template?.toLowerCase().includes(activeFilter.toLowerCase()));
      }
    }

    if (searchTerm) {
      currentProjects = currentProjects.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.components.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    setFilteredProjects(currentProjects);
  }, [searchTerm, activeFilter, projects]);

  const handleProjectSelect = (id: string) => {
    navigate(`/builder?projectId=${id}`); // Or a dedicated project view page
  };

  const filterOptions = ['All', 'Recent', ...new Set(projects.map(p => p.template).filter(Boolean) as string[])];

  if (isLoading) {
    return <LoadingSpinner text="Loading projects..." className="h-full"/>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <Button variant="primary" onClick={() => alert('Navigate to New Project Creation')} leftIcon={<PlusCircle size={18}/>}>
          New Project
        </Button>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              id="search-projects"
              type="text"
              placeholder="Search projects by name, description, or components..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-700 border-gray-600"
              aria-label="Search projects"
            />
          </div>
          <div>
            <div className="relative">
                <select 
                    id="filter-projects"
                    value={activeFilter}
                    onChange={(e) => setActiveFilter(e.target.value)}
                    className="w-full pl-3 pr-10 py-2 text-base border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-700 text-white appearance-none"
                    aria-label="Filter projects"
                >
                    {filterOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <Filter size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"/>
            </div>
          </div>
        </div>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} onSelect={handleProjectSelect} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-800 rounded-lg shadow">
          <Search size={48} className="mx-auto text-gray-500 mb-4" />
          <p className="text-gray-400">No projects found matching your criteria.</p>
          {searchTerm && <p className="text-sm text-gray-500">Try adjusting your search or filter.</p>}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
