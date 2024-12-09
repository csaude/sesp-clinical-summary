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

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          :title="link.title"
          :caption="link.caption"
          :icon="link.icon"
          @click="handleNavigation(link.link)"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import EssentialLink from 'components/EssentialLink.vue';
import userService from 'src/services/user/userService';
import { useSwal } from 'src/composables/shared/dialog/dialog';

defineOptions({
  name: 'MainLayout'
});

const router = useRouter();
const username = ref('');
const leftDrawerOpen = ref(false);
const { alertWarningAction } = useSwal();

// Links list for navigation
const linksList = [
  {
    title: 'Inicio',
    caption: 'Ecrã Principal',
    icon: 'home',
    link: '/home'
  },
  {
    title: 'Sumário Clinico',
    caption: 'Aceder ao Sumário Clinico',
    icon: 'description',
    link: '/summary'
  },
  {
    title: 'Relatório de Uso',
    caption: 'Aceder ao Relatório de Uso',
    icon: 'query_stats',
    link: '/report'
  },
  {
    title: 'Configurações',
    caption: 'Gerir Configurações',
    icon: 'settings',
    link: '/settings'
  },
  {
    title: 'Sair',
    caption: 'Terminar Sessão',
    icon: 'logout',
    link: 'logout'
  }
];

// Load username from session storage
onMounted(() => {
  const userInfo = sessionStorage.getItem('userInfo');
  if (userInfo) {
    const parsedUserInfo = JSON.parse(userInfo);
    username.value = parsedUserInfo.display || 'Usuário';
  }
});

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
    try {
      await userService.logout(); 
    } catch (error) {
      console.error('Logout error:', error);
    }
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
