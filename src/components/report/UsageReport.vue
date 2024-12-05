<template>
    <div>
      <div class="q-pa-none q-gutter-sm q-mb-md">
        <q-banner inline-actions class="bg-light-green-10 text-white">
          Relatório de Uso do Aplicativo
          <template v-slot:action>
            <q-btn
              :loading="uploading"
              :percentage="percentage"
              round
              flat
              color="white"
              @click="uploadUsageReports"
              icon="cloud_upload"
            />
          </template>
        </q-banner>
      </div>
      <div class="row q-pa-md">
        <div class="col-12">
          <q-input
            outlined
            v-model="startDate"
            dense
            label="Data Inicio"
            :error="!!startDateError"
            :error-message="startDateError"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="startDate" mask="YYYY-MM-DD">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
  
        <div class="col-12">
          <q-input
            outlined
            v-model="endDate"
            dense
            label="Data Fim"
            :error="!!endDateError"
            :error-message="endDateError"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="endDate" mask="YYYY-MM-DD">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
  
        <div class="col-12 text-center">
          <q-btn
            class="col"
            :loading="loading"
            color="secondary"
            @click="validateAndSearch"
            label="Obter Relatório"
          />
        </div>
      </div>
      <div class="row q-px-md" v-if="searchResults.length > 0">
        <q-table
          class="col"
          flat
          dense
          wrap-cells
          :rows="searchResults"
          :columns="columns"
          row-key="id"
          :rows-per-page-options="[5, 10, 20, 50, 100]"
          :loading="loading"
          @request="onRequest"
        >
          <template v-slot:no-data="{ icon, filter }">
            <div class="full-width row flex-center text-primary q-gutter-sm text-body2">
              <span>Sem resultados para visualizar</span>
              <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
            </div>
          </template>
        </q-table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { useSwal } from "src/composables/shared/dialog/dialog";
  import { useStorage } from "@vueuse/core";
  import api from "src/services/api/apiService";
  
  const { alertError, alertSuccess } = useSwal();
  const ClinicalSummaries = useStorage("epts-clinical-summaries", []);
  
  // Reactive variables
  const startDate = ref("");
  const endDate = ref("");
  const loading = ref(false);
  const uploading = ref(false);
  const percentage = ref(0);
  const searchResults = ref([]);
  const startDateError = ref("");
  const endDateError = ref("");
  
  const columns = [
    { name: "patient", align: "left", label: "Paciente", sortable: false },
    { name: "date", align: "left", label: "Data", sortable: false },
    { name: "user", align: "left", label: "Utilizador", sortable: false },
  ];
  
  const validateAndSearch = () => {
    if (validateDates()) {
      searchReport();
    }
  };
  
  const validateDates = () => {
    startDateError.value = "";
    endDateError.value = "";
  
    const start = new Date(startDate.value);
    const end = new Date(endDate.value);
    const today = new Date();
  
    if (!startDate.value) {
      startDateError.value = "Data Inicio é obrigatória.";
    }
  
    if (!endDate.value) {
      endDateError.value = "Data Fim é obrigatória.";
    } else if (end > today) {
      endDateError.value = "Data Fim não pode estar no futuro.";
    } else if (start > end) {
      startDateError.value = "Data Inicio deve ser antes de Data Fim.";
    }
  
    return !startDateError.value && !endDateError.value;
  };
  
  const searchReport = () => {
    const start = new Date(startDate.value);
    const end = new Date(endDate.value);
  
    // Filter reports from ClinicalSummaries based on date range
    const filteredReports = ClinicalSummaries.value.filter((item) => {
      const dateOpened = new Date(item.dateOpened);
      return dateOpened >= start && dateOpened <= end;
    });
  
    if (filteredReports.length > 0) {
      searchResults.value = filteredReports;
      alertSuccess("Relatório carregado com sucesso.");
    } else {
      searchResults.value = [];
      alertError("Nenhum resultado encontrado.");
    }
  };
  
  const uploadUsageReports = async () => {
    uploading.value = true;
    percentage.value = 0;
  
    const unsyncedReports = ClinicalSummaries.value.filter(
      (item) => item.status === "not_uploaded"
    );
  
    if (unsyncedReports.length === 0) {
      alertError("Sem relatórios por enviar.");
      uploading.value = false;
      return;
    }
  
    for (const [index, report] of unsyncedReports.entries()) {
      try {
        const payload = {
          report: report.report,
          unidadeSanitaria: report.us,
          userName: report.username,
          terms: report.terms,
          dateOpened: report.dateOpened,
          applicationVersion: report.applicationVersion,
        };
  
        await api.post("/clinicalsummary", payload);
  
        // Mark as uploaded
        report.status = "uploaded";
        ClinicalSummaries.value = [
          ...ClinicalSummaries.value.filter(
            (item) => item.dateOpened !== report.dateOpened
          ),
          report,
        ];
  
        percentage.value = Math.round(((index + 1) / unsyncedReports.length) * 100);
      } catch (error) {
        alertError("Erro ao enviar relatório. Verifique sua conexão.");
        uploading.value = false;
        return;
      }
    }
  
    alertSuccess("Todos os relatórios foram enviados com sucesso.");
    uploading.value = false;
  };
  </script>
  
  <style scoped></style>
  