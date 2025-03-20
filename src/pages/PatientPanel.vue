<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header elevated>
      <q-toolbar>
        <q-btn flat round dense icon="arrow_back" @click="goBack" />
        <q-toolbar-title>Sumário do Utente</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- Page Container -->
    <q-page-container>
      <q-page class="q-pa-none">
        <!-- Carousel -->
        <q-carousel
          v-model="activeSlide"
          animated
          swipeable
          navigation
          control-color="primary"
          class="patient-slider"
        >
          <!-- Slide 1: Demographics (Visible to all roles) -->
          <q-carousel-slide name="demographic">
            <PatientDemographic />
          </q-carousel-slide>

          <!-- Slide 2: Lab Results -->
          <q-carousel-slide v-if="hasRole(['bd53e025-4bea-441d-ab63-c5f65657bf71', 'e2f0acbc-1d5f-11e0-b929-000c29ad1d07', 'e2f0b43c-1d5f-11e0-b929-000c29ad1d07', 'e2f0b55e-1d5f-11e0-b929-000c29ad1d07'])" name="lab-results">
            <ResultLaboratorio />
          </q-carousel-slide>

          <!-- Slide 3: Levantamento ARV -->
          <q-carousel-slide v-if="hasRole(['bd53e025-4bea-441d-ab63-c5f65657bf71', 'e2f0acbc-1d5f-11e0-b929-000c29ad1d07', 'e2f0b43c-1d5f-11e0-b929-000c29ad1d07', '481db7f3-601e-4dd9-be59-3f24bc080134', 'e2f0b55e-1d5f-11e0-b929-000c29ad1d07'])" name="levantamento-arv">
            <LevantamentoArv />
          </q-carousel-slide>

          <!-- Slide 4: Inicio TARV -->
          <q-carousel-slide v-if="hasRole(['bd53e025-4bea-441d-ab63-c5f65657bf71', 'e2f0acbc-1d5f-11e0-b929-000c29ad1d07', 'e2f0b43c-1d5f-11e0-b929-000c29ad1d07', '481db7f3-601e-4dd9-be59-3f24bc080134', 'e2f0b55e-1d5f-11e0-b929-000c29ad1d07'])" name="inicio-tarv">
            <InicioTARV />
          </q-carousel-slide>

          <!-- Slide 5: Consulta Clinica -->
          <q-carousel-slide v-if="hasRole(['bd53e025-4bea-441d-ab63-c5f65657bf71', 'e2f0acbc-1d5f-11e0-b929-000c29ad1d07', 'e2f0b43c-1d5f-11e0-b929-000c29ad1d07'])" name="consulta-clinica">
            <ConsultaClinica />
          </q-carousel-slide>

          <!-- Slide 6: Profilaxias -->
          <q-carousel-slide v-if="hasRole(['bd53e025-4bea-441d-ab63-c5f65657bf71', 'e2f0acbc-1d5f-11e0-b929-000c29ad1d07', 'e2f0b43c-1d5f-11e0-b929-000c29ad1d07'])" name="profilaxias">
            <ProfilaxiasComponent />
          </q-carousel-slide>

          <!-- Slide 7: Rastreio CACUM -->
          <q-carousel-slide v-if="hasRole(['bd53e025-4bea-441d-ab63-c5f65657bf71', 'e2f0acbc-1d5f-11e0-b929-000c29ad1d07', 'e2f0b43c-1d5f-11e0-b929-000c29ad1d07'])" name="rastreio-cacum">
            <RastreioCACUM />
          </q-carousel-slide>

          <!-- Slide 8: Confidente -->
          <q-carousel-slide v-if="hasRole(['bd53e025-4bea-441d-ab63-c5f65657bf71', 'e2f0acbc-1d5f-11e0-b929-000c29ad1d07', 'e2f0b43c-1d5f-11e0-b929-000c29ad1d07'])" name="confidente">
            <ConfidenteComponent />
          </q-carousel-slide>
        </q-carousel>
      </q-page>
    </q-page-container>
  </q-layout>
</template>


  
<script setup>
  import { ref, provide, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  
  // Import child components
  import PatientDemographic from 'src/components/patentPanel/PatientDemographic.vue';
  import ResultLaboratorio from 'src/components/patentPanel/ResultLaboratorio.vue';
  import LevantamentoArv from 'src/components/patentPanel/LevantamentoArv.vue';
  import InicioTARV from 'src/components/patentPanel/InicioTARV.vue';
  import ConsultaClinica from 'src/components/patentPanel/ConsultaClinica.vue';
  import ProfilaxiasComponent from 'src/components/patentPanel/ProfilaxiasComponent.vue';
  import RastreioCACUM from 'src/components/patentPanel/RastreioCACUM.vue';
  import ConfidenteComponent from 'src/components/patentPanel/ConfidenteComponent.vue';
  
  // Reactive variables
  const selectedPatient = ref(null);
  const activeSlide = ref('demographic'); // Default to the first slide
  const router = useRouter();
  const roles = ref([]);
  
  // Retrieve the selected patient from sessionStorage
  onMounted(() => {
    const sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      router.push('/login');
    }
    
    const rolesData = sessionStorage.getItem('roles');
    try {
      roles.value = rolesData ? JSON.parse(rolesData) : [];
    } catch (error) {
      console.error('Erro ao carregar perfis:', error);
      roles.value = [];
    }
    const patientData = sessionStorage.getItem('selectedPatient');
    if (patientData) {
      selectedPatient.value = JSON.parse(patientData);
    } else {
      console.error('No patient data found in sessionStorage.');
    }
  });
  
  // Provide the `selectedPatient` to child components
  provide('selectedPatient', selectedPatient);
  
  // Navigation
  function goBack() {
    router.push({ path: '/home', query: { component: 'SearchComponent' } });
  }


  // Utility function to check roles by UUID
  function hasRole(requiredUUIDs) {
    return roles.value.some(role => requiredUUIDs.includes(role.uuid));
  }
</script>
  
  <style scoped>
  .patient-slider {
    height: calc(100vh - 50px); /* Adjust height based on layout */
  }
  </style>
  