<template>
  <div class="q-pb-md">
    <!-- Header Section -->
    <header-component />

    <BodyComponent
      title="Confidente"
      :loading="loading"
      :summaryData="rastreioData"
      @toggle-section="toggleSection"
    />
  </div>
</template>

<script setup>
import { inject, ref, onMounted } from 'vue';
import headerComponent from './headerComponent.vue';
import confidenteService from 'src/services/patient/confidente';
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

// Fetch Dados Confidente data
onMounted(async () => {
  if (!patient.value) {
    console.error('Patient data is missing.');
    loading.value = false; // Stop loading if there's no patient
    return;
  }

  try {
    const patientId = patient.value.uuid;

    const [confidenteName, confidantContact] = await Promise.all([
      confidenteService.getConfidenteName(patientId),
      confidenteService.getConfidantContact(patientId),
    ]);

    // Populate rastreioData
    rastreioData.value = [
      {
        title: 'Nome do Confidente',
        isList: true,
        items:
          confidenteName.length > 0
            ? confidenteName.map((item) => ({
                value: item.value || 'Sem dados no SESP',
                source: {
                  form:
                    item.encounter?.form?.display ===
                    'FORMULARIO ELECTRONICO DE LABORATORIO'
                      ? 'e-LAB'
                      : item.encounter?.form?.display || 'FICHA RESUMO',
                  date: formatDate(item.obsDatetime) || 'Sem data',
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
        title: 'Contacto do Confidente',
        isList: true,
        items:
          confidantContact.length > 0
            ? confidantContact.map((item) => ({
                value: formatDate(item.value) || 'Sem dados no SESP',
                source: {
                  form:
                    item.encounter?.form?.display ===
                    'FORMULARIO ELECTRONICO DE LABORATORIO'
                      ? 'e-LAB'
                      : item.encounter?.form?.display || 'FICHA RESUMO',
                  date: formatDate(item.obsDatetime) || 'Sem data',
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
    console.error('Error fetching Dados Confidente:', error);
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
