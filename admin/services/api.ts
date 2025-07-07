export async function getData() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/http://localhost:8080`);
    return res.json();
  }

  // app/api/service.ts
export const apiRequest = async (url: string, options?: RequestInit) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      ...options,
      headers: {
        ...options?.headers,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) throw new Error('Request failed');
    return res.json();
  };
  
  // Auth API
  export const authRegister = (data: any) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(data) });
  export const authLogin = (data: any) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(data) });
  export const authResetPassword = (data: any, token: string) =>
    apiRequest('/auth/reset-password', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  
  // Project API
  export const getProjects = () => apiRequest('/projects/', { method: 'GET' });
  export const uploadFile = (formData: FormData) =>
    apiRequest('/projects/files', { method: 'POST', body: formData });
  export const getFile = (id: string) => apiRequest(`/files/${id}`, { method: 'GET' });
  export const addCategory = (data: any) => apiRequest('/projects/categories', { method: 'POST', body: JSON.stringify(data) });
  export const getCategories = () => apiRequest('/projects/categories', { method: 'GET' });
  export const updateCategory = (id: string, data: any) =>
    apiRequest(`/projects/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  export const deleteCategory = (id: string) => apiRequest(`/projects/categories/${id}`, { method: 'DELETE' });
  export const getProjectsByCategory = (category: string) => apiRequest(`/projects/${category}`, { method: 'GET' });
  export const addProject = (category: string, data: any) =>
    apiRequest(`/projects/${category}`, { method: 'POST', body: JSON.stringify(data) });
  export const updateProject = (category: string, id: string, data: any) =>
    apiRequest(`/projects/${category}/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  export const deleteProject = (category: string, id: string) =>
    apiRequest(`/projects/${category}/${id}`, { method: 'DELETE' });
  
  // Service Steps API
  export const getAllServiceSteps = (category: string) => apiRequest(`/servicesteps/${category}/service-steps`, { method: 'GET' });
  export const getServiceStep = (category: string, stepId: string) =>
    apiRequest(`/servicesteps/${category}/service-steps/${stepId}`, { method: 'GET' });
  export const addServiceStep = (category: string, data: any) =>
    apiRequest(`/servicesteps/${category}/service-steps`, { method: 'POST', body: JSON.stringify(data) });
  export const updateServiceStep = (category: string, stepId: string, data: any) =>
    apiRequest(`/servicesteps/${category}/service-steps/${stepId}`, { method: 'PUT', body: JSON.stringify(data) });
  export const deleteServiceStep = (category: string, stepId: string) =>
    apiRequest(`/servicesteps/${category}/service-steps/${stepId}`, { method: 'DELETE' });