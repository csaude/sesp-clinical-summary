import api from '../api/apiService';

export default {
  async getMostRecentConsultation(patientId: string): Promise<any[]> {
    const url = `/encounter?patient=${patientId}&encounterType=e278f956-1d5f-11e0-b929-000c29ad1d07&v=custom:(uuid,encounterDatetime,form:(display),location:(display))&limit=1&order=desc`;
    const response = await api.get(url);
    return response.data.results || [];
  },

  async getNextAppointment(patientId: string): Promise<any[]> {
    const url = `/encounter?patient=${patientId}&encounterType=e278f956-1d5f-11e0-b929-000c29ad1d07&v=full&limit=1&order=desc`;
    const response = await api.get(url);
    const data = response.data.results[0]?.obs.filter(
      (item: any) =>
        item.concept.uuid === 'e1dae630-1d5f-11e0-b929-000c29ad1d07'
    );
    if (data?.length > 0) {
      data[0].source = response.data.results[0]?.form?.display;
    }
    return data || [];
  },

  async getWeight(patientId: string): Promise<any[]> {
    const url = `/obs?patient=${patientId}&concept=5089AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=12`;

    const response = await api.get(url);
    const data = response.data.results || [];

    // Filter for specific form UUID
    const filteredData = data.filter(
      (item: any) =>
        item.encounter?.form?.uuid === '3c2d563a-5d37-4735-a125-d3943a3de30a'
    );

    // Return the filtered results
    return filteredData;
  },

  async getHeight(patientId: string): Promise<any[]> {
    const url = `/obs?patient=${patientId}&concept=5090AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=12`;

    const response = await api.get(url);
    const data = response.data.results || [];

    // Filter for specific form UUID
    const filteredData = data.filter(
      (item: any) =>
        item.encounter?.form?.uuid === '3c2d563a-5d37-4735-a125-d3943a3de30a'
    );

    // Return the filtered results
    return filteredData;
  },

  async getBMI(patientId: string): Promise<any[]> {
    const url = `/obs?patient=${patientId}&concept=e1da52ba-1d5f-11e0-b929-000c29ad1d07&v=custom:(obsDatetime,concept,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=12`;

    const response = await api.get(url);
    const data = response.data.results || [];

    // Filter for specific form UUID
    const filteredData = data.filter(
      (item: any) =>
        item.encounter?.form?.uuid === '3c2d563a-5d37-4735-a125-d3943a3de30a'
    );

    // Return the filtered results
    return filteredData;
  },

  async getMDS(patientId: string): Promise<any[]> {
    const url = `/obs?patient=${patientId}&concept=bebcfbe3-bb5b-4c5c-a41e-808fc4457fc3&v=custom:(obsDatetime,value,groupMembers:(obsDatetime,value,concept:(uuid,display)),encounter:(uuid,location.name,form:(uuid,display)))&limit=5`;

    const response = await api.get(url);
    const filteredData = response.data.results.filter(
      (item: any) =>
        item.encounter?.form?.uuid === '3c2d563a-5d37-4735-a125-d3943a3de30a'
    );

    const mdsData: any[] = [];

    filteredData.forEach((item: any) => {
      const mdsInfo = { mds: '', state: '', date: '', source: '', hf: '' };

      mdsInfo.source = item.encounter?.form?.display || 'Sem formulário';
      mdsInfo.hf = item.encounter['location.name'] || 'Sem localidade';

      if (item.groupMembers && item.groupMembers.length > 0) {
        item.groupMembers.forEach((member: any) => {
          if (member.concept?.uuid === '40a9a12b-1205-4a55-bb93-caf15452bf61') {
            mdsInfo.mds = member.value?.display || 'Sem dados';
            mdsInfo.date = member.obsDatetime || 'Sem data';
          } else if (member.value?.uuid) {
            switch (member.value.uuid) {
              case 'e1d9ef28-1d5f-11e0-b929-000c29ad1d07':
                mdsInfo.state = 'Início (I)';
                break;
              case 'e1d9f036-1d5f-11e0-b929-000c29ad1d07':
                mdsInfo.state = 'Continua (C)';
                break;
              case 'e1d9facc-1d5f-11e0-b929-000c29ad1d07':
                mdsInfo.state = 'Fim (F)';
                break;
              default:
                mdsInfo.state = 'Desconhecido';
            }
          }
        });
      }

      mdsData.push(mdsInfo);
    });
    return mdsData;
  },

  async getPregnancyStatus(patientId: string): Promise<any[]> {
    const url = `/encounter?patient=${patientId}&encounterType=e278f956-1d5f-11e0-b929-000c29ad1d07&v=full&limit=1&order=desc`;
    const response = await api.get(url);

    const data = response.data.results[0]?.obs.filter(
      (item: any) =>
        item.concept.uuid === 'e1e056a6-1d5f-11e0-b929-000c29ad1d07'
    );
    if (data?.length > 0) {
      const url1 = `/obs?patient=${patientId}&concept=e1e056a6-1d5f-11e0-b929-000c29ad1d07&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=5`;

      return api
        .get(url1)
        .then((response) => {
          // Validate and filter response data
          if (response.data?.results) {
            const pregnancy = response.data.results.filter(
              (item: any) =>
                item?.encounter?.form?.uuid ===
                '3c2d563a-5d37-4735-a125-d3943a3de30a'
            );

            return pregnancy || [];
          }

          // Return empty array if no valid data
          return [];
        })
        .catch((error) => {
          console.error('Error fetching pregnancy status:', error);
          return [];
        });
    }

    return data || [];
  },

  async getBreastfeedingStatus(patientId: string): Promise<any[]> {
    const url = `/encounter?patient=${patientId}&encounterType=e278f956-1d5f-11e0-b929-000c29ad1d07&v=full&limit=1&order=desc`;
    const response = await api.get(url);

    const data = response.data.results[0]?.obs.filter(
      (item: any) =>
        item.concept.uuid === 'bc4fe755-fc8f-49b8-9956-baf2477e8313'
    );
    if (data?.length > 0) {
      const url1 = `/obs?patient=${patientId}&concept=bc4fe755-fc8f-49b8-9956-baf2477e8313&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=5`;

      return api
        .get(url1)
        .then((response) => {
          // Validate and filter response data
          if (response.data?.results) {
            const pregnancy = response.data.results.filter(
              (item: any) =>
                item?.encounter?.form?.uuid ===
                '3c2d563a-5d37-4735-a125-d3943a3de30a'
            );

            return pregnancy || [];
          }

          // Return empty array if no valid data
          return [];
        })
        .catch((error) => {
          console.error('Error fetching pregnancy status:', error);
          return [];
        });
    }
    return data || [];
  },

  async getProgramEnrollment(patientId: string): Promise<any> {
    const url = `/programenrollment?patient=${patientId}&v=full`;
    const response = await api.get(url);
  
    const data = response.data.results || [];
    const enrolls: Array<any> = [];
  
    // Map through program enrollments and build required structure
    data.forEach((enrollment: any) => {
      const state = {
        program: '',
        dateEnrolled: '',
        dateCompleted: '',
        states: '',
        stateDate: '',
      };
  
      // Assign program details
      state.program = enrollment.program?.name || 'N/A';
      state.dateEnrolled = enrollment.dateEnrolled || 'N/A';
      state.dateCompleted = enrollment.dateCompleted || 'N/A';
  
      // Sort states by startDate in descending order (latest first)
      if (enrollment.states?.length > 0) {
        const sortedStates = enrollment.states.sort((a: any, b: any) => 
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
  
        // Pick the most recent state
        const latestState = sortedStates[0];
        state.states = latestState?.state?.concept?.display || 'N/A';
  
        // Set stateDate to the startDate of the most recent state
        state.stateDate = latestState?.startDate || state.dateEnrolled;
      } else {
        state.states = 'N/A';
        state.stateDate = state.dateEnrolled; // Default to dateEnrolled if no states exist
      }
  
      enrolls.push(state);
    });
  
    // Return only the last enrollment if it exists
    return enrolls.length > 0 ? [enrolls[enrolls.length - 1]] : [];
  }
  
};
