<template>
    <div  v-if="!haResultado && pageLocation=== 'pesquisa'" class="row q-pl-md">
      <div class="col-8">
        <q-input 
          v-model="searchQuery" 
          label="Pesquisar por Nome ou NID" 
          outlined 
          dense
          clearable
          :rules="[val => !!val || 'Digite um valor para pesquisar']"
        />
      </div>
      <div class="col-4">
        <q-btn 
          color="green" 
          label="Pesquisar" 
          @click="onSearch"
        />
      </div>
    </div>

    <!-- Resultado de pesquisa -->
    <div v-if="pageLocation === 'resultadoPesquisa' || pageLocation === 'paciente'">
      <SearchResult />
    </div>
</template>

<script setup>
import { inject, ref, onMounted } from 'vue';
import SearchResult from './SearchResult.vue';

const searchQuery = inject('searchQuery');
const pageLocation = inject('pageLocation');
const haResultado = ref(false);

// Função de pesquisa
function onSearch() {
  if (searchQuery.value.trim()) {
    // Adicionar um loading e fazer request
    // Supondo que foram encontrados os resultados 

    haResultado.value = true
    pageLocation.value = 'resultadoPesquisa'

    // Adicione a lógica para processar a pesquisa
  } else {
    console.error('Por favor, insira um nome ou NID para pesquisar');
  }
}

onMounted(() => {
  pageLocation.value = 'pesquisa'
})

</script>

<style scoped>

</style>
