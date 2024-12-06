import api from '../api/apiService';

export default {
  async searchPatients(search: string, index: number = 0): Promise<any[]> {
    if (!search || search.length <= 2) {
      throw new Error('Por favor preencha o campo de pesquisa com pelo menos 3 caracteres!');
    }

    try {
      let url: string;

      // Identifier search check
      if ((search.match(/\//g) || []).length === 2 && search.replace(/\s/g, '').length > 12) {
        url = `/patient?identifier=${encodeURIComponent(search.replace(/\s/g, ''))}&v=custom:(uuid,display,identifiers:(uuid,location:(name)),person:(gender,age,dead,birthdate,addresses:(display,preferred,address1,address3,address5,address6),attributes:(display))`;
      } else {
        // General search query
        url = `/patient?q=${encodeURIComponent(search)}&v=custom:(uuid,display,identifiers:(uuid,location:(name)),person:(gender,age,dead,birthdate,addresses:(display,preferred,address1,address3,address5,address6),attributes:(display))&limit=50&startIndex=${index}`;
      }

      // Make the API call
      const response = await api.get(url);

      return response.data || [];
    } catch (error: unknown) {
      console.error('Error while searching patients:', error);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unexpected error occurred during patient search.');
      }
    }
  },

  async getPatientDetails(patientId: string): Promise<any> {
    try {
      const url = `/patient/${patientId}?v=full`;
      const response = await api.get(url);
      return response.data;
    } catch (error: unknown) {
      console.error('Error while fetching patient details:', error);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unexpected error occurred while fetching patient details.');
      }
    }
  },

  async getNextResults(url: string): Promise<{ results: any[]; nextUrl: string | null }> {
    try {
      const response = await api.get(url);
      const data = response.data;

      const nextLink = data.links?.find((link) => link.rel === 'next')?.uri || null;

      return {
        results: data.results || [],
        nextUrl: nextLink,
      };
    } catch (error) {
      console.error('Error fetching next results:', error);
      throw error;
    }
  },
};
