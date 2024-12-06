<template>
  <div>
    <!-- Header Section -->
    <div v-if="!showUsageReport && !showSearchComponent">
      <div class="q-mt-md text-center">
        <q-avatar size="70px" font-size="56px" color="primary" text-color="white">
          <q-icon name="person" />
        </q-avatar>
        <div class="q-mt-sm">
          <label>Bem Vindo</label>
          <p>{{ username }}</p>
        </div>
      </div>

      <!-- Buttons Section -->
      <div class="q-pa-md">
        <div class="row">
          <q-card class="col-12 col-sm-6 button-card q-mb-md" @click="handleSumarioClinicoClick">
            <q-card-section>
              <q-icon name="assignment" size="3em" color="red-6" />
              <div class="q-mt-sm text-bold">Sumário Clínico</div>
            </q-card-section>
          </q-card>

          <q-card class="col-12 col-sm-6 button-card q-mb-md" @click="showUsageReportComponent">
            <q-card-section>
              <q-icon name="bar_chart" size="3em" color="green-6" />
              <div class="q-mt-sm text-bold">Relatório de Uso</div>
            </q-card-section>
          </q-card>

          <q-card class="col-12 col-sm-6 button-card" @click="handleLogout">
            <q-card-section>
              <q-icon name="exit_to_app" size="3em" color="blue-6" />
              <div class="q-mt-sm text-bold">Terminar Sessão</div>
            </q-card-section>
          </q-card>
        </div>

        <div class="row q-mt-xl">
          <label class="col text-center">v{{ appVersion }}</label>
        </div>
      </div>
    </div>

    <!-- Usage Report Section -->
    <UsageReport v-if="showUsageReport" @back="hideUsageReportComponent" />
    
    <!-- Search Component -->
    <SearchComponent v-if="showSearchComponent" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import userService from 'src/services/user/userService';
import { version } from '../../package.json';
import { useSwal } from 'src/composables/shared/dialog/dialog';
import UsageReport from 'src/components/report/UsageReport.vue';
import SearchComponent from 'components/SearchComponent.vue';

// State variables
const router = useRouter();
const username = ref('');
const appVersion = version;
const { alertWarningAction } = useSwal();
const showUsageReport = ref(false);
const showSearchComponent = ref(false);

// Check for sessionId on mount
onMounted(() => {
  const sessionId = sessionStorage.getItem('sessionId');
  if (!sessionId) {
    router.push('/login');
  } else {
    loadUsername();
  }
});

// Load username from session storage
const loadUsername = () => {
  const userInfo = sessionStorage.getItem('userInfo');
  if (userInfo) {
    const parsedUserInfo = JSON.parse(userInfo);
    username.value = parsedUserInfo.display || 'Usuário';
  }
};

// Button action functions
const handleSumarioClinicoClick = () => {
  resetStates();
  showSearchComponent.value = true;
};

const showUsageReportComponent = () => {
  resetStates();
  showUsageReport.value = true;
};

const hideUsageReportComponent = () => {
  showUsageReport.value = false;
};

const handleLogout = async () => {
  const confirmed = await alertWarningAction(
    'Tem certeza de que deseja terminar a sessão e sair do aplicativo?'
  );

  if (confirmed) {
    try {
      await userService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
};

// Reset states for dynamic components
const resetStates = () => {
  showUsageReport.value = false;
  showSearchComponent.value = false;
};
</script>

<style scoped>
/* General Styling */
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #f5f5f5;
}

.button-card {
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.button-card:hover {
  transform: scale(1.05);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

.q-icon {
  margin-bottom: 0.5rem;
}

.text-bold {
  font-weight: 700;
}
</style>
