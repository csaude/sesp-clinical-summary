<template>
  <div class="q-pb-md">
    <!-- Header Section -->
    <header-component />

    <!-- Loading Spinner -->
    <div v-if="loading" class="row justify-center q-my-lg">
      <q-spinner-dots color="blue" size="3em" />
    </div>

    <!-- Cards for Levantamento Data -->
    <div v-else>
      <div v-for="(section, index) in levantamentoData" :key="index" class="q-mb-md">
        <q-card flat bordered>
          <!-- Section Header -->
          <q-card-section class="q-py-sm bg-light-green-1">
            <div class="row items-center">
              <div class="col text-weight-bold text-h6">{{ section.title }}</div>
              <div class="col-auto text-caption text-right text-grey">Fonte</div>
            </div>
          </q-card-section>
          <q-separator />

          <!-- Section Content -->
          <q-card-section>
            <div class="row items-center">
              <div class="col text-caption">
                {{ section.value || 'Sem dados no SESP' }}
              </div>
              <div class="col-auto text-caption text-right">
                {{ section.source || '' }}
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, ref, onMounted } from 'vue';
import headerComponent from './headerComponent.vue';
import levantamentoARVService from 'src/services/patient/levantamentoARVService';

// Inject patient data
const patient = inject('selectedPatient');

// Reactive data for Levantamento ARV
const levantamentoData = ref([]);
const loading = ref(true); // Loading state

// Helper function to format date to dd-mm-yyyy
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
    loading.value = false; // Stop loading even if patient data is missing
    return;
  }

  try {
    const patientId = patient.value.uuid;

    const [nextPickupDate, pickupRegime, alternativeFirstRow, switchSecondRow, switchThirdRow] =
      await Promise.all([
        levantamentoARVService.getNextARTPickupDate(patientId),
        levantamentoARVService.getARTPickupRegime(patientId),
        levantamentoARVService.getAlternativeFirstRow(patientId),
        levantamentoARVService.getSwitchSecondRow(patientId),
        levantamentoARVService.getSwitchThirdRow(patientId),
      ]);

    // Populate levantamentoData with fetched and formatted values
    levantamentoData.value = [
      {
        title: 'Data do último levantamento de ARV',
        value: formatDate(pickupRegime[0]?.obsDatetime) || null,
        source: pickupRegime[0]?.encounter?.location?.form?.display || 'FILA CS Macuse',
      },
      {
        title: 'Regime TARV no último levantamento',
        value: pickupRegime[0]?.value?.display || null,
        source: pickupRegime[0]?.encounter?.location?.form?.display || 'FILA CS Macuse',
      },
      {
        title: 'Data mais recente do próximo levantamento',
        value: formatDate(nextPickupDate[0]?.value) || null,
        source: nextPickupDate[0]?.encounter?.location?.form?.display || 'FILA CS Macuse',
      },
      {
        title: 'Alternativo a Primeira Linha',
        value: alternativeFirstRow[0]?.value || 'Sem dados no SESP',
        source: 'FICHA RESUMO',
      },
      {
        title: 'Mudança para Segunda Linha',
        value: switchSecondRow[0]?.value || 'Sem dados no SESP',
        source: 'FICHA RESUMO',
      },
      {
        title: 'Mudança para Terceira Linha',
        value: switchThirdRow[0]?.value || 'Sem dados no SESP',
        source: 'FICHA RESUMO',
      },
    ];
  } catch (error) {
    console.error('Error fetching Levantamento ARV data:', error);
  } finally {
    loading.value = false; // Stop loading
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
