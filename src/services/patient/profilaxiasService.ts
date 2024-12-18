// Importando o serviço de API
import api from '../api/apiService';

export default {
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

    async IPTStartFichaClinica(patientId){
        const url = `/obs?patient=${patientId}&concept=b6c4d473-2af5-4c4d-a9bb-ad3779fa5579&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=12`
        
        const response = await api.get(url);
        return response.data?.results?.filter((item) => {
            if (item.encounter && item.encounter.form) {
                const uuid = item.encounter.form.uuid?.trim(); // Remover espaços em branco
                return ['3c2d563a-5d37-4735-a125-d3943a3de30a', 'e1d9ef28-1d5f-11e0-b929-000c29ad1d07'].includes(uuid);
            }
            return false;
        }) || [];
    },

    async IPTStartFichaResumo(patientId){
        const url = `/obs?patient=${patientId}&concept=b6c4d473-2af5-4c4d-a9bb-ad3779fa5579&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=12`
        
        const response = await api.get(url);
        return response.data?.results?.filter((item) => {
            if (item.encounter && item.encounter.form) {
                const uuid = item.encounter.form.uuid?.trim(); // Remover espaços em branco
                return ['05496c70-845c-40b1-9d28-070f67b3f7da', 'e1d9ef28-1d5f-11e0-b929-000c29ad1d07'].includes(uuid);
            }
            return false;
        }) || [];
    },

    async IPTStartFichaSeguimento(patientId){
        const url = `/obs?patient=${patientId}&concept=b6c4d473-2af5-4c4d-a9bb-ad3779fa5579&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=12`
        
        const response = await api.get(url);
        return response.data?.results?.filter((item) => {
            if (item.encounter && item.encounter.form) {
                const uuid = item.encounter.form.uuid?.trim(); // Remover espaços em branco
                return ['78d47629-5ac4-4e16-8972-2166eef30bfd', 'e1d9ef28-1d5f-11e0-b929-000c29ad1d07'].includes(uuid);
            }
            return false;
        }) || [];
    },

    async IPTStartFichaClinicaProfilaxia(patientId){
        const url = `/obs?patient=${patientId}&concept=9db4ce3b-4c1c-45dd-905f-c984a052f26e&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=12`
        
        const response = await api.get(url);
        return response.data?.results?.filter((item) => {
            if (item.encounter && item.encounter.form) {
                const uuid = item.encounter.form.uuid?.trim(); // Remover espaços em branco
                return ['3c2d563a-5d37-4735-a125-d3943a3de30a'].includes(uuid);
            }
            return false;
        }) || [];
    },

    async IPTStartFichaResumoProfilaxia(patientId){
        const url = `/obs?patient=${patientId}&concept=9db4ce3b-4c1c-45dd-905f-c984a052f26e&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=12`
        
        const response = await api.get(url);
            return response.data?.results?.filter((item) => {
                if (item.encounter && item.encounter.form) {
                    const uuid = item.encounter.form.uuid?.trim(); // Remover espaços em branco
                    return ['05496c70-845c-40b1-9d28-070f67b3f7da'].includes(uuid);
                }
            return false;
        }) || [];
    },

    async IPTStartFichaSeguimentoProfilaxia(patientId){
        const url = `/obs?patient=${patientId}&concept=9db4ce3b-4c1c-45dd-905f-c984a052f26e&v=custom:(obsDatetime,value,encounter:(uuid,location.name,form:(uuid,display)))&limit=12`
        
        const response = await api.get(url);
        return response.data?.results?.filter((item) => {
            if (item.encounter && item.encounter.form) {
                const uuid = item.encounter.form.uuid?.trim(); // Remover espaços em branco
                return ['78d47629-5ac4-4e16-8972-2166eef30bfd'].includes(uuid);
            }
            return false;
        }) || [];
    },
    


    async allIPTStart(patientId) {
        // Obter os dados de todas as observações de 'IPTStart'  e concatenar
        const iPTStartFichaClinicaJSON = await this.IPTStartFichaClinica(patientId)
        const iPTStartFichaResumoJSON = await this.IPTStartFichaResumo(patientId)
        const iPTStartFichaSeguimentoJSON = await this.IPTStartFichaSeguimento(patientId)
        let allIPTStart = iPTStartFichaClinicaJSON.concat(iPTStartFichaResumoJSON.concat(iPTStartFichaSeguimentoJSON))
        allIPTStart = allIPTStart.filter((item) => {
            if (item.value.display) {
                const status = item.value.display?.trim(); // Remover espaços em branco
                return status === 'INICIAR';
            }
            return false;
        })
        // Obter os dados de profilaxia e concatenar
        const iPTStartFichaClinicaProfilaxia = await this.IPTStartFichaClinicaProfilaxia(patientId)
        const iPTStartFichaResumoProfilaxia = await this.IPTStartFichaResumoProfilaxia(patientId)
        const iPTStartFichaSeguimentoProfilaxia = await this.IPTStartFichaSeguimentoProfilaxia(patientId)
        const allIPTStartProfilaxia = iPTStartFichaClinicaProfilaxia.concat(iPTStartFichaResumoProfilaxia.concat(iPTStartFichaSeguimentoProfilaxia))

        // Regra 1: Associar as observações de profilaxia ao 'allIPTStart'
        allIPTStart.forEach(element => {
            allIPTStartProfilaxia.forEach(elementb => {
                // Verificar se o UUID do formulário e o UUID do encontro coincidem
                if (element.encounter.form.uuid === elementb.encounter.form.uuid && element.encounter.uuid === elementb.encounter.uuid) {

                    // Adicionar a informação de profilaxia à observação
                    element.profilaxia = elementb.value.display;
                    console.log('element: ', JSON.stringify(element, null, 2));
                }
            });
        });

        // Regra 2: Ordenar 'allIPTStart' com base na data de observação (obsDatetime) e eliminar duplicatas
        allIPTStart.sort(function (a, b) {
            // Converter as datas para formato comparável
            var dateA = new Date(a.obsDatetime);
            var dateB = new Date(b.obsDatetime);

            // Ordenação decrescente (mais recente primeiro)
            return dateB - dateA;
        });
    
        return allIPTStart;
    },
    
    //---------END
    async IPTEndFichaClinica(patientId){
        return this.fetchPatientObservations(
            patientId,
            'b6c4d473-2af5-4c4d-a9bb-ad3779fa5579',
            ['3c2d563a-5d37-4735-a125-d3943a3de30a', 'e1d9facc-1d5f-11e0-b929-000c29ad1d07']
        );
    },

    async IPTEndFichaResumo(patientId){
        return this.fetchPatientObservations(
            patientId,
            'b6c4d473-2af5-4c4d-a9bb-ad3779fa5579',
            ['05496c70-845c-40b1-9d28-070f67b3f7da', 'e1d9facc-1d5f-11e0-b929-000c29ad1d07']
        );
    },

    async IPTEndFichaSeguimento(patientId){
        return this.fetchPatientObservations(
            patientId,
            'b6c4d473-2af5-4c4d-a9bb-ad3779fa5579',
            ['78d47629-5ac4-4e16-8972-2166eef30bfd', 'e1d9facc-1d5f-11e0-b929-000c29ad1d07']
        );
    },

    async allIPTEnd(patientId) {
        // Obter os dados de todas as observações de 'IPTEnd'
        let allIPTEnd = [
            ...await this.IPTEndFichaClinica(patientId),
            ...await this.IPTEndFichaResumo(patientId),
            ...await this.IPTEndFichaSeguimento(patientId),
        ];
    
        allIPTEnd = allIPTEnd.filter((item) => {
            if (item.value.display) {
                const status = item.value.display?.trim(); // Remover espaços em branco
                return status === 'COMPLETO';
            }
            return false;
        })
        // Obter os dados de profilaxia
        const allIPTStartProfilaxia = [
            ...await this.IPTStartFichaClinicaProfilaxia(patientId),
            ...await this.IPTStartFichaResumoProfilaxia(patientId),
            ...await this.IPTStartFichaSeguimentoProfilaxia(patientId),
        ];
    
        // Regra 6: Associar as observações de profilaxia a 'allIPTEnd'
        allIPTEnd.forEach(element => {
            allIPTStartProfilaxia.forEach(elementb => {
                // Verificar se o UUID do formulário e o UUID do encontro coincidem
                if (element.encounter.form.uuid === elementb.encounter.form.uuid && element.encounter.uuid === elementb.encounter.uuid) {
                    // Adicionar a informação de profilaxia à observação
                    element.profilaxia = elementb.value.display;
                }
            });
        });
    
        // Regra 7: Ordenar 'allIPTEnd' com base na data de observação (obsDatetime)
        allIPTEnd.sort(function (a, b) {
            // Converter as datas para formato comparável
            var dateA = new Date(a.obsDatetime);
            var dateB = new Date(b.obsDatetime);

            // Ordenação decrescente (mais recente primeiro)
            return dateB - dateA;
        });
    
        return allIPTEnd;
    },

    async CTZStartFichaClinica(patientId){
        const url = `/obs?patient=${patientId}&concept=2616b3c9-9a99-4b9a-b673-10871f4a4c71&v=custom:(obsDatetime,concept:(uuid),value,encounter:(uuid,location.name,form:(uuid,display)))&limit=12`
        
        const response = await api.get(url);
        return response.data?.results?.filter((item) => {
            if (item.encounter && item.encounter.form) {
                const uuid = item.encounter.form.uuid?.trim(); // Remover espaços em branco
                return ['3c2d563a-5d37-4735-a125-d3943a3de30a', 'e1d9facc-1d5f-11e0-b929-000c29ad1d07'].includes(uuid);
            }
            return false;
        }) || [];
    },

    async CTZEndFichaClinica(patientId){
        const url = `/obs?patient=${patientId}&concept=2616b3c9-9a99-4b9a-b673-10871f4a4c71&v=custom:(obsDatetime,concept:(uuid),value,encounter:(uuid,location.name,form:(uuid,display)))&limit=12`
        
        const response = await api.get(url);
        return response.data?.results?.filter((item) => {
            if (item.encounter && item.encounter.form) {
                const uuid = item.encounter.form.uuid?.trim(); // Remover espaços em branco
                return ['3c2d563a-5d37-4735-a125-d3943a3de30a', 'e1d9facc-1d5f-11e0-b929-000c29ad1d07'].includes(uuid);
            }
            return false;
        }) || [];
    },

    async IPTEndFichaFILT(patientId){
        return this.fetchPatientObservations(
            patientId,
            '2616b3c9-9a99-4b9a-b673-10871f4a4c71',
            ['3c2d563a-5d37-4735-a125-d3943a3de30a', 'e1d9facc-1d5f-11e0-b929-000c29ad1d07']
        );
    },
}