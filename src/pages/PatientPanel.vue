<template>
    <q-layout view="lHh Lpr lFf">
      <!-- Header -->
      <q-header elevated>
        <q-toolbar>
          <q-btn flat round dense icon="arrow_back" @click="goBack" />
          <q-toolbar-title>Sumário do Paciente</q-toolbar-title>
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
            <!-- Slide 1: Patient Demographics -->
            <q-carousel-slide name="demographic">
              <PatientDemographic />
            </q-carousel-slide>
  
            <!-- Slide 2: Lab Results -->
            <q-carousel-slide name="lab-results">
              <ResultLaboratorio />
            </q-carousel-slide>
  
            <!-- Slide 3: Levantamento ARV -->
            <q-carousel-slide name="levantamento-arv">
              <LevantamentoArv />
            </q-carousel-slide>
  
            <!-- Slide 4: Inicio TARV -->
            <q-carousel-slide name="inicio-tarv">
              <InicioTARV />
            </q-carousel-slide>
  
            <!-- Slide 5: Consulta Clinica -->
            <q-carousel-slide name="consulta-clinica">
              <ConsultaClinica />
            </q-carousel-slide>
  
            <!-- Slide 6: Profilaxias -->
            <q-carousel-slide name="profilaxias">
              <ProfilaxiasComponent />
            </q-carousel-slide>
  
            <!-- Slide 7: Rastreio CACUM -->
            <q-carousel-slide name="rastreio-cacum">
              <RastreioCACUM />
            </q-carousel-slide>
  
            <!-- Slide 8: Confidente -->
            <q-carousel-slide name="confidente">
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
  
  // Retrieve the selected patient from sessionStorage
  onMounted(() => {
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
    router.back();
  }
  </script>
  
  <style scoped>
  .patient-slider {
    height: calc(100vh - 50px); /* Adjust height based on layout */
  }
  </style>
  