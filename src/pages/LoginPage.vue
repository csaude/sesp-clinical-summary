<template>
  <div class="login-page">
    <!-- Initial Setup Dialog -->
    <AddHealthFacility
      v-if="isFirstTimeSetup"
      @save="handleFirstTimeSetup"
      @cancel="handleCancelSetup"
    />
    <!-- Login Form -->
    <div v-if="!isFirstTimeSetup" class="login-form">
      <!-- Header Banner -->
      <div class="q-pa-none q-gutter-sm q-mb-xl">
        <q-banner inline-actions class="bg-light-green-10 text-white text-center text-weight-medium">
          SESP Sumário Clínico
        </q-banner>
      </div>
      <!-- Logo -->
      <div class="text-center q-my-xl">
        <q-avatar size="80px" font-size="52px" color="teal" text-color="white">
          <img src="/app-logo.png" alt="App Logo" />
        </q-avatar>
      </div>
      <!-- Form -->
      <div class="q-pa-md">
        <!-- Server URL -->
        <q-input
          v-model="serverUrl"
          label="URL do Servidor"
          class="q-mb-md"
          disable
          outlined
          dense
        >
          <template v-slot:prepend>
            <q-icon name="link" />
          </template>
        </q-input>
        <!-- Facility Selection -->
        <q-select
          v-model="selectedFacility"
          :options="facilities.map(facility => ({
            label: facility.name,
            value: facility,
          }))"
          label="Unidade Sanitária"
          outlined
          class="q-mb-md"
          dense
        >
          <template v-slot:prepend>
            <q-icon name="emergency" />
          </template>
        </q-select>
        <!-- Username -->
        <q-input
          v-model="username"
          label="Utilizador"
          outlined
          dense
          class="q-mb-md"
          autofocus
        >
          <template v-slot:prepend>
            <q-icon name="person" />
          </template>
        </q-input>
        <!-- Password -->
        <q-input
          v-model="password"
          :type="isPwd ? 'password' : 'text'"
          label="Password"
          outlined
          class="q-mb-md"
          dense
        >
          <template v-slot:prepend>
            <q-icon name="key" />
          </template>
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <!-- Login Button -->
        <q-btn
          label="ENTRAR"
          color="primary"
          class="full-width q-mb-md"
          @click="handleLogin"
          :loading="isLoading"
        />
        <!-- Add Facility Button -->
        <q-btn
          label="ADICIONAR UNIDADE SANITÁRIA"
          color="yellow-9"
          class="full-width"
          @click="openAddHealthFacility"
        />
      </div>
      <div class="row q-mt-xl">
        <label class="col text-center">v{{ appVersion }}</label>
      </div>
    </div>
          
  </div>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import userService from 'src/services/user/userService';
import AddHealthFacility from '../components/login/AddHealthFacility.vue';
import { useSwal } from 'src/composables/shared/dialog/dialog';
import EncryptionManager from 'src/utils/EncryptionManager';
import { version } from '../../package.json'

import { App } from '@capacitor/app';

// Destructure dialog functions
const { alertError, alertWarning, alertWarningAction } = useSwal();

// Router instance
const router = useRouter();

// State variables
const isPwd = ref(true);
const username = ref('');
const password = ref('');
const serverUrl = ref(''); // Server URL field
const selectedFacility = ref(null);
const facilities = ref([]);
const isLoading = ref(false);
const isFirstTimeSetup = ref(false);
const appVersion = version;

// Watch for changes to selectedFacility and update serverUrl
watch(selectedFacility, (newFacility) => {
  if (newFacility) {
    serverUrl.value = newFacility.value.url; // Automatically populate serverUrl
  } else {
    serverUrl.value = ''; // Clear serverUrl if no facility is selected
  }
});

// Check if configuration exists in local storage
onMounted(() => {
  showPrivacyWarning();
  const savedFacilities = localStorage.getItem('facilities');
  if (!savedFacilities) {
    isFirstTimeSetup.value = true;
  } else {
    facilities.value = JSON.parse(savedFacilities);
  }
});

// Show privacy warning
const showPrivacyWarning = () => {
  alertWarning(
    'Ao acessar este sistema, você está prestes a visualizar informações altamente confidenciais de utentes. É sua responsabilidade protegê-las adequadamente e usá-las somente para os fins autorizados.'
  );
};

const handleFirstTimeSetup = () => {
  const savedFacilities = localStorage.getItem('facilities');
  if (savedFacilities) {
    facilities.value = JSON.parse(savedFacilities);
  }
  isFirstTimeSetup.value = false;
};

const handleCancelSetup = async () => {
  const savedFacilities = localStorage.getItem('facilities');

  if (savedFacilities) {
    // If facilities exist, go back to login
    isFirstTimeSetup.value = false;
  } else {
    // Warn the user and provide an option to exit the app
    const confirmed = await alertWarningAction(
      'O aplicativo requer configuração inicial para prosseguir. Sair do aplicativo?'
    );

    if (confirmed) {
      // Exit the app
      if (typeof navigator !== 'undefined' && App && App.exitApp) {
        App.exitApp(); // For Cordova or Capacitor apps
      } else if (typeof window !== 'undefined') {
        window.close(); // Fallback for browsers
      }
    }
  }
};


const handleLogin = async () => {
  if (!selectedFacility.value) {
    alertError('Selecione uma unidade sanitária antes de entrar.');
    return;
  }

  isLoading.value = true;

  try {
    // Save the selected facility to session storage
    sessionStorage.setItem('selectedFacility', JSON.stringify(selectedFacility.value));

    // Encrypt and save credentials to session storage
    EncryptionManager.setEncryptedSessionItem('username', username.value);
    EncryptionManager.setEncryptedSessionItem('password', password.value);

    // Call login with username and password
    await userService.login(username.value, password.value);

    // Redirect to main page after successful login
    router.push('/main');
  } catch (error) {
    console.error('Login failed:', error);

    // Clear session storage if login fails
    //clearSessionStorage();

    alertError('Erro ao realizar login. Por favor, verifique as credenciais.');
  } finally {
    isLoading.value = false;
  }
};




// Open Add Health Facility dialog
const openAddHealthFacility = () => {
  isFirstTimeSetup.value = true;
};

</script>

