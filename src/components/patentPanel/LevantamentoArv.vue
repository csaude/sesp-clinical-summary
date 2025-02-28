<template>
  <div class="q-pb-md">
    <!-- Header Section -->
    <header-component />
    <BodyComponent
      title="Levantamento de ARV"
      :loading="loading"
      :summaryData="levantamentoData"
      @toggle-section="toggleSection"
    />
  </div>
</template>

<script setup>
import { inject, ref, onMounted } from 'vue';
import headerComponent from './headerComponent.vue';
import levantamentoARVService from 'src/services/patient/levantamentoARVService';
import BodyComponent from './bodyComponent.vue';

// Inject patient data
const patient = inject('selectedPatient');

// Reactive data for Levantamento ARV
const levantamentoData = ref([]);
const loading = ref(true); // Loading state

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

// Fetch Levantamento ARV data
onMounted(async () => {
  if (!patient.value) {
    console.error('Patient data is missing.');
    loading.value = false;
    return;
  }

  try {
    const patientId = patient.value.uuid;

    const [
      nextPickupDate,
      pickupRegime,
      alternativeFirstRow,
      switchSecondRow,
      switchThirdRow,
    ] = await Promise.all([
      levantamentoARVService.getNextARTPickupDate(patientId),
      levantamentoARVService.getARTPickupRegime(patientId),
      levantamentoARVService.getAlternativeFirstRow(patientId),
      levantamentoARVService.getSwitchSecondRow(patientId),
      levantamentoARVService.getSwitchThirdRow(patientId),
    ]);

    // Populate levantamentoData
    levantamentoData.value = [
      {
        title: 'Data do último levantamento de ARV',
        value: pickupRegime[0]?.obsDatetime
          ? formatDate(pickupRegime[0]?.obsDatetime)
          : 'Sem dados no SESP',
        source: pickupRegime[0]
          ? {
              form:
                pickupRegime[0]?.encounter?.form?.display ===
                'FORMULARIO ELECTRONICO DE LABORATORIO'
                  ? 'E-LAB'
                  : nextPickupDate[0]?.encounter?.form?.display ||
                    'Sem formulário',
              date: formatDate(pickupRegime[0]?.obsDatetime) || 'Sem data',
              location:
                pickupRegime[0]?.encounter['location.name'] || 'Sem localidade',
            }
          : { form: 'FILA', date: '', location: '' },
      },
      {
        title: 'Regime TARV no último levantamento',
        value: pickupRegime[0]?.value?.display || 'Sem dados no SESP',
        source: pickupRegime[0]
          ? {
              form:
                pickupRegime[0]?.encounter?.form?.display ===
                'FORMULARIO ELECTRONICO DE LABORATORIO'
                  ? 'E-LAB'
                  : pickupRegime[0]?.encounter?.form?.display ||
                    'Sem formulário',
              date: formatDate(pickupRegime[0]?.obsDatetime) || 'Sem data',
              location:
                pickupRegime[0]?.encounter['location.name'] || 'Sem localidade',
            }
          : { form: 'FILA', date: '', location: '' },
      },
      {
        title: 'Data mais recente do próximo levantamento',
        value: nextPickupDate[0]?.value
          ? formatDate(nextPickupDate[0]?.value)
          : 'Sem dados no SESP',
        source: nextPickupDate[0]
          ? {
              form:
                nextPickupDate[0]?.encounter?.form?.display ===
                'FORMULARIO ELECTRONICO DE LABORATORIO'
                  ? 'E-LAB'
                  : nextPickupDate[0]?.encounter?.form?.display ||
                    'Sem formulário',
              date: formatDate(nextPickupDate[0]?.obsDatetime) || 'Sem data',
              location:
                nextPickupDate[0]?.encounter['location.name'] ||
                'Sem localidade',
            }
          : { form: 'FILA', date: '', location: '' },
      },
      {
        title: 'Alternativo a Primeira Linha',
        isList: true,
        items:
          alternativeFirstRow.length > 0
            ? alternativeFirstRow.map((item) => ({
                value: item.value?.display || 'Sem dados no SESP',
                source: {
                  form:
                    item.encounter?.form?.display ===
                    'FORMULARIO ELECTRONICO DE LABORATORIO'
                      ? 'E-LAB'
                      : item.encounter?.form?.display || 'Sem formulário',
                  date: formatDate(item.obsDatetime) || 'Sem data',
                  location: item.encounter['location.name'] || 'Sem localidade',
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
        title: 'Mudança para Segunda Linha',
        isList: true,
        items:
          switchSecondRow.length > 0
            ? switchSecondRow.map((item) => ({
                value: item.value.display || 'Sem dados no SESP',
                source: {
                  form:
                    item.encounter?.form?.display ===
                    'FORMULARIO ELECTRONICO DE LABORATORIO'
                      ? 'E-LAB'
                      : item.encounter?.form?.display || 'Sem formulário',
                  date: formatDate(item.obsDatetime) || 'Sem data',
                  location: item.encounter['location.name'] || 'Sem localidade',
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
        title: 'Mudança para Terceira Linha',
        isList: true,
        items:
          switchThirdRow.length > 0
            ? switchThirdRow.map((item) => ({
                value: item.value.display || 'Sem dados no SESP',
                source: {
                  form:
                    item.encounter?.form?.display ===
                    'FORMULARIO ELECTRONICO DE LABORATORIO'
                      ? 'E-LAB'
                      : item.encounter?.form?.display || 'Sem formulário',
                  date: formatDate(item.obsDatetime) || 'Sem data',
                  location: item.encounter['location.name'] || 'Sem localidade',
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
    console.error('Error fetching Levantamento ARV data:', error);
  } finally {
    loading.value = false; // Stop loading spinner
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
.badge-container {
  margin-bottom: 5px; /* Adds spacing between badges */
}
</style>
