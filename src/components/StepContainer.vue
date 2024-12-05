<template>
  <div class="q-mx-xs">
  <q-stepper
      v-model="step"
      header-nav
      ref="stepper"
      color="primary"
      animated
               vertical
    >
      <q-step
        :name="1"
        title="Dados Demograficos"
        icon="person"
      >
        <!-- <DemograficosComponent /> -->
      </q-step>

      <q-step
        :name="2"
        title="Resultados Laboratoriais"
        icon="create_new_folder"
        :done="done2"
      >
        <!-- <ResultLaboratorio /> -->
      </q-step>

      <q-step
        :name="3"
        title="Data de Levantamento de ARV"
        icon="add_comment"
        :done="done3"
      >
        <!-- <LevantamentoArv /> -->

      </q-step>

      <q-step
        :name="4"
        title="Data de Inicio TARV"
        icon="add_comment"
        :done="done3"
      >
        <InicioTARV />

      </q-step>

      <q-step
        :name="5"
        title="Consulta Clinica"
        icon="add_comment"
        :done="done3"
      >
        <!-- <ConsultaClinica /> -->

      </q-step>

      <q-step
        :name="6"
        title="Profilaxias"
        icon="add_comment"
        :done="done3"
      >
        <!-- <ProfilaxiasComponent /> -->

      </q-step>

      <q-step
        :name="7"
        title="Rastreio CACUM"
        icon="add_comment"
        :done="done3"
      >
        <!-- <RastreioCACUM /> -->

      </q-step>

      <q-step
        :name="8"
        title="Confidente"
        icon="add_comment"
        :done="done3"
      >
        <!-- <ConfidenteComponent /> -->

      </q-step>
    </q-stepper>
  </div>
</template>

<script setup>
import { ref } from 'vue';
// import DemograficosComponent from './steps/DemograficosComponent.vue';
// import ResultLaboratorio from './steps/ResultLaboratorio.vue';
// import LevantamentoArv from './steps/LevantamentoArv.vue';
// import InicioTARV from './steps/InicioTARV.vue';
// import ConsultaClinica from './steps/ConsultaClinica.vue';
// import ProfilaxiasComponent from './steps/ProfilaxiasComponent.vue';
// import RastreioCACUM from './steps/RastreioCACUM.vue';
// import ConfidenteComponent from './steps/ConfidenteComponent.vue';

const step = ref(1)

</script>

<style scoped>
/* Ajustes de estilo se necessário */
</style>
