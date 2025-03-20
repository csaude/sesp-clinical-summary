<template>
  <div class="q-pb-md">
    <!-- Header Section -->
    <header-component />

    <BodyComponent
      title="Dados do Início TARV"
      :loading="loading"
      :summaryData="inicioTARVData"
      @toggle-section="toggleSection"
    />
  </div>
</template>

<script setup>
import { inject, ref, onMounted } from 'vue';
import headerComponent from './headerComponent.vue';
import inicioTarvService from 'src/services/patient/inicioTARVService';
import BodyComponent from './bodyComponent.vue';

// Inject patient data
const patient = inject('selectedPatient');
const loading = ref(true); // Loading state

// Reactive data for Dados Início TARV
const inicioTARVData = ref([]);

// Track collapsed states for each section
const collapsedSections = ref([]);

// Toggle collapse state for a section
function toggleSection(index) {
  collapsedSections.value[index] = !collapsedSections.value[index];
}

// Helper function to format date to dd-MM-yyyy
function formatDate(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

// Fetch Dados Início TARV data
onMounted(async () => {
  if (!patient.value) {
    console.error('Patient data is missing.');
    loading.value = false; // Stop loading if there's no patient
    return;
  }

  try {
    const patientId = patient.value.uuid;

    const [
      ARTStartDate,
      HfARTStart,
      PregnancyAtARTStart,
      WHOStagingAtARTStart,
    ] = await Promise.all([
      inicioTarvService.getARTStartDate(patientId),
      inicioTarvService.getHealthFacilityAtARTStart(patientId),
      inicioTarvService.getPregnancyStatusAtARTStart(patientId),
      inicioTarvService.getWHOStagingAtARTStart(patientId),
    ]);

    console.log(
      'ARTStartDate=========>',
      JSON.stringify(ARTStartDate),
      null,
      2
    );

    // Populate inicioTARVData
    inicioTARVData.value = [
      {
        title: 'Data de Início TARV',
        isList: true,
        items:
          ARTStartDate.length > 0
            ? ARTStartDate.map((item) => ({
                value: formatDate(item.value) || 'Sem dados no SESP',
                source: {
                  form:
                    item.encounter?.form?.display === 'ADULTO: SEGUIMENTO'
                      ? 'FICHA DE SEGUIMENTO'
                      : item.encounter?.form?.display || 'Sem formulário',
                  date: formatDate(item.obsDatetime) || 'Sem data',
                  location: item.encounter?.location?.name || 'Sem localidade',
                },
              }))
            : [
                {
                  value: 'Sem dados no SESP',
                  source: { form: 'FICHA RESUMO', date: '', location: '' },
                },
              ],
      },
      {
        title: 'Unidade Sanitária de Início TARV',
        isList: true,
        items:
          HfARTStart.length > 0
            ? HfARTStart.map((item) => ({
                value: item.value || 'Sem dados no SESP',
                source: {
                  form: item.encounter?.form?.display || 'Sem formulário',
                  date: formatDate(item.obsDatetime) || 'Sem data',
                  location: item.encounter?.location?.name || 'Sem localidade',
                },
              }))
            : [
                {
                  value: 'Sem dados no SESP',
                  source: { form: 'FICHA RESUMO', date: '', location: '' },
                },
              ],
      },
      {
        title: 'Estado de Gravidez no Início TARV',
        isList: true,
        items:
          PregnancyAtARTStart.length > 0
            ? PregnancyAtARTStart.map((item) => ({
                value: item.value.display || 'Sem dados no SESP',
                source: {
                  form: item.source || 'Sem formulário',
                  date: formatDate(item.obsDatetime) || 'Sem data',
                  location: item.encounter?.location?.name || 'Sem localidade',
                },
              }))
            : [
                {
                  value: 'Sem dados no SESP',
                  source: { form: 'FICHA RESUMO', date: '', location: '' },
                },
              ],
      },
      {
        title: 'Estado de OMS no Início TARV',
        isList: true,
        items:
          WHOStagingAtARTStart.length > 0
            ? WHOStagingAtARTStart.map((item) => ({
                value: item.value.display || 'Sem dados no SESP',
                source: {
                  form: item.source || 'Sem formulário',
                  date: formatDate(item.obsDatetime) || 'Sem data',
                  location: item.encounter?.location?.name || 'Sem localidade',
                },
              }))
            : [
                {
                  value: 'Sem dados no SESP',
                  source: { form: 'FICHA RESUMO', date: '', location: '' },
                },
              ],
      },
    ];
  } catch (error) {
    console.error('Error fetching Dados Início TARV data:', error);
  } finally {
    loading.value = false; // Stop loading after fetching data
  }
});
</script>

<style scoped>
.q-card {
  border: 1px solid #e0e0e0;
}
.text-h6 {
  font-size: 1.1em;
}
.text-caption {
  font-size: 0.9em;
}
</style>
