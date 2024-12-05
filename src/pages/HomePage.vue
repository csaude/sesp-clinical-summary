<template>
  <div>

    <div v-if="pageLocation === 'inicio' || pageLocation === 'pesquisa'" id="div_header" class="q-mt-md text-center">
      <q-icon name="person" size="3em" />
      <br />
      <p>Bem Vindo,<br>JMabjaia</p>
    </div>

    
    <div class="q-my-sm" v-else-if="pageLocation === 'resultadoPesquisa'">
      <small>Resultado de pesquisa por: "<strong>{{ searchQuery }}</strong>""</small>
    </div>

    <div v-else id="div_header" class="q-mt-md">
      <p v-html="header"></p>
    </div>

    <!-- INICIO -->
    <div v-if="pageLocation === 'inicio'" class="q-pa-md example-row-equal-width">
      <div class="row">
        <div class="col q-mr-md q-mb-md">
          <q-btn class="fit" color="red-6" icon="assignment" stack @click="handleSumarioClinicoClick()">
            <div class="text-center text-caption">
              Sumário<br>Clínico
            </div>
          </q-btn>
        </div>
        <div class="col q-mb-md">
          <q-btn class="fit" color="blue-6" icon="exit_to_app" stack @click="handleClick">
            <div class="text-center text-caption">
              Terminar<br>Sessão
            </div>
          </q-btn>
        </div>
      </div>

      <div class="row">
        <div class="col q-mr-md">
          <q-btn class="fit" color="green-6" icon="bar_chart" stack @click="handleClick">
            <div class="text-center text-caption">
              Relatório<br>de Uso
            </div>
          </q-btn>
        </div>
        <div class="col">
          <!-- <q-btn class="fit" color="orange-6" icon="help_outline" stack @click="handleClick">
            <div class="text-center text-caption">
              Ajuda<br>e Suporte
            </div>
          </q-btn> -->
        </div>
      </div>
    </div>

    <!-- SUMARIO -->
  <div> 
      <SearchComponent />
  </div>

  

    <!-- RELATORIO -->
  <div v-if="pageLocation === 'relatorio'">

  </div>
  </div>
</template>

<script setup>
import { ref, onMounted, provide } from 'vue';
import { useIdentificacaoUtente } from 'src/composables/shared/patient/identificacao';
import SearchComponent from 'src/components/SearchComponent.vue';

const description = ref('Este é o componente home');

const { nomeCompleto, nid, idade, us } = useIdentificacaoUtente();

// const header = `${nomeCompleto}<br>${nid}<br>${idade}<br>${us}`;
const header = `${nomeCompleto}<br>${nid}<br>${idade}<br>${us}`;
const pageLocation = ref('inicio')
const searchQuery = ref('');

const handleClick = () => {
  alert('Você clicou no botão!');
};

const handleSumarioClinicoClick = () => {
  pageLocation.value = 'pesquisa'
}

onMounted(() => {
  pageLocation.value = 'inicio'
})

provide('pageLocation', pageLocation)
provide('searchQuery', searchQuery)

</script>

<style scoped>
/* Ajustando layout */
div {
  text-align: center;
}
.custom-label {
  font-size: 12px; /* Ajuste conforme necessário */
}
</style>
