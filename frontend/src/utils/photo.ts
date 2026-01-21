/**
 * Get the full URL for a student photo
 */
export const getPhotoUrl = (photoPath?: string | null): string | null => {
  if (!photoPath) {
    return null;
  }
  
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
  // Remove /api from base URL to get the server root
  const serverUrl = apiBaseUrl.replace('/api', '');
  
  // If photoPath already starts with /uploads, use it as is
  if (photoPath.startsWith('/uploads')) {
    return `${serverUrl}${photoPath}`;
  }
  
  // Otherwise, assume it's a filename and construct the path
  return `${serverUrl}/uploads/students/${photoPath}`;
};

/**
 * Get default avatar with initials
 */
export const getDefaultAvatar = (firstName: string, lastName: string): string => {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  return `https://ui-avatars.com/api/?name=${initials}&background=1890ff&color=fff&size=200`;
};


