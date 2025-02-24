import api from '../api/apiService';

export default {
  async getConfidenteName(patientId: string): Promise<any[]> {
      const url = `/obs?patient=${patientId}&concept=e1de46a4-1d5f-11e0-b929-000c29ad1d07&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=12`;
      
      const response = await api.get(url);
      
      return response.data?.results?.filter((item: any) => {
          if (item.encounter && item.encounter.form) {
              const uuid = item.encounter.form.uuid?.trim(); // Remove leading/trailing spaces
              
              if (['05496c70-845c-40b1-9d28-070f67b3f7da'].includes(uuid)) {
                  return true; // Ensure it returns true for matched items
              }
          }
          return false; // Return false to exclude items that don't match
      }) || [];
  },


  async getConfidantContact(patientId: string): Promise<any[]> {
      const url = `/obs?patient=${patientId}&concept=eb23c94a-2c2e-40fa-ab82-22308b1c5f27&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=2`;
      
      const response = await api.get(url);

      return response.data?.results?.filter((item: any) => {
          if (item.encounter && item.encounter.form) {
              const uuid = item.encounter.form.uuid?.trim(); // Remove extra spaces
              
              if (['05496c70-845c-40b1-9d28-070f67b3f7da'].includes(uuid)) {
                  return true; // Return true to include the item
              }
          }
          return false; // Return false to exclude the item
      }) || [];
  },

};
