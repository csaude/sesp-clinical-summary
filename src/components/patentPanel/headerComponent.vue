<template>
  <q-card flat bordered class="q-mb-md q-pa-md">
    <div class="col-12 text-center q-mb-sm">
      <q-icon :name="genderIcon" :color="genderColor" size="lg" />
    </div>
    <div class="row">
      <!-- Patient Name -->
      <div class="col-12 justify-center text-weight-bold text-center">
        <span size="lg">{{
          patient?.display?.split(' - ')[1] || 'Sem Nome'
        }}</span>
      </div>
      <!-- Patient Details -->
      <div class="col-12 row justify-center text-center text-caption">
        <div class="col-auto">
          {{ patient?.identifiers?.[0]?.identifier || 'Sem NID' }}
        </div>
        <div class="col-auto">&nbsp;&nbsp;| &nbsp;&nbsp;</div>
        <div class="col-auto">
          {{ patient?.person?.age || 'Sem idade' }} anos
        </div>
        <div class="col-auto">&nbsp;&nbsp; | &nbsp;</div>
        <div class="col-auto">
          {{ patient?.identifiers?.[0]?.location?.name || 'Sem Localidade' }}
        </div>
      </div>
    </div>
  </q-card>
</template>
<script setup>
import { computed, inject } from 'vue';

const patient = inject('selectedPatient');

const genderIcon = computed(() =>
  patient?.value?.person?.gender === 'M' ? 'male' : 'female'
);
const genderColor = computed(() =>
  patient?.value?.person?.gender === 'M' ? 'blue' : 'pink'
);
</script>
<style scoped>
.q-card {
  border: 1px solid #e0e0e0;
}
.text-lg {
  font-size: 1.2em;
}
</style>
