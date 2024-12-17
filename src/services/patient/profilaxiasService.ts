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
        return this.fetchPatientObservations(
            patientId,
            'b6c4d473-2af5-4c4d-a9bb-ad3779fa5579',
            ['3c2d563a-5d37-4735-a125-d3943a3de30a', 'e1d9ef28-1d5f-11e0-b929-000c29ad1d07']
        );
    },

    async IPTStartFichaResumo(patientId){
        return this.fetchPatientObservations(
            patientId,
            'b6c4d473-2af5-4c4d-a9bb-ad3779fa5579',
            ['05496c70-845c-40b1-9d28-070f67b3f7da', 'e1d9ef28-1d5f-11e0-b929-000c29ad1d07']
        );
    },

    async IPTStartFichaSeguimento(patientId){
        return this.fetchPatientObservations(
            patientId,
            'b6c4d473-2af5-4c4d-a9bb-ad3779fa5579',
            ['78d47629-5ac4-4e16-8972-2166eef30bfd', 'e1d9ef28-1d5f-11e0-b929-000c29ad1d07']
        );
    },

    async IPTStartFichaClinicaProfilaxia(patientId){
        return this.fetchPatientObservations(
            patientId,
            '9db4ce3b-4c1c-45dd-905f-c984a052f26e',
            '3c2d563a-5d37-4735-a125-d3943a3de30a'
        );
    },

    async IPTStartFichaResumoProfilaxia(patientId){
        return this.fetchPatientObservations(
            patientId,
            '9db4ce3b-4c1c-45dd-905f-c984a052f26e',
            '05496c70-845c-40b1-9d28-070f67b3f7da'
        );
    },

    async IPTStartFichaSeguimentoProfilaxia(patientId){
        return this.fetchPatientObservations(
            patientId,
            '9db4ce3b-4c1c-45dd-905f-c984a052f26e',
            '78d47629-5ac4-4e16-8972-2166eef30bfd'
        );
    },
    


    async allIPTStart(patientId) {
        // Obter os dados de todas as observações de 'IPTStart'
        const allIPTStart = [
            ...await this.IPTStartFichaClinica(patientId),
            ...await this.IPTStartFichaResumo(patientId),
            ...await this.IPTStartFichaSeguimento(patientId),
        ];
    
        // Obter os dados de profilaxia
        const allIPTStartProfilaxia = [
            ...await this.IPTStartFichaClinicaProfilaxia(patientId),
            ...await this.IPTStartFichaResumoProfilaxia(patientId),
            ...await this.IPTStartFichaSeguimentoProfilaxia(patientId),
        ];
    
        // Regra 1: Associar as observações de profilaxia ao 'allIPTStart'
        allIPTStart.forEach(element => {
            allIPTStartProfilaxia.forEach(elementb => {
                // Verificar se o UUID do formulário e o UUID do encontro coincidem
                if (element.encounter.form.uuid === elementb.encounter.form.uuid && element.encounter.uuid === elementb.encounter.uuid) {
                    // Adicionar a informação de profilaxia à observação
                    element.profilaxia = elementb.value.display;
                }
            });
        });
    
        // Regra 2: Ordenar 'allIPTStart' com base na data de observação (obsDatetime)
        allIPTStart.sort(function (a, b) {
            var nameA = a.obsDatetime.toString().toUpperCase(); // Ignorar maiúsculas/minúsculas
            var nameB = b.obsDatetime.toString().toUpperCase(); // Ignorar maiúsculas/minúsculas
            if (nameA < nameB) {
                return 1; // a vem depois de b
            }
            if (nameA > nameB) {
                return -1; // a vem antes de b
            }
            return 0; // são iguais
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
        const allIPTEnd = [
            ...await this.IPTEndFichaClinica(patientId),
            ...await this.IPTEndFichaResumo(patientId),
            ...await this.IPTEndFichaSeguimento(patientId),
        ];
    
        // Obter os dados de profilaxia para 'IPTStart'
        const allIPTStartProfilaxia = [
            ...await this.IPTStartFichaClinicaProfilaxia(patientId),
            ...await this.IPTStartFichaResumoProfilaxia(patientId),
            ...await this.IPTStartFichaSeguimentoProfilaxia(patientId),
        ];
    
        // Regra 5: Juntar todos os dados de 'IPTEnd'
        const allIPTEndJoined = [
            ...await this.IPTEndFichaClinica(patientId),
            ...await this.IPTEndFichaResumo(patientId),
            ...await this.IPTEndFichaSeguimento(patientId),
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
            var nameA = a.obsDatetime.toString().toUpperCase(); // Ignorar maiúsculas/minúsculas
            var nameB = b.obsDatetime.toString().toUpperCase(); // Ignorar maiúsculas/minúsculas
            if (nameA < nameB) {
                return 1; // a vem depois de b
            }
            if (nameA > nameB) {
                return -1; // a vem antes de b
            }
            return 0; // são iguais
        });
    
        return allIPTEnd;
    },

    async CTZStartFichaClinica(patientId){
        return this.fetchPatientObservations(
            patientId,
            '2616b3c9-9a99-4b9a-b673-10871f4a4c71',
            ['3c2d563a-5d37-4735-a125-d3943a3de30a', 'e1d9facc-1d5f-11e0-b929-000c29ad1d07']
        );
    },

    async IPTEndFichaFILT(patientId){
        return this.fetchPatientObservations(
            patientId,
            '2616b3c9-9a99-4b9a-b673-10871f4a4c71',
            ['3c2d563a-5d37-4735-a125-d3943a3de30a', 'e1d9facc-1d5f-11e0-b929-000c29ad1d07']
        );
    },
}