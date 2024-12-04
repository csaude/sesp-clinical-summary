import api from '../api/apiService';
import { LoginResponse } from '../../model/login/LoginResponse'; 

export default {
  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      const response = await api.get<LoginResponse>(
        '/session',
        {
          auth: { username, password },
        }
      );

      console.log(response);
      
      if (response.data.authenticated) {
        this.handleLoginResponse(response.data);
        return response.data;
      } else {
        throw new Error('Authentication failed. Please check your credentials.');
      }
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof Error) {
        console.error('Login error:', error.message);
        throw error;
      } else {
        console.error('Unexpected login error:', error);
        throw new Error('Unexpected error occurred during login.');
      }
    }
  },

  handleLoginResponse(data: LoginResponse) {
    const { sessionId, user, locale, allowedLocales } = data;

    sessionStorage.setItem('sessionId', sessionId);
    sessionStorage.setItem('userInfo', JSON.stringify(user));
    sessionStorage.setItem('locale', locale);
    sessionStorage.setItem('allowedLocales', JSON.stringify(allowedLocales));
    sessionStorage.setItem('privileges', JSON.stringify(user.privileges));
    sessionStorage.setItem('roles', JSON.stringify(user.roles));
  },

  logout() {
    sessionStorage.clear(); // Clears all session data
    window.location.reload();
  },

  getLoggedUser() {
    const userInfo = sessionStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  },

  getSessionId() {
    return sessionStorage.getItem('sessionId');
  },

  getPrivileges() {
    const privileges = sessionStorage.getItem('privileges');
    return privileges ? JSON.parse(privileges) : [];
  },

  getRoles() {
    const roles = sessionStorage.getItem('roles');
    return roles ? JSON.parse(roles) : [];
  },

  getLocale() {
    return sessionStorage.getItem('locale');
  },

  getAllowedLocales() {
    const allowedLocales = sessionStorage.getItem('allowedLocales');
    return allowedLocales ? JSON.parse(allowedLocales) : [];
  },
};
