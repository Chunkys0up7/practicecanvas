
import { Project, AIComponent, DeployedEnvironment, DeploymentLog } from '../types';
import { MOCK_PROJECTS, MOCK_COMPONENTS } from '../constants';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchProjects = async (): Promise<Project[]> => {
  await delay(500);
  return MOCK_PROJECTS;
};

export const fetchProjectById = async (id: string): Promise<Project | undefined> => {
  await delay(300);
  return MOCK_PROJECTS.find(p => p.id === id);
};

export const fetchComponents = async (): Promise<AIComponent[]> => {
  await delay(400);
  return MOCK_COMPONENTS;
};

export const fetchComponentById = async (id: string): Promise<AIComponent | undefined> => {
  await delay(200);
  return MOCK_COMPONENTS.find(c => c.id === id);
};

export const saveCanvasState = async (projectId: string, state: any): Promise<{ success: boolean; message: string }> => {
  await delay(700);
  console.log(`Saving canvas state for project ${projectId}:`, state);
  // Simulate potential save error
  if (Math.random() < 0.1) {
    return { success: false, message: 'Failed to save canvas state. Please try again.' };
  }
  return { success: true, message: 'Canvas state saved successfully.' };
};

export const updateComponentConfig = async (componentId: string, config: any): Promise<{ success: boolean }> => {
  await delay(300);
  console.log(`Updating config for component ${componentId}:`, config);
  return { success: true };
};


export const fetchDeployedEnvironments = async (): Promise<DeployedEnvironment[]> => {
  await delay(600);
  return [
    { name: 'local', status: 'Deployed', lastDeployed: new Date(Date.now() - 2*60*60*1000).toISOString(), url: 'http://localhost:3000' },
    { name: 'staging', status: 'Deployed', lastDeployed: new Date(Date.now() - 24*60*60*1000).toISOString(), url: 'https://staging.example.com' },
    { name: 'production', status: 'Pending', lastDeployed: new Date(Date.now() - 5*24*60*60*1000).toISOString() },
  ];
};

export const fetchDeploymentLogs = async (environmentName: string): Promise<DeploymentLog[]> => {
  await delay(400);
  const commonLogs = [
    { timestamp: new Date(Date.now() - 5*60*1000).toISOString(), message: `Deployment process started for ${environmentName}.`, level: 'info' as 'info'},
    { timestamp: new Date(Date.now() - 4*60*1000).toISOString(), message: 'Fetching latest code from repository...', level: 'info' as 'info'},
    { timestamp: new Date(Date.now() - 3*60*1000).toISOString(), message: 'Building application...', level: 'info' as 'info'},
  ];
  if (environmentName === 'production' && Math.random() > 0.5) {
    return [
        ...commonLogs,
        { timestamp: new Date(Date.now() - 2*60*1000).toISOString(), message: 'Build failed: Missing dependency "magic-wand".', level: 'error' as 'error'},
        { timestamp: new Date(Date.now() - 1*60*1000).toISOString(), message: 'Deployment process halted due to error.', level: 'error' as 'error'},
    ]
  }
  return [
    ...commonLogs,
    { timestamp: new Date(Date.now() - 2*60*1000).toISOString(), message: 'Application build successful.', level: 'info' as 'info'},
    { timestamp: new Date(Date.now() - 1*60*1000).toISOString(), message: `Deploying to ${environmentName} environment...`, level: 'info' as 'info'},
    { timestamp: new Date().toISOString(), message: `Deployment to ${environmentName} successful.`, level: 'info' as 'info'},
  ];
};

export const deployToEnvironment = async (environmentName: string): Promise<{success: boolean, message: string}> => {
    await delay(2000 + Math.random() * 3000); // Simulate longer deployment time
    if (environmentName === 'production' && Math.random() < 0.3) {
        return { success: false, message: `Deployment to ${environmentName} failed: Insufficient unicorn tears.`};
    }
    return { success: true, message: `Successfully initiated deployment to ${environmentName}. Check logs for status.`};
}
