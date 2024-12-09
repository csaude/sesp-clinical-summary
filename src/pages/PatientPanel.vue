<template>
    <div>
        <PatientDemographic/>

    </div>
</template>
<script setup>
    import PatientDemographic from 'src/components/patentPanel/PatientDemographic.vue';
    import { ref, provide, onMounted } from 'vue';

    const selectedPatient = ref(null);

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
</script>