// This service is for real backend integration. Use only when the backend is available.
// For frontend-only development, use the mock services instead.

export const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';

export async function fetchProjects() {
  const response = await fetch(`${API_BASE_URL}/projects`);
  if (!response.ok) {
    throw new Error('Failed to fetch projects');
  }
  return response.json();
}

export async function getFileStructure() {
  const response = await fetch(`${API_BASE_URL}/files`);
  if (!response.ok) throw new Error('Failed to fetch file structure');
  return response.json();
}

export async function getFileContent(path: string) {
  const response = await fetch(`${API_BASE_URL}/files/content?path=${encodeURIComponent(path)}`);
  if (!response.ok) throw new Error('Failed to fetch file content');
  return response.json();
}

export async function createFile(path: string, content: any = '') {
  const response = await fetch(`${API_BASE_URL}/files`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, content })
  });
  if (!response.ok) throw new Error('Failed to create file');
  return response.json();
}

export async function saveFile(path: string, content: any) {
  const response = await fetch(`${API_BASE_URL}/files/content`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, content })
  });
  if (!response.ok) throw new Error('Failed to save file');
  return response.json();
}

export async function deleteFile(path: string) {
  const response = await fetch(`${API_BASE_URL}/files?path=${encodeURIComponent(path)}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete file');
  return response.json();
}

export async function createDirectory(path: string) {
  const response = await fetch(`${API_BASE_URL}/directories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path })
  });
  if (!response.ok) throw new Error('Failed to create directory');
  return response.json();
}

export async function deleteDirectory(path: string) {
  const response = await fetch(`${API_BASE_URL}/directories?path=${encodeURIComponent(path)}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete directory');
  return response.json();
}

export async function fetchComponents() {
  const response = await fetch(`${API_BASE_URL}/components`);
  if (!response.ok) throw new Error('Failed to fetch components');
  return response.json();
}

export async function fetchComponentById(id: string) {
  const response = await fetch(`${API_BASE_URL}/components/${id}`);
  if (!response.ok) throw new Error('Failed to fetch component');
  return response.json();
}

export async function createComponent(data: any) {
  const response = await fetch(`${API_BASE_URL}/components`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to create component');
  return response.json();
}

export async function updateComponent(id: string, data: any) {
  const response = await fetch(`${API_BASE_URL}/components/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to update component');
  return response.json();
}

export async function deleteComponent(id: string) {
  const response = await fetch(`${API_BASE_URL}/components/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete component');
  return response.json();
}

export async function fetchDeployedEnvironments() {
  const response = await fetch(`${API_BASE_URL}/deployments/environments`);
  if (!response.ok) throw new Error('Failed to fetch environments');
  return response.json();
}

export async function fetchDeploymentLogs(environmentName: string) {
  const response = await fetch(`${API_BASE_URL}/deployments/logs?environment=${encodeURIComponent(environmentName)}`);
  if (!response.ok) throw new Error('Failed to fetch deployment logs');
  return response.json();
}

export async function deployToEnvironment(environmentName: string) {
  const response = await fetch(`${API_BASE_URL}/deployments/deploy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ environment: environmentName })
  });
  if (!response.ok) throw new Error('Failed to deploy to environment');
  return response.json();
} 