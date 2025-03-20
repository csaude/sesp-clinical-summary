<template>
  <div class="q-pb-md">
    <!-- Header Section -->
    <header-component />

    <BodyComponent
      title="Rastreio CACUM"
      :loading="loading"
      :summaryData="rastreioData"
      @toggle-section="toggleSection"
    />
  </div>
</template>

<script setup>
import { inject, ref, onMounted } from 'vue';
import headerComponent from './headerComponent.vue';
import rastreioCACUMService from 'src/services/patient/rastreioCACUM';
import BodyComponent from './bodyComponent.vue';

// Inject patient data
const patient = inject('selectedPatient');
const loading = ref(true); // Loading state

const rastreioData = ref([]);

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

// Fetch Dados CACUM data
onMounted(async () => {
  if (!patient.value) {
    console.error('Patient data is missing.');
    loading.value = false; // Stop loading if there's no patient
    return;
  }

  try {
    const patientId = patient.value.uuid;

    const [rastreioCacumData, hPVDNAResultData] = await Promise.all([
      rastreioCACUMService.getRastreioCacumDAta(patientId),
      rastreioCACUMService.getHPVDNAResultData(patientId),
    ]);

    // Populate rastreioData
    rastreioData.value = [
      {
        title: 'VIA: Resultado e Data do último rastreio',
        isList: true,
        items:
          rastreioCacumData.length > 0
            ? rastreioCacumData.map((item) => ({
                value: item.value.display || 'Sem dados no SESP',
                source: {
                  form: item.encounter?.form?.display || 'CCU: RASTREIO',
                  date: formatDate(item.obsDatetime) || 'Sem data',
                },
              }))
            : [
                {
                  value: 'Sem dados no SESP',
                  source: { form: 'CCU: RASTREIO', date: '', location: '' },
                },
              ],
      },
      {
        title: 'Resultado de HPV-DNA',
        isList: true,
        items:
          hPVDNAResultData.length > 0
            ? hPVDNAResultData.map((item) => ({
                value: item.value.display || 'Sem dados no SESP',
                source: {
                  form: item.encounter?.form?.display || 'CCU: RASTREIO',
                  date:
                    formatDate(item.encounter.encounterDatetime) || 'Sem data',
                },
              }))
            : [
                {
                  value: 'Sem dados no SESP',
                  source: { form: 'CCU: RASTREIO', date: '', location: '' },
                },
              ],
      },
    ];
  } catch (error) {
    console.error('Error fetching Dados CACUM data:', error);
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
