<template>
  <div>
    <strong>Levantamento de ARV</strong>

    <q-table
      :rows="resultadosRows"
      :columns="resultadosColumns"
      class="q-mb-md"
      dense
      flat
      bordered
      hide-bottom
    >
      <template v-slot:header>
        <q-tr class="bg-grey-3 text-center">
          <q-th>Data do Ultimo Levantamento de ARV</q-th>
          <q-th>Fonte</q-th>
        </q-tr>
      </template>
    </q-table>

    <small>Outras tabelas por loop</small>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Dados da Tabela de Resultados Laboratoriais
const resultadosColumns = [
  { name: "cargaViral", label: "Carga Viral (Cópias/ml)", align: "center", field: "cargaViral" },
  { name: "fonte", label: "Fonte", align: "center", field: "fonte" },
];

const resultadosRows = [
  { cargaViral: "10-11-2024", fonte: "Teste A" },
];
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
