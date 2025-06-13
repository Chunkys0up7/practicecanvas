import React, { useEffect, useState, useMemo } from 'react';
import { AIComponent, ComponentType } from '../types';
import { fetchComponents } from '../services/mockApiService';
import ComponentCard from '../components/ComponentCard';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Filter, Search, XCircle } from 'lucide-react';

const ComponentLibraryPage: React.FC = () => {
  const [components, setComponents] = useState<AIComponent[]>([]);
  const [filteredComponents, setFilteredComponents] = useState<AIComponent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<ComponentType | 'All'>('All');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadComponents = async () => {
      setIsLoading(true);
      try {
        const data = await fetchComponents();
        setComponents(data);
        setFilteredComponents(data);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch components:", error);
        setError('Failed to load components. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    loadComponents();
  }, []);

  const categories = useMemo(() => ['All', ...new Set(components.map(c => c.category))], [components]);
  const types: (ComponentType | 'All')[] = useMemo(() => ['All', ...Object.values(ComponentType)], []);


  useEffect(() => {
    let currentComponents = [...components];

    if (selectedCategory !== 'All') {
      currentComponents = currentComponents.filter(c => c.category === selectedCategory);
    }

    if (selectedType !== 'All') {
      currentComponents = currentComponents.filter(c => c.type === selectedType);
    }

    if (searchTerm) {
      currentComponents = currentComponents.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredComponents(currentComponents);
  }, [searchTerm, selectedCategory, selectedType, components]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedType('All');
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading components..." className="h-full" />;
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-600 text-white px-4 py-2 mb-2 rounded shadow text-center">
          {error}
        </div>
      )}
      <h1 className="text-3xl font-bold text-white">Component Library</h1>

      <div className="bg-gray-800 p-4 rounded-lg shadow sticky top-0 z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2">
            <Input
              id="search-components"
              type="text"
              placeholder="Search components..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-700 border-gray-600"
              aria-label="Search components"
            />
          </div>
          <div>
             <label htmlFor="filter-category" className="block text-xs font-medium text-gray-400 mb-1">Category</label>
             <div className="relative">
                <select 
                    id="filter-category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-3 pr-10 py-2 text-base border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-700 text-white appearance-none"
                    aria-label="Filter by category"
                >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <Filter size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"/>
            </div>
          </div>
          <div>
            <label htmlFor="filter-type" className="block text-xs font-medium text-gray-400 mb-1">Type</label>
            <div className="relative">
                <select 
                    id="filter-type"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value as ComponentType | 'All')}
                    className="w-full pl-3 pr-10 py-2 text-base border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-700 text-white appearance-none"
                    aria-label="Filter by type"
                >
                    {types.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
                <Filter size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"/>
            </div>
          </div>
        </div>
        {(searchTerm || selectedCategory !== 'All' || selectedType !== 'All') && (
             <button onClick={clearFilters} className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 flex items-center">
                <XCircle size={14} className="mr-1" /> Clear Filters
            </button>
        )}
      </div>

      {filteredComponents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredComponents.map((component) => (
            <ComponentCard key={component.id} component={component} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-800 rounded-lg shadow">
           <Search size={48} className="mx-auto text-gray-500 mb-4" />
          <p className="text-gray-400">No components found matching your criteria.</p>
          <p className="text-sm text-gray-500">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
};

export default ComponentLibraryPage;
