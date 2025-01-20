import api from '../api/apiService';
import PatientDAO from '../db/dao/patient/PatientDAO';
import { Patient } from '../../entities/patient/Patient';

class PatientService {
  /**
   * Search patients by name or identifier.
   */
  async searchPatients(search: string, index: number = 0): Promise<any[]> {
    if (!search || search.length <= 2) {
      throw new Error('Por favor preencha o campo de pesquisa com pelo menos 3 caracteres!');
    }

    try {
      let url: string;

      // Identifier search check
      if ((search.match(/\//g) || []).length === 2 && search.replace(/\s/g, '').length > 12) {
        url = `/patient?identifier=${encodeURIComponent(search.replace(/\s/g, ''))}&v=custom:(uuid,display,identifiers:(uuid,identifier,location:(name)),person:(gender,age,dead,birthdate,addresses:(display,preferred,address1,address3,address5,address6),attributes:(display))`;
      } else {
        // General search query
        url = `/patient?q=${encodeURIComponent(search)}&v=custom:(uuid,display,identifiers:(uuid,identifier,location:(name)),person:(gender,age,dead,birthdate,addresses:(display,preferred,address1,address3,address5,address6),attributes:(display))&limit=50&startIndex=${index}`;
      }

      const response = await api.get(url);
      return response.data || [];
    } catch (error) {
      console.error('Error while searching patients:', error);
      throw error;
    }
  }

  /**
   * Get detailed patient information.
   */
  async getPatientDetails(patientId: string): Promise<any> {
    try {
      const url = `/patient/${patientId}?v=full`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error while fetching patient details:', error);
      throw error;
    }
  }

  /**
   * Fetch the next set of paginated results.
   */
  async getNextResults(url: string): Promise<{ results: any[]; nextUrl: string | null }> {
    try {
      const response = await api.get(url);
      const data = response.data;

      const nextLink = data.links?.find((link: any) => link.rel === 'next')?.uri || null;

      return {
        results: data.results || [],
        nextUrl: nextLink,
      };
    } catch (error) {
      console.error('Error fetching next results:', error);
      throw error;
    }
  }

  /**
   * Save a new patient to the local database.
   */
  async savePatient(patientData: Partial<Patient>): Promise<Patient> {
    try {
      return await PatientDAO.create(patientData);
    } catch (error) {
      console.error('Error saving patient:', error);
      throw error;
    }
  }

  /**
   * Delete a patient from the local database.
   */
  async deletePatient(id: number): Promise<void> {
    try {
      await PatientDAO.delete(id);
    } catch (error) {
      console.error('Error deleting patient:', error);
      throw error;
    }
  }
}

export default new PatientService();
