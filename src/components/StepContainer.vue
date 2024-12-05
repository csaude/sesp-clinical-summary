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

        <q-stepper-navigation>
          <q-btn @click="() => { done1 = true; step = 2 }" color="primary" label="Continue"></q-btn>
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="2"
        title="Create an ad group"
        caption="Optional"
        icon="create_new_folder"
        :done="done2"
      >
        <!-- <ResultLaboratorio /> -->
      </q-step>

      <q-step
        :name="3"
        title="Create an ad"
        icon="add_comment"
        :done="done3"
      >
        <!-- <LevantamentoArv /> -->

      </q-step>

      <q-step
        :name="4"
        title="Create an ad"
        icon="add_comment"
        :done="done3"
      >
        <InicioTARV />

      </q-step>

      <q-step
        :name="5"
        title="Create an ad"
        icon="add_comment"
        :done="done3"
      >
        <!-- <ConsultaClinica /> -->

      </q-step>

      <q-step
        :name="6"
        title="Create an ad"
        icon="add_comment"
        :done="done3"
      >
        <!-- <ProfilaxiasComponent /> -->

      </q-step>

      <q-step
        :name="7"
        title="Create an ad"
        icon="add_comment"
        :done="done3"
      >
        <!-- <RastreioCACUM /> -->

      </q-step>

      <q-step
        :name="8"
        title="Create an ad"
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

const step = ref(1); // Inicializa no passo 1
const step1Input = ref('');
const step2Input = ref('');
const step1Description = "Digite informações para o passo 1";
const step2Description = "Digite mais informações no passo 2";
const step3Description = "Finalizar processo";

const finish = () => {
  alert("Processo Finalizado!");
}
</script>

<style scoped>
/* Ajustes de estilo se necessário */
</style>
