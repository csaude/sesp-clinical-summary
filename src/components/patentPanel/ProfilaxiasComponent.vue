<template>
  <div class="q-pb-md">
    <!-- Header Section -->
    <header-component />

    <!-- Title -->
    <div class="q-mt-md q-mb-md text-center text-h6 text-primary">
      Profilaxias
    </div>

    <!-- Loading Indicator -->
    <div v-if="loading" class="q-my-md text-center">
      <q-spinner-dots color="blue" size="40px" />
    </div>

    
    <div v-else>
      <!-- Cards for TPT/TPI -->
      <div v-for="(section, index) in profilaxiaData" :key="index" class="q-mb-md">
        <q-card flat bordered>
          <!-- Section Header -->
          <q-card-section class="q-py-sm bg-light-green-1">
            <div class="row items-center">
              <div class="col text-weight-bold text-h6">{{ section.title }}</div>
              <div class="col text-weight-bold text-h6">Profilaxia</div>
              <div class="col-auto text-caption text-right text-grey">Fonte</div>
            </div>
          </q-card-section>
          <q-separator />

          <!-- Section Content -->
          <q-card-section>
            <template v-if="section.isList">
              <div v-for="(item, idx) in section.items" :key="idx" class="q-mb-sm">
                <div class="row items-center">
                  <!-- Coluna de Data de Início de TPT -->
                  <div class="col-4 text-caption">{{ item.startDate || 'Sem dados no SESP' }}</div>

                  <!-- Coluna de Profilaxia -->
                  <div class="col-4 text-caption">{{ item.value }}</div>

                  <!-- Coluna de Fonte -->
                  <div class="col-4 text-caption text-right">
                    <div class="badge-container q-mr-sm">
                      <q-badge color="blue">{{ item.source.form }}</q-badge>
                    </div>
                    <div v-if="item.source.date" class="badge-container">
                      <q-badge color="green">{{ item.source.date }}</q-badge>
                    </div>
                    <div v-if="item.source.location" class="badge-container">
                      <q-badge color="yellow">{{ item.source.location }}</q-badge>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="row items-center">
                <!-- Coluna de Data de Início de TPT -->
                <div class="col-4 text-caption">{{ section.startDate || 'Sem dados no SESP' }}</div>

                <!-- Coluna de Profilaxia -->
                <div class="col-4 text-caption">{{ section.value || 'Sem dados no SESP' }}</div>

                <!-- Coluna de Fonte -->
                <div class="col-4 text-caption text-right">
                  <div class="badge-container">
                    <q-badge color="blue">{{ section.source.form }}</q-badge>
                  </div>
                  <div v-if="section.source.date" class="badge-container">
                    <q-badge color="green">{{ section.source.date }}</q-badge>
                  </div>
                  <div v-if="section.source.location" class="badge-container">
                    <q-badge color="grey">{{ section.source.location }}</q-badge>
                  </div>
                </div>
              </div>
            </template>
          </q-card-section>
        </q-card>
      </div>

      <!-- Cards for anything else-->
      <div v-for="(section, index) in resultadosData" :key="index" class="q-mb-md">
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
            <template v-if="section.isList">
              <div v-for="(item, idx) in section.items" :key="idx" class="q-mb-sm">
                <div class="row items-center">
                  <div class="col text-caption">{{ item.value }}</div>
                  <div class="col-auto text-caption text-right">
                    <div class="badge-container q-mr-sm">
                      <q-badge color="blue">{{ item.source.form }}</q-badge>
                    </div>
                    <div v-if="item.source.date" class="badge-container">
                      <q-badge color="green">{{ item.source.date }}</q-badge>
                    </div>
                  </div>
                </div>

              </div>
            </template>
            <template v-else>
              <div class="row items-center">
                <div class="col text-caption">{{ section.value || 'Sem dados no SESP' }}</div>
                <div class="col-auto text-caption text-right">
                  <div class="badge-container">
                    <q-badge color="blue">{{ section.source.form }}</q-badge>
                  </div>
                  <div v-if="section.source.date" class="badge-container">
                    <q-badge color="green">{{ section.source.date }}</q-badge>
                  </div>
                  <div v-if="section.source.location" class="badge-container">
                    <q-badge color="grey">{{ section.source.location }}</q-badge>
                  </div>
                </div>

              </div>
            </template>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { inject, ref, onMounted } from 'vue';
  import headerComponent from './headerComponent.vue';
  import profilaxiasService from 'src/services/patient/profilaxiasService';

  // Inject patient data
  const patient = inject('selectedPatient');

  // Reactive data for Resultados Laboratoriais
  const profilaxiaData = ref([]);
  const resultadosData = ref([]);
  const loading = ref(true); // Loading state

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

  onMounted(async () => {
  if (!patient.value) {
    console.error('Patient data is missing.');
    loading.value = false;
    return;
  }

  try {
  
    const allIPTStart = await profilaxiasService.allIPTStart(patient.value.uuid)
    const allIPTEnd = await profilaxiasService.allIPTEnd(patient.value.uuid)
    const CTZStartFichaClinica = await profilaxiasService.CTZStartFichaClinica(patient.value.uuid)
    const IPTEndFichaFILT = await profilaxiasService.IPTEndFichaFILT(patient.value.uuid)
    
    console.log('IPTEndFichaFILT: ', JSON.stringify(IPTEndFichaFILT, null, 2));

    // Populate profilaxiaData
    profilaxiaData.value = [
    {
      title: 'Data de início de TPT',
      isList: true,
      items: 
        (allIPTStart.length > 0)
        ? [
            ...allIPTStart.map((item) => ({
              value: item.value || 'Sem dados no SESP',
              source: {
                startDate: formatDate(item.obsDatetime) || '',
                profilaxia: item.profilaxia || 'Sem dados no SESP',
                form: item?.encounter?.form?.display || 'FICHA RESUMO',
                location: item?.encounter?.['location.name'] || '',
              },
            }))
          ]
        : [
            {
              value: 'Sem dados no SESP',
              source: {
                startDate: '',
                profilaxia: 'Sem dados no SESP',
                form: 'FICHA RESUMO',
                location: '',
              },
            },
            {
              value: 'Sem dados no SESP',
              source: {
                startDate: '',
                profilaxia: 'Sem dados no SESP',
                form: 'FICHA CLINICA',
                location: '',
              },
            },
            {
              value: 'Sem dados no SESP',
              source: {
                startDate: '',
                profilaxia: 'Sem dados no SESP',
                form: 'FICHA DE SEGUIMENTO',
                location: '',
              },
            }
          ],
    },
    {
      title: 'Data do fim de TPI',
      isList: true,
      items: 
        (allIPTEnd.length > 0)
        ? [
            ...allIPTEnd.map((item) => ({
              value: item.value || 'Sem dados no SESP',
              source: {
                startDate: formatDate(item.obsDatetime) || '',
                profilaxia: item.profilaxia || 'Sem dados no SESP',
                form: item?.encounter?.form?.display || 'FICHA RESUMO',
                location: item?.encounter?.['location.name'] || '',
              },
            }))
          ]
        : [
            {
              value: 'Sem dados no SESP',
              source: {
                startDate: '',
                profilaxia: 'Sem dados no SESP',
                form: 'FICHA RESUMO',
                location: '',
              },
            },
            {
              value: 'Sem dados no SESP',
              source: {
                startDate: '',
                profilaxia: 'Sem dados no SESP',
                form: 'FICHA CLINICA',
                location: '',
              },
            },
            {
              value: 'Sem dados no SESP',
              source: {
                startDate: '',
                profilaxia: 'Sem dados no SESP',
                form: 'FICHA DE SEGUIMENTO',
                location: '',
              },
            }
          ],
    }
    ];

    // Populate resultadosData
    resultadosData.value = [
      {
        title: 'Data do último levantamento INH',
        value: IPTEndFichaFILT[0]?.obsDatetime
          ? formatDate(IPTEndFichaFILT[0]?.obsDatetime)
          : 'Sem dados no SESP',
        source: IPTEndFichaFILT[0]
          ? {
              form: IPTEndFichaFILT[0]?.encounter?.form?.display || 'Sem formulário',
              date: formatDate(IPTEndFichaFILT[0]?.obsDatetime) || 'Sem dados no SESP',
            }
          : { form: 'FILT', date: '', location: '' },
      },
      {
        title: 'Tipo do último levantamento INH',
        value: IPTEndFichaFILT[0]?.value?.display
          ? IPTEndFichaFILT[0]?.value?.display
          : 'Sem dados no SESP',
        source: IPTEndFichaFILT[0]
          ? {
              form: IPTEndFichaFILT[0]?.encounter?.form?.display || 'Sem formulário',
              date: formatDate(IPTEndFichaFILT[0]?.obsDatetime) || 'Sem dados no SESP',
            }
          : { form: 'FILT', date: '', location: '' },
      },
      // {
      //   title: 'Data de início de CTZ',
      //   isList: true,
      //   items: CTZStartFichaClinica.length > 0
      //     ? CTZStartFichaClinica.map((item) => ({
      //         value: item?.value,
      //         source: {
      //           form: item.encounter?.form?.display || 'Sem formulário',
      //           date: formatDate(item.obsDatetime) || 'Sem dados no SESP',
      //         },
      //       }))
      //     : [{ 
      //         value: 'Sem dados no SESP', 
      //         source: { form: 'FICHA CLINICA', date: '', location: '' } 
      //       }],
      // },
      // {
      //   title: 'Data do Fim de CTZ',
      //   isList: true,
      //   items: IPTEndFichaFILT.length > 0
      //     ? IPTEndFichaFILT.map((item) => ({
      //         value: item?.value,
      //         source: {
      //           form: item.encounter?.form?.display || 'Sem formulário',
      //           date: formatDate(item.obsDatetime) || 'Sem dados no SESP',
      //         },
      //       }))
      //     : [{ 
      //         value: 'Sem dados no SESP', 
      //         source: { form: 'FICHA CLINICA', date: '', location: '' } 
      //       }],
      // },
    ]
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
</style>