// Importando o serviço de API
import api from '../api/apiService';

export default {

  async allTBLAM(patientId) {    
  
    try {
      // Obter observações de conceito principal
      let concept = 'ef139cb2-97c1-4c0f-9189-5e0711a45b8f'
      const url = `/obs?patient=${patientId}&concept=${concept}&v=custom:(obsDatetime,value,comment,encounter:(uuid,location.name,form:(uuid,display)))`;
      const tbLamResponse = await api.get(url);
    
      const tbLamData = tbLamResponse.data;
    
      // Separar por tipo de formulário
      const rastreioTBLAMLabGeral = tbLamData.results.filter(item => item.encounter.form.uuid === "8377e4ff-d0fe-44a5-81c3-74c9040fd5f8");
      const rastreioTBLAMELab = tbLamData.results.filter(item => item.encounter.form.uuid === "5b7cecc3-4ba3-4710-85ae-fc0c13e83e27");
      const rastreioTBLAMFichaClinica = tbLamData.results.filter(item => item.encounter.form.uuid === "3c2d563a-5d37-4735-a125-d3943a3de30a");
  
      // Obter dados de Nível de Positividade
      concept = '303a4480-f2b3-4192-a446-725a401ebb09'
      const positivityResponse = await api.get(url);;
      const positivityData = positivityResponse.data;
  
      const processData = (mainArray, positivityArray) => {
        const encounterUuids = mainArray.map(item => item.encounter.uuid);
        const positivityResults = positivityArray.filter(item => encounterUuids.includes(item.encounter.uuid));
  
        return mainArray.map(element => {
          const npValue = positivityResults.find(item => item.encounter.uuid === element.encounter.uuid);
          if (npValue) {
            element.value.comment = npValue.value.display;
          }
          return element;
        });
      };
  
      // Processar os dados
      const processedLabGeral = processData(rastreioTBLAMLabGeral, positivityData.results);
      const processedELab = processData(rastreioTBLAMELab, positivityData.results);
      const processedFichaClinica = processData(rastreioTBLAMFichaClinica, positivityData.results);
    
  
      // retornar todos os dados processados
      return {
        rastreioTBLAMLabGeral: processedLabGeral,
        rastreioTBLAMELab: processedELab,
        rastreioTBLAMFichaClinica: processedFichaClinica,
      };
    } catch (error) {
      console.error("Erro ao buscar dados de TB LAM:", error);
      return [];
    }
  }, 

  async fetchPatientObservations(patientId, concept, formUuids) {
    // Garantir que formUuids seja sempre um array
    const formUuidArray = Array.isArray(formUuids) ? formUuids : [formUuids];

    const url = `/obs?patient=${patientId}&concept=${concept}&v=custom:(obsDatetime,value,comment,encounter:(uuid,location.name,form:(uuid,display)))`;

    try {
      const response = await api.get(url);
      return response.data?.results?.filter((item) => {
        if (item.encounter && item.encounter.form) {
          const uuid = item.encounter.form.uuid?.trim(); // Remover espaços em branco
          return formUuidArray.includes(uuid);
        }
        return false;
      }) || [];
    } catch (error) {
      console.error(`Erro ao buscar observações para o conceito ${concept} do paciente ${patientId}:`, error);
      return [];
    }
  },

  async allVLCopias(patientId) {
    return this.fetchPatientObservations(
      patientId,
      'e1d48fba-1d5f-11e0-b929-000c29ad1d07',
      '38377e4ff-d0fe-44a5-81c3-74c9040fd5f8'
    );
  },

  async allVLCopiasFC(patientId) {
    return this.fetchPatientObservations(
      patientId,
      'e1d48fba-1d5f-11e0-b929-000c29ad1d07',
      '3c2d563a-5d37-4735-a125-d3943a3de30a'
    );
  },

  async allVLCopiasFSR(patientId) {
    return this.fetchPatientObservations(
      patientId,
      'e1d48fba-1d5f-11e0-b929-000c29ad1d07',
      '35b7cecc3-4ba3-4710-85ae-fc0c13e83e27'
    );
  },

  async allCD4AbsFSR(patientId) {
    return this.fetchPatientObservations(
      patientId,
      'e1d48fba-1d5f-11e0-b929-000c29ad1d07',
      '5b7cecc3-4ba3-4710-85ae-fc0c13e83e27'
    );
  },

  async allCD4AbsFLG(patientId) {
    return this.fetchPatientObservations(
      patientId,
      'e1d48fba-1d5f-11e0-b929-000c29ad1d07',
      '8377e4ff-d0fe-44a5-81c3-74c9040fd5f8'
    );
  },

  async allGenexpertFC(patientId) {
    return this.fetchPatientObservations(
      patientId,
      'b08eb89b-c609-4d15-ab81-53ad7c745332',
      '3c2d563a-5d37-4735-a125-d3943a3de30a'
    );
  },

  async allGenexpert(patientId) {
    return this.fetchPatientObservations(
      patientId,
      'b08eb89b-c609-4d15-ab81-53ad7c745332',
      '8377e4ff-d0fe-44a5-81c3-74c9040fd5f8'
    );
  },

  async allBaciloscopia(patientId) {
    return this.fetchPatientObservations(
      patientId,
      'b08eb89b-c609-4d15-ab81-53ad7c745332',
      '8377e4ff-d0fe-44a5-81c3-74c9040fd5f8'
    );
  },

  async allBaciloscopiaFC(patientId) {
    return this.fetchPatientObservations(
      patientId,
      'b08eb89b-c609-4d15-ab81-53ad7c745332',
      '3c2d563a-5d37-4735-a125-d3943a3de30a'
    );
  },

  async allCD4CoverageFLG(patientId) {
    return this.fetchPatientObservations(
      patientId,
      'e1d48fba-1d5f-11e0-b929-000c29ad1d07',
      '8377e4ff-d0fe-44a5-81c3-74c9040fd5f8'
    );
  },

  async allCD4CoverageFSR(patientId) {
    return this.fetchPatientObservations(
      patientId,
      'e1d48fba-1d5f-11e0-b929-000c29ad1d07',
      '5b7cecc3-4ba3-4710-85ae-fc0c13e83e27'
    );
  },

  async allHGB(patientId) {
    return this.fetchPatientObservations(
      patientId,
      'e1cdbe88-1d5f-11e0-b929-000c29ad1d07',
      '8377e4ff-d0fe-44a5-81c3-74c9040fd5f8'
    );
  },

  async allAST(patientId) {
    return this.fetchPatientObservations(
      patientId,
      'e1d43a74-1d5f-11e0-b929-000c29ad1d07',
      '8377e4ff-d0fe-44a5-81c3-74c9040fd5f8'
    );
  },

  async allALT(patientId) {
    return this.fetchPatientObservations(
      patientId,
      'e1d43a74-1d5f-11e0-b929-000c29ad1d07',
      '8377e4ff-d0fe-44a5-81c3-74c9040fd5f8'
    );
  },

  async allAMI(patientId) {
    return this.fetchPatientObservations(
      patientId,
      'e1d43a74-1d5f-11e0-b929-000c29ad1d07',
      '8377e4ff-d0fe-44a5-81c3-74c9040fd5f8'
    );
  },

  async allGLC(patientId) {
    return this.fetchPatientObservations(
      patientId,
      'e1d43a74-1d5f-11e0-b929-000c29ad1d07',
      '8377e4ff-d0fe-44a5-81c3-74c9040fd5f8'
    );
  },

  async allPCR(patientId) {
    return this.fetchPatientObservations(
      patientId,
      'e1d43a74-1d5f-11e0-b929-000c29ad1d07',
      '8377e4ff-d0fe-44a5-81c3-74c9040fd5f8'
    );
  },


  //---------------------------
  async allVLs(patientId: string) {
    const qualitativeConcept = 'e1d6247e-1d5f-11e0-b929-000c29ad1d07';
    const quantitativeConcept = 'e1d6247e-1d5f-11e0-b929-000c29ad1d07';
    const formUuids = [
      '8377e4ff-d0fe-44a5-81c3-74c9040fd5f8', // LABORATÓRIO GERAL
      '5b7cecc3-4ba3-4710-85ae-fc0c13e83e27', // FICHA RESUMO
      '3c2d563a-5d37-4735-a125-d3943a3de30a', // FICHA CLÍNICA
    ];
  
    const qualitativeUrl = `/obs?patient=${patientId}&concept=${qualitativeConcept}&v=custom:(obsDatetime,value,comment,encounter:(uuid,location.name,form:(uuid,display)))`;
    const quantitativeUrl = `/obs?patient=${patientId}&concept=${quantitativeConcept}&v=custom:(obsDatetime,value,comment,encounter:(uuid,location.name,form:(uuid,display)))`;
  
    try {
      // Buscar observações qualitativas
      let qualitativeResults = await api.get(qualitativeUrl).then((response) => {
        return (
          response.data?.results?.filter((item) => {
            if (item.encounter && item.encounter.form) {
              const uuid = item.encounter.form.uuid?.trim();
              return formUuids.some((formUuid) => formUuid === uuid);
            }
            return false;
          }) || []
        );
      });


      // Harmonizar nomes
      qualitativeResults.forEach((element,i) =>
        {
          if (typeof element == "object"){
           if (element?.encounter?.form?.uuid == "0afbb0c7-d58d-4737-8fb1-5f32761b97df"){
            element.value.display = "<"
          } else
          if (element?.encounter?.form?.uuid == "e24d576a-1d5f-11e0-b929-000c29ad1d07"){
            element.encounter.form.display = "NIVEL DE DETECCAO BAIXO"
          } else
          if (element?.encounter?.form?.uuid == "65292e1c-87ec-4159-b051-25a9ef84d541"){
            element.encounter.form.display = "INDETECTAVEL"
          }
        }
        });
  
      // Buscar observações quantitativas
      const quantitativeResults = await api.get(quantitativeUrl).then((response) => {
        return (
          response.data?.results?.filter((item) => {
            if (item.encounter && item.encounter.form) {
              const uuid = item.encounter.form.uuid?.trim();
              return formUuids.some((formUuid) => formUuid === uuid);
            }
            return false;
          }) || []
        );
      });

  
      // Mesclar resultados
      const allVLsV2 = [...qualitativeResults];
      const allVLs = quantitativeResults.map((quantitative) => {
        const matchedQualitativeIndex = allVLsV2.findIndex(
          (qualitative) =>
            quantitative.obsDatetime === qualitative.obsDatetime &&
            quantitative.encounter.form.uuid === qualitative.encounter.form.uuid
        );
  
        if (matchedQualitativeIndex !== -1) {
          const matchedQualitative = allVLsV2[matchedQualitativeIndex];
          allVLsV2.splice(matchedQualitativeIndex, 1);
  
          return {
            ...quantitative,
            value: `${quantitative.value}`,
          };
        }
  
        return quantitative;
      });
  
      // Adicionar os não mesclados restantes
      allVLs.push(...allVLsV2);
  
      // Ordenar por data (descendente)
      return allVLs.sort((a, b) => new Date(b.obsDatetime).getTime() - new Date(a.obsDatetime).getTime());
    } catch (error) {
      console.error(`Erro ao buscar observações para o paciente ${patientId}:`, error);
      return [];
    }
  }
}