<template>
  <div class="q-pb-md">
    <!-- Header Section -->
    <header-component />

    <BodyComponent
      title="Resultados Laboratoriais"
      :loading="loading"
      :summaryData="resultadosData"
      @toggle-section="toggleSection"
    />
  </div>
</template>

<script setup>
import { inject, ref, onMounted } from 'vue';
import headerComponent from './headerComponent.vue';
import resultadosLaboratoriaisService from 'src/services/patient/resultadosLaboratoriaisService';
import BodyComponent from './bodyComponent.vue';

// Inject patient data
const patient = inject('selectedPatient');
const loading = ref(true); // Loading state

// Reactive data for Resultados Laboratoriais
const resultadosData = ref([]);

// Track collapsed states for each section
const collapsedSections = ref([]);

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

// Toggle collapse state for a section
function toggleSection(index) {
  collapsedSections.value[index] = !collapsedSections.value[index];
}

onMounted(async () => {
  if (!patient.value) {
    console.error('Patient data is missing.');
    loading.value = false;
    return;
  }

  try {
    const allCD4CoverageFLG =
      await resultadosLaboratoriaisService.allCD4CoverageFLG(
        patient.value.uuid
      );
    const allCD4CoverageFSR =
      await resultadosLaboratoriaisService.allCD4CoverageFSR(
        patient.value.uuid
      );
    const allCD4AbsFSR = await resultadosLaboratoriaisService.allCD4AbsFSR(
      patient.value.uuid
    );
    const allCD4AbsFLG = await resultadosLaboratoriaisService.allCD4AbsFLG(
      patient.value.uuid
    );
    const allGenexpert = await resultadosLaboratoriaisService.allGenexpert(
      patient.value.uuid
    );
    const allGenexpertFC = await resultadosLaboratoriaisService.allGenexpertFC(
      patient.value.uuid
    );
    const allBaciloscopia =
      await resultadosLaboratoriaisService.allBaciloscopia(patient.value.uuid);
    const allBaciloscopiaFC =
      await resultadosLaboratoriaisService.allBaciloscopiaFC(
        patient.value.uuid
      );
    const {
      rastreioTBLAMLabGeral,
      rastreioTBLAMELab,
      rastreioTBLAMFichaClinica,
    } = await resultadosLaboratoriaisService.allTBLAM(patient.value.uuid);
    const allHGB = await resultadosLaboratoriaisService.allHGB(
      patient.value.uuid
    );
    const allAST = await resultadosLaboratoriaisService.allAST(
      patient.value.uuid
    );
    const allALT = await resultadosLaboratoriaisService.allALT(
      patient.value.uuid
    );
    const allAMI = await resultadosLaboratoriaisService.allAMI(
      patient.value.uuid
    );
    const allGLC = await resultadosLaboratoriaisService.allGLC(
      patient.value.uuid
    );
    const allPCR = await resultadosLaboratoriaisService.allPCR(
      patient.value.uuid
    );

    const allVLs = await resultadosLaboratoriaisService.allVLs(
      patient.value.uuid
    );

    allVLs;

    // Populate resultadosData
    resultadosData.value = [
      {
        title: 'Carga Viral (Cópias/ml)',
        isList: true,
        items:
          allVLs.length > 0
            ? allVLs.map((item) => ({
                value: `${item.value?.display ? item.value?.display : item.value} ${
                  item.comment ? `${item.comment}` : ''
                }`,
                source: {
                  form:
                    item.encounter?.form?.display ===
                    'FORMULARIO ELECTRONICO DE LABORATORIO'
                      ? 'e-LAB'
                      : item.encounter?.form?.display || 'Sem dados no SESP',
                  date: formatDate(item.obsDatetime) || '',
                },
              }))
            : [
                {
                  value: 'Sem dados no SESP',
                  source: { form: 'LABORATORIO GERAL', date: '', location: '' },
                },
              ],
      },

      {
        title: 'CD4 Absoluto',
        isList: true,
        items:
          allCD4AbsFSR.length > 0 && allCD4AbsFLG.length > 0
            ? [
                ...allCD4AbsFLG.map((item) => ({
                  value: item.value || 'Sem dados no SESP',
                  source: {
                    form:
                      item.encounter?.form?.display ===
                      'FORMULARIO ELECTRONICO DE LABORATORIO'
                        ? 'e-LAB'
                        : item.encounter?.form?.display || 'LABORATORIO GERAL',
                    date: formatDate(item.obsDatetime) || '',
                  },
                })),
                ...allCD4AbsFSR.map((item) => ({
                  value: item.value || 'Sem dados no SESP',
                  source: {
                    form:
                      item.encounter?.form?.display ===
                      'FORMULARIO ELECTRONICO DE LABORATORIO'
                        ? 'e-LAB'
                        : item.encounter?.form?.display || 'E-LAB',
                    date: formatDate(item.obsDatetime) || '',
                  },
                })),
              ]
            : [
                {
                  value: 'Sem dados no SESP',
                  source: { form: 'LABORATORIO GERAL', date: '', location: '' },
                },
                {
                  value: 'Sem dados no SESP',
                  source: { form: 'e-Lab', date: '', location: '' },
                },
              ],
      },
      {
        title: 'CD4 Percentual',
        isList: true,
        items:
          allCD4CoverageFLG.length > 0 || allCD4CoverageFSR.length > 0
            ? [...allCD4CoverageFLG, ...allCD4CoverageFSR]
                .filter((item) => item.obsDatetime) // Garante que só ordenamos itens com data
                .map((item) => ({
                  ...item,
                  parsedDate: new Date(item.obsDatetime), // Converte a data para um objeto Date
                }))
                .sort((a, b) => b.parsedDate - a.parsedDate) // Ordena corretamente
                .map((item) => ({
                  value: item.value || 'Sem dados no SESP',
                  source: {
                    form:
                      item.encounter?.form?.display ===
                      'FORMULARIO ELECTRONICO DE LABORATORIO'
                        ? 'e-LAB'
                        : item.encounter?.form?.display ||
                          (allCD4CoverageFLG.includes(item)
                            ? 'LABORATORIO GERAL'
                            : 'e-LAB'),
                    date: formatDate(item.obsDatetime) || '',
                  },
                }))
            : [
                {
                  value: 'Sem dados no SESP',
                  source: { form: 'LABORATORIO GERAL', date: '', location: '' },
                },
                {
                  value: 'Sem dados no SESP',
                  source: { form: 'e-Lab', date: '', location: '' },
                },
              ],
      },
      {
        title: 'GeneXpert',
        isList: true,
        items:
          allGenexpert.length > 0 || allGenexpertFC.length > 0
            ? [
                ...allGenexpert.map((item) => ({
                  value: item.value?.display || 'Sem dados no SESP',
                  source: {
                    form:
                      item.encounter?.form?.display ===
                      'FORMULARIO ELECTRONICO DE LABORATORIO'
                        ? 'e-LAB'
                        : item.encounter?.form?.display || 'LABORATORIO GERAL',
                    date: formatDate(item.obsDatetime) || '',
                  },
                })),
                ...allGenexpertFC.map((item) => ({
                  value: item.value || 'Sem dados no SESP',
                  source: {
                    form: item?.encounter?.form?.display || 'FICHA CLINICA',
                    date: formatDate(item.obsDatetime) || '',
                  },
                })),
              ]
            : [
                {
                  value: 'Sem dados no SESP',
                  source: { form: 'LABORATORIO GERAL', date: '', location: '' },
                },
                {
                  value: 'Sem dados no SESP',
                  source: { form: 'FICHA CLINICA', date: '', location: '' },
                },
              ],
      },
      {
        title: 'Baciloscopia',
        isList: true,
        items:
          allBaciloscopia.length > 0 || allBaciloscopiaFC.length > 0
            ? [
                ...allBaciloscopia.map((item) => ({
                  value: item.value?.display || 'Sem dados no SESP',
                  source: {
                    form:
                      item.encounter?.form?.display ===
                      'FORMULARIO ELECTRONICO DE LABORATORIO'
                        ? 'e-LAB'
                        : item.encounter?.form?.display || 'LABORATORIO GERAL',
                    date: formatDate(item.obsDatetime) || '',
                  },
                })),
                ...allBaciloscopiaFC.map((item) => ({
                  value: item.value || 'Sem dados no SESP',
                  source: {
                    form: item?.encounter?.form?.display || 'FICHA CLINICA',
                    date: formatDate(item.obsDatetime) || '',
                  },
                })),
              ]
            : [
                {
                  value: 'Sem dados no SESP',
                  source: { form: 'LABORATORIO GERAL', date: '', location: '' },
                },
                {
                  value: 'Sem dados no SESP',
                  source: { form: 'FICHA CLINICA', date: '', location: '' },
                },
              ],
      },
      {
        title: 'TB LAM',
        isList: true,
        items:
          rastreioTBLAMLabGeral.length > 0 ||
          rastreioTBLAMELab.length > 0 ||
          rastreioTBLAMFichaClinica.length > 0
            ? [
                ...rastreioTBLAMLabGeral.map((item) => ({
                  value: item.value?.display || 'Sem dados no SESP',
                  comment:
                    'Nível de Positividade: ' + item.value?.comment || '',
                  source: {
                    form:
                      item.encounter?.form?.display ===
                      'FORMULARIO ELECTRONICO DE LABORATORIO'
                        ? 'e-LAB'
                        : item.encounter?.form?.display || 'LABORATORIO GERAL',
                    date: formatDate(item.obsDatetime) || '',
                  },
                })),
                ...rastreioTBLAMELab.map((item) => ({
                  value: item.value?.display || 'Sem dados no SESP',
                  comment: item.value?.comment || '',
                  source: {
                    form:
                      item.encounter?.form?.display ===
                      'FORMULARIO ELECTRONICO DE LABORATORIO'
                        ? 'e-LAB'
                        : item.encounter?.form?.display || 'e-LAB',
                    date: formatDate(item.obsDatetime) || '',
                  },
                })),
                ...rastreioTBLAMFichaClinica.map((item) => ({
                  value: item.value?.display || 'Sem dados no SESP',
                  comment: item.value?.comment || '',
                  source: {
                    form:
                      item.encounter?.form?.display ===
                      'FORMULARIO ELECTRONICO DE LABORATORIO'
                        ? 'E-LAB'
                        : item.encounter?.form?.display || 'FICHA CLINICA',
                    date: formatDate(item.obsDatetime) || '',
                  },
                })),
              ]
            : [
                {
                  value: 'Sem dados no SESP',
                  source: { form: 'LABORATORIO GERAL', date: '', location: '' },
                },
                {
                  value: 'Sem dados no SESP',
                  source: {
                    form: 'e-LAB',
                    date: '',
                    location: '',
                  },
                },
                {
                  value: 'Sem dados no SESP',
                  source: { form: 'FICHA CLINICA', date: '', location: '' },
                },
              ],
      },
      {
        title: 'Hemoglobina (HGB ou HB)',
        isList: true,
        items:
          allHGB.length > 0
            ? allHGB.map((item) => ({
                value: item.value || 'Sem dados no SESP',
                source: {
                  form:
                    item.encounter?.form?.display ===
                    'FORMULARIO ELECTRONICO DE LABORATORIO'
                      ? 'E-LAB'
                      : item.encounter?.form?.display || 'LABORATORIO GERAL',
                  date: formatDate(item.obsDatetime) || 'Sem data',
                },
              }))
            : [
                {
                  value: 'Sem dados no SESP',
                  source: { form: 'LABORATORIO GERAL', date: '', location: '' },
                },
              ],
      },
      {
        title: 'Aspartato Aminotransferase',
        isList: true,
        items:
          allAST.length > 0
            ? allAST.map((item) => ({
                value: item.value || 'Sem dados no SESP',
                source: {
                  form:
                    item.encounter?.form?.display ===
                    'FORMULARIO ELECTRONICO DE LABORATORIO'
                      ? 'E-LAB'
                      : item.encounter?.form?.display || 'LABORATORIO GERAL',
                  date: formatDate(item.obsDatetime) || 'Sem data',
                },
              }))
            : [
                {
                  value: 'Sem dados no SESP',
                  source: { form: 'LABORATORIO GERAL', date: '', location: '' },
                },
              ],
      },
      {
        title: 'Alanina Aminotransferase',
        isList: true,
        items:
          allALT.length > 0
            ? allALT.map((item) => ({
                value: item.value || 'Sem dados no SESP',
                source: {
                  form:
                    item.encounter?.form?.display ===
                    'FORMULARIO ELECTRONICO DE LABORATORIO'
                      ? 'E-LAB'
                      : item.encounter?.form?.display || 'LABORATORIO GERAL',
                  date: formatDate(item.obsDatetime) || 'Sem data',
                },
              }))
            : [
                {
                  value: 'Sem dados no SESP',
                  source: { form: 'LABORATORIO GERAL', date: '', location: '' },
                },
              ],
      },
      {
        title: 'Amilase (AMI)',
        isList: true,
        items:
          allAMI.length > 0
            ? allAMI.map((item) => ({
                value: item.value || 'Sem dados no SESP',
                source: {
                  form:
                    item.encounter?.form?.display ===
                    'FORMULARIO ELECTRONICO DE LABORATORIO'
                      ? 'E-LAB'
                      : item.encounter?.form?.display || 'LABORATORIO GERAL',
                  date: formatDate(item.obsDatetime) || 'Sem data',
                },
              }))
            : [
                {
                  value: 'Sem dados no SESP',
                  source: { form: 'LABORATORIO GERAL', date: '', location: '' },
                },
              ],
      },
      {
        title: 'Glucose (GLC)',
        isList: true,
        items:
          allGLC.length > 0
            ? allGLC.map((item) => ({
                value: item.value || 'Sem dados no SESP',
                source: {
                  form:
                    item.encounter?.form?.display ===
                    'FORMULARIO ELECTRONICO DE LABORATORIO'
                      ? 'E-LAB'
                      : item.encounter?.form?.display || 'LABORATORIO GERAL',
                  date: formatDate(item.obsDatetime) || 'Sem data',
                },
              }))
            : [
                {
                  value: 'Sem dados no SESP',
                  source: { form: 'LABORATORIO GERAL', date: '', location: '' },
                },
              ],
      },
      {
        title: 'PCR',
        isList: true,
        items:
          allPCR.length > 0
            ? allPCR.map((item) => ({
                value: item.value?.display || 'Sem dados no SESP',
                source: {
                  form:
                    item.encounter?.form?.display ===
                    'FORMULARIO ELECTRONICO DE LABORATORIO'
                      ? 'E-LAB'
                      : item.encounter?.form?.display || 'LABORATORIO GERAL',
                  date: formatDate(item.obsDatetime) || 'Sem data',
                },
              }))
            : [
                {
                  value: 'Sem dados no SESP',
                  source: { form: 'LABORATORIO GERAL', date: '', location: '' },
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
/* Ajuste para estilizar o cabeçalho com fundo cinza */
.bg-grey-3 {
  background-color: #e0e0e0;
}
.q-th {
  text-align: center;
}
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
