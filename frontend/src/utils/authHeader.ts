import { refreshAccessToken } from './refreshToken';

export const getAuthHeader = async (): Promise<{ Authorization: string } | {}> => {
  let access = localStorage.getItem('access');
  if (!access) return {};

  // Проверим и обновим токен
  const payload = JSON.parse(atob(access.split('.')[1]));
  const expiry = payload.exp * 1000;
  const now = Date.now();

  if (expiry < now) {
    access = await refreshAccessToken();
  }

  return access ? { Authorization: `Bearer ${access}` } : {};
};
