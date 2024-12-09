<template>
  <div>
    <strong>Dados Demográficos</strong>

    <!-- 1. Tabela de Data de Nascimento -->
    <q-table
      :rows="[dataNascimentoRow]"
      :columns="dataNascimentoColumns"
      class="q-mb-md"
      dense
      flat
      bordered
      hide-bottom
    >
      <template v-slot:header>
        <q-tr class="bg-grey-3 text-center">
          <q-th>Data de Nascimento</q-th>
        </q-tr>
      </template>
    </q-table>

    <!-- 2. Tabela de Endereços -->
    <q-table
      :rows="enderecosRows"
      :columns="enderecosColumns"
      class="q-mb-md"
      dense
      flat
      bordered
      hide-bottom
    >
      <template v-slot:header>
        <q-tr class="bg-grey-3 text-center">
          <q-th colspan="2">Endereço</q-th>
        </q-tr>
      </template>
    </q-table>

    <!-- 3. Tabela de Contactos -->
    <q-table
      :rows="[contactosRow]"
      :columns="contactosColumns"
      class="q-mb-md"
      dense
      flat
      bordered
      hide-bottom
    >
      <template v-slot:header>
        <q-tr class="bg-grey-3 text-center">
          <q-th>Contactos</q-th>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 1. Dados da Tabela de Data de Nascimento
const dataNascimentoColumns = [
  { name: "data", label: "Data de Nascimento", align: "center", field: "data" },
];
const dataNascimentoRow = { data: new Date().toLocaleDateString("pt-PT") };

// 2. Dados da Tabela de Endereços
const enderecosColumns = [
  { name: "campo", align: "center", field: "campo" },
  { name: "valor", align: "center", field: "valor" },
];
const enderecosRows = [
  { campo: "Localidade", valor: "Maputo" },
  { campo: "Bairro", valor: "Sommerschield" },
  { campo: "Célula/Bloco", valor: "Bloco 2" },
  { campo: "Avenida/Rua", valor: "Av. 25 de Setembro" },
];

// 3. Dados da Tabela de Contactos
const contactosColumns = [
  { name: "contacto", label: "Contactos", align: "center", field: "contacto" },
];
const contactosRow = { contacto: "Sem Dados no SESP" };
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
