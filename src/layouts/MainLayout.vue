<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title>
          SESP Sumário Clínico
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      overlay
      bordered
    >
      <q-list>
        <q-card bordered square flat>
          <q-card-section>
            <div class="text-h6">Bem Vindo</div>
            <div class="text-subtitle2">{{ username }}</div>
          </q-card-section>
          <q-separator dark />
        </q-card>

        <q-item
          v-for="link in linksList"
          :key="link.title"
          clickable
          @click="handleNavigation(link.link)"
        >
          <q-item-section avatar>
            <q-icon :name="link.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ link.title }}</q-item-label>
            <q-item-label caption>{{ link.caption }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useSwal } from 'src/composables/shared/dialog/dialog';
import userService from 'src/services/user/userService';

defineOptions({
  name: 'MainLayout'
});

const router = useRouter();
const username = ref('');
const leftDrawerOpen = ref(false);
const { alertWarningAction } = useSwal();

// Auto logout logic
const autoLogoutTime = ref(15 * 60 * 1000); // Default: 15 minutes in milliseconds
const inactivityTimer = ref(null);

// Navigation links
const linksList = [
  { title: 'Inicio', caption: 'Ecrã Principal', icon: 'home', link: { path: '/home' } },
  { title: 'Sumário Clínico', caption: 'Aceder ao Sumário Clínico', icon: 'description', link: { path: '/home', query: { component: 'SearchComponent' } } },
  { title: 'Relatório de Uso', caption: 'Aceder ao Relatório de Uso', icon: 'query_stats', link: { path: '/home', query: { component: 'UsageReport' } } },
  { title: 'Configurações', caption: 'Gerir Configurações', icon: 'settings', link: { path: '/home', query: { component: 'Settings' } } },
  { title: 'Sair', caption: 'Terminar Sessão', icon: 'logout', link: 'logout' }
];


// Load settings and username on component mount
onMounted(() => {
  // Load username
  const userInfo = sessionStorage.getItem('userInfo');
  if (userInfo) {
    const parsedUserInfo = JSON.parse(userInfo);
    username.value = parsedUserInfo.display || 'Usuário';
  }

  // Load settings
  const settings = JSON.parse(localStorage.getItem('settings')) || {};
  if (settings.autoLogout) {
    autoLogoutTime.value = 5 * 60 * 1000; // Convert minutes to milliseconds
  }

  // Start inactivity tracking
  startInactivityTimer();
  setupActivityListeners();
});

// Cleanup on component unmount
onBeforeUnmount(() => {           
  clearInactivityTimers();
  removeActivityListeners();
});

// Setup global activity listeners
function setupActivityListeners() {
  const activityEvents = ['mousemove', 'keydown', 'click', 'touchstart'];

  activityEvents.forEach((event) => {
    window.addEventListener(event, resetInactivityTimer);
  });

  router.afterEach(() => {
    resetInactivityTimer(); // Reset timer on page navigation
  });
}

// Remove global activity listeners
function removeActivityListeners() {
  const activityEvents = ['mousemove', 'keydown', 'click', 'touchstart'];

  activityEvents.forEach((event) => {
    window.removeEventListener(event, resetInactivityTimer);
  });
}

// Start the inactivity timer
function startInactivityTimer() {
  clearInactivityTimers();

  inactivityTimer.value = setTimeout(() => {
    showLogoutWarning();
  }, autoLogoutTime.value - 60000); // Show warning 1 minute before logout
}

// Reset inactivity timer on user activity
function resetInactivityTimer() {
  startInactivityTimer();
}

// Clear inactivity timers
function clearInactivityTimers() {
  if (inactivityTimer.value) clearTimeout(inactivityTimer.value);
}

// Show logout warning
async function showLogoutWarning() {
  let countdown = 60; // Countdown in seconds

  const intervalId = setInterval(() => {
    countdown -= 1;
    if (countdown <= 0) {
      clearInterval(intervalId);
      handleLogout(); // Auto logout when countdown reaches 0
    }
  }, 1000);

  const confirmed = await alertWarningAction(
    `Inatividade detectada. Sessão será encerrada em ${countdown} segundos. Deseja continuar logado?`
  );

  clearInterval(intervalId);

  if (confirmed) {
    startInactivityTimer(); // Reset inactivity timer if user confirms
  } else {
    handleLogout(); // Logout the user
  }
}

// Handle user logout
async function handleLogout() {
  clearInactivityTimers();

  try {
    await userService.logout();
    router.push('/login'); // Redirect to login page
  } catch (error) {
    console.error('Logout error:', error);
  }
}

// Toggle drawer visibility
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

// Handle navigation
async function handleNavigation(link) {
  leftDrawerOpen.value = false;
  if (link === 'logout') {
    const confirmed = await alertWarningAction('Tem certeza de que deseja terminar a sessão e sair do aplicativo?');
    if (confirmed) {
      handleLogout();
    }
  } else {
    router.push(link); // This works for both string and object navigation
    leftDrawerOpen.value = false;
  }
}

</script>

<style scoped>
/* Drawer styling */
.q-drawer {
  background-color: #ffffff;
}

.q-toolbar-title {
  font-weight: bold;
  color: #333;
}

.text-h6 {
  font-weight: bold;
}

.text-subtitle2 {
  font-size: 14px;
  color: #666;
}
</style>
