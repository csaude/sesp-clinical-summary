<template>
  <div>
    <!-- Header Section: Show only when no component is selected -->
    <div v-if="currentComponent === 'HomeComponent'">
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
          <q-card class="col-12 col-sm-6 button-card q-mb-md" @click="navigateToComponent('SearchComponent')">
            <q-card-section>
              <q-icon name="assignment" size="3em" color="red-6" />
              <div class="q-mt-sm text-bold">Sumário Clínico</div>
            </q-card-section>
          </q-card>

          <q-card class="col-12 col-sm-6 button-card q-mb-md" @click="navigateToComponent('UsageReport')">
            <q-card-section>
              <q-icon name="bar_chart" size="3em" color="green-6" />
              <div class="q-mt-sm text-bold">Relatório de Uso</div>
            </q-card-section>
          </q-card>

          <q-card class="col-12 col-sm-6 button-card q-mb-md" @click="navigateToComponent('Settings')">
            <q-card-section>
              <q-icon name="settings" size="3em" color="amber-9" />
              <div class="q-mt-sm text-bold">Configurações</div>
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

    <!-- Dynamically Render the Selected Component -->
    <component :is="currentComponent" v-if="currentComponent !== 'HomeComponent'" @back="goBackToHome" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import userService from 'src/services/user/userService';
import { version } from '../../package.json';
import { useSwal } from 'src/composables/shared/dialog/dialog';

// Import components
import UsageReport from 'src/components/report/UsageReport.vue';
import SearchComponent from 'components/SearchComponent.vue';
import Settings from 'src/components/home/Settings.vue';

// Router & state setup
const router = useRouter();
const route = useRoute();
const username = ref('');
const appVersion = version;
const { alertWarningAction } = useSwal();

// **Map query parameter to the actual component**
const componentMap = {
  SearchComponent,
  UsageReport,
  Settings
};

// Compute the active component from the route query
const currentComponent = computed(() => componentMap[route.query.component] || 'HomeComponent');

// Load username on mount
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

// Navigate to a specific component
const navigateToComponent = (componentName) => {
  router.push({ path: '/home', query: { component: componentName } });
};

// Navigate back to home
const goBackToHome = () => {
  router.push({ path: '/home' }); // Reset component query
};

// Handle Logout
const handleLogout = async () => {
  const confirmed = await alertWarningAction(
    'Tem certeza de que deseja terminar a sessão e sair do aplicativo?'
  );

  if (confirmed) {
    try {
      await userService.logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
};
</script>

<style scoped>
.button-card {
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.button-card:hover {
  transform: scale(1.05);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}
</style>
