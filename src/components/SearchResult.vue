<template>
    <q-list v-if="!openStepper">
      <div v-for="person in people" :key="person.nid">
        <q-item>
          <q-item-section @click="onCardClick(person.nid)">
            <div class="row">
              <!-- Ícone de Gênero -->
              <div class="col-2 text-center">
                <q-icon
                  :name="person.gender === 'male' ? 'male' : 'female'"
                  :color="person.gender === 'male' ? 'blue' : 'red'"
                  size="lg"
                />
        
              </div>
  
              <!-- Informações Pessoais -->
              <div class="col-7 text-left">
                <div><strong>{{ person.name }}</strong></div>
                <div><strong>{{ person.nid }}</strong></div>
                <div>{{ person.healthUnit }}</div>
              </div>
  
              <q-space />
  
              <!-- Idade -->
              <div class="col-3 text-right">
                <div>{{ person.age }} anos</div>
              </div>
            </div>
          </q-item-section>
        </q-item>   
        <q-separator class="q-mx-md"></q-separator>
      </div>     
    </q-list>
  
    <StepContainer v-if="openStepper" />
  </template>
  
  
  <script setup>
  import { ref, onMounted, inject} from 'vue';
  import StepContainer from './StepContainer.vue';

  const openStepper = ref(false)
  const pageLocation = inject('pageLocation');
  
  // Dados fictícios
  const people = ref([
  { name: 'João Silva', nid: '12345', healthUnit: 'Unidade Sanitaria A', age: 34, gender: 'male' },
  { name: 'Maria Santos', nid: '67890', healthUnit: 'Unidade Sanitaria B', age: 28, gender: 'female' },
  { name: 'Carlos Almeida', nid: '11223', healthUnit: 'Unidade Sanitaria C', age: 41, gender: 'male' },
  { name: 'Ana Costa', nid: '44556', healthUnit: 'Unidade Sanitaria D', age: 22, gender: 'female' },
  { name: 'Pedro Oliveira', nid: '77889', healthUnit: 'Unidade Sanitaria E', age: 30, gender: 'male' },
]);
  

  function onCardClick(nid) {
    console.log(`Card clicado! NID: ${nid}`);
    openStepper.value = true
    pageLocation.value = 'paciente'
  }

    onMounted(() => {
        pageLocation.value = 'resultadoPesquisa'
        console.log(openStepper.value)
    })
  </script>
  
  <style scoped>
  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  </style>
  