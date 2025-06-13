import React, { useEffect, useState } from 'react';
import { DeployedEnvironment, DeploymentLog } from '../types';
import { fetchDeployedEnvironments, fetchDeploymentLogs, deployToEnvironment as apiDeployToEnvironment } from '../services/mockApiService';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { CheckCircle, XCircle, Clock, Server, ChevronDown, ChevronUp, Terminal } from 'lucide-react';

const DeploymentPage: React.FC = () => {
  const [environments, setEnvironments] = useState<DeployedEnvironment[]>([]);
  const [selectedEnv, setSelectedEnv] = useState<DeployedEnvironment | null>(null);
  const [logs, setLogs] = useState<DeploymentLog[]>([]);
  const [isLoadingEnv, setIsLoadingEnv] = useState(true);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [expandedLogs, setExpandedLogs] = useState<Record<string, boolean>>({});
  const [isDeploying, setIsDeploying] = useState<Record<string, boolean>>({});
  const [deployMessage, setDeployMessage] = useState<{ text: string, type: 'success' | 'error', env: string } | null>(null);

  useEffect(() => {
    const loadEnvs = async () => {
      setIsLoadingEnv(true);
      try {
        const data = await fetchDeployedEnvironments();
        setEnvironments(data);
        if (data.length > 0) {
            // setSelectedEnv(data[0]); // Auto select first one
            // setExpandedLogs({ [data[0].name]: true });
        }
      } catch (error) {
        console.error("Failed to fetch environments:", error);
      } finally {
        setIsLoadingEnv(false);
      }
    };
    loadEnvs();
  }, []);

  useEffect(() => {
    if (selectedEnv) {
      const loadLogs = async () => {
        setIsLoadingLogs(true);
        try {
          const data = await fetchDeploymentLogs(selectedEnv.name);
          setLogs(data);
        } catch (error) {
          console.error(`Failed to fetch logs for ${selectedEnv.name}:`, error);
          setLogs([]); // Clear logs on error
        } finally {
          setIsLoadingLogs(false);
        }
      };
      loadLogs();
    } else {
        setLogs([]);
    }
  }, [selectedEnv]);

  const getStatusIcon = (status: DeployedEnvironment['status']) => {
    switch (status) {
      case 'Deployed': return <CheckCircle className="text-green-500" />;
      case 'Pending': return <Clock className="text-yellow-500" />;
      case 'Error': return <XCircle className="text-red-500" />;
      default: return <Server className="text-gray-500" />;
    }
  };
  
  const toggleLogs = (envName: string) => {
    setExpandedLogs(prev => ({ ...prev, [envName]: !prev[envName] }));
    const env = environments.find(e => e.name === envName);
    if (env && expandedLogs[envName]) { // if closing
        setSelectedEnv(null);
    } else if (env) { // if opening
        setSelectedEnv(env);
    }
  };

  const handleDeploy = async (envName: string) => {
    setIsDeploying(prev => ({ ...prev, [envName]: true }));
    setDeployMessage(null);
    const result = await apiDeployToEnvironment(envName);
    setDeployMessage({ text: result.message, type: result.success ? 'success' : 'error', env: envName });
    setIsDeploying(prev => ({ ...prev, [envName]: false }));

    // Refresh envs and logs after a bit
    setTimeout(async () => {
        setDeployMessage(null);
        setIsLoadingEnv(true);
        const data = await fetchDeployedEnvironments();
        setEnvironments(data);
        setIsLoadingEnv(false);
        if(selectedEnv?.name === envName && result.success) { // if current env logs are shown and deploy was success
            setIsLoadingLogs(true);
            const logData = await fetchDeploymentLogs(envName);
            setLogs(logData);
            setIsLoadingLogs(false);
        }
    }, 3000);
  };


  if (isLoadingEnv) {
    return <LoadingSpinner text="Loading environments..." className="h-full" />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Deployment Environments</h1>
      
      {environments.length === 0 && !isLoadingEnv && (
        <p className="text-gray-400">No deployment environments configured.</p>
      )}

      <div className="space-y-4">
        {environments.map((env) => (
          <div key={env.name} className="bg-gray-800 rounded-lg shadow-lg">
            <div 
                className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-750 transition-colors"
                onClick={() => toggleLogs(env.name)}
            >
              <div className="flex items-center">
                {getStatusIcon(env.status)}
                <span className="ml-3 text-lg font-semibold text-white">{env.name.toUpperCase()}</span>
                {env.url && <a href={env.url} target="_blank" rel="noopener noreferrer" className="ml-4 text-xs text-indigo-400 hover:underline" onClick={e => e.stopPropagation()}>{env.url}</a>}
              </div>
              <div className="flex items-center space-x-4">
                 <span className="text-xs text-gray-400">Last Deployed: {new Date(env.lastDeployed).toLocaleString()}</span>
                 <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={(e) => { e.stopPropagation(); handleDeploy(env.name); }}
                    isLoading={isDeploying[env.name]}
                    disabled={isDeploying[env.name]}
                 >
                    {isDeploying[env.name] ? 'Deploying...' : `Deploy to ${env.name}`}
                 </Button>
                 {expandedLogs[env.name] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </div>
            {deployMessage && deployMessage.env === env.name && (
                 <p className={`text-xs px-4 pb-2 ${deployMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                    {deployMessage.text}
                </p>
            )}
            {expandedLogs[env.name] && selectedEnv?.name === env.name && (
              <div className="p-4 border-t border-gray-700">
                <h3 className="text-md font-semibold text-gray-200 mb-2 flex items-center"><Terminal size={18} className="mr-2"/>Deployment Logs</h3>
                {isLoadingLogs ? (
                  <LoadingSpinner text="Loading logs..." />
                ) : logs.length > 0 ? (
                  <div className="max-h-96 overflow-y-auto bg-gray-900 p-3 rounded-md text-xs font-mono space-y-1">
                    {logs.map((log, index) => (
                      <p key={index} className={`${
                        log.level === 'error' ? 'text-red-400' : 
                        log.level === 'warning' ? 'text-yellow-400' : 'text-gray-300'
                      }`}>
                        <span className="text-gray-500_">{new Date(log.timestamp).toLocaleTimeString()}: </span>{log.message}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No logs available for this environment.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeploymentPage;
