export const getUsernameFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
  
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded.username || null; 
    } catch {
      return null;
    }
  };
  