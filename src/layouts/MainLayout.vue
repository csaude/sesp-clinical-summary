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
let warningTimer = null;

// Links list for navigation
const linksList = [
  { title: 'Inicio', caption: 'Ecrã Principal', icon: 'home', link: '/home' },
  { title: 'Sumário Clinico', caption: 'Aceder ao Sumário Clinico', icon: 'description', link: '/summary' },
  { title: 'Relatório de Uso', caption: 'Aceder ao Relatório de Uso', icon: 'query_stats', link: '/report' },
  { title: 'Configurações', caption: 'Gerir Configurações', icon: 'settings', link: '/settings' },
  { title: 'Sair', caption: 'Terminar Sessão', icon: 'logout', link: 'logout' }
];

// Load username and settings from session storage and local storage
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
    autoLogoutTime.value = settings.autoLogout * 60 * 1000; // Convert minutes to milliseconds
  }

  startInactivityTimer();

  // Add event listeners to reset the timer on user activity
  window.addEventListener('mousemove', resetInactivityTimer);
  window.addEventListener('keydown', resetInactivityTimer);
});

// Cleanup event listeners on component unmount
onBeforeUnmount(() => {
  clearTimers();
  window.removeEventListener('mousemove', resetInactivityTimer);
  window.removeEventListener('keydown', resetInactivityTimer);
});

// Start inactivity timer
function startInactivityTimer() {
  if (inactivityTimer?.value !== null) clearTimeout(inactivityTimer.value);

  inactivityTimer.value = setTimeout(() => {
    showLogoutWarning();
  }, autoLogoutTime.value - 60000); // Trigger warning 1 minute before logout
}


// Reset inactivity timer on user activity
function resetInactivityTimer() {
  startInactivityTimer();
}

// Show logout warning with a countdown
async function showLogoutWarning() {
  let warningCountdown = 60; // Countdown in seconds

  const countdown = ref(warningCountdown);

  const intervalId = setInterval(() => {
    countdown.value -= 1;
    if (countdown.value <= 0) {
      clearInterval(intervalId);
      handleLogout(); // Logout automatically when countdown reaches 0
    }
  }, 1000);

  const confirmed = await new Promise((resolve) => {
    const dialogId = setTimeout(() => {
      clearInterval(intervalId);
      resolve(false); // Auto-resolve when timeout is over
    }, warningCountdown * 1000);

    alertWarningAction(
      `Inatividade detectada. Sessão será encerrada em ${countdown.value} segundos. Deseja continuar logado?`
    ).then((result) => {
      clearTimeout(dialogId);
      clearInterval(intervalId);
      resolve(result);
    });
  });

  if (confirmed) {
    startInactivityTimer(); // Reset inactivity timer if user confirms
  }
}



// Logout the user
async function handleLogout() {
  clearTimers();
  try {
    await userService.logout();
    router.push('/login'); // Redirect to login page
  } catch (error) {
    console.error('Logout error:', error);
  }
}

// Clear all timers
function clearTimers() {
  clearTimeout(inactivityTimer);
  clearTimeout(warningTimer);
}

// Toggle drawer visibility
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

// Handle navigation and logout
async function handleNavigation(link) {
  if (link === 'logout') {
    const confirmed = await alertWarningAction(
      'Tem certeza de que deseja terminar a sessão e sair do aplicativo?'
    );
    if (confirmed) {
      handleLogout();
    }
  } else {
    router.push(link);
    leftDrawerOpen.value = false; // Close the drawer after navigation
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
