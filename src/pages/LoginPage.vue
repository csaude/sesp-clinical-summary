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
        <q-banner
          inline-actions
          class="bg-light-green-10 text-white text-center text-weight-medium"
        >
          SESP Sumário Clínico
          <template v-slot:action>
            <q-btn
              color="white"
              outline
              dense
              @click="handleReconfigure"
              icon="sym_o_reset_wrench"
            />
          </template>
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
          :options="
            facilities.map((facility) => ({
              label: facility.name,
              value: facility,
            }))
          "
          label="Unidade Sanitária"
          outlined
          :disable="isLoading"
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
          :disable="isLoading"
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
          :disable="isLoading"
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
          :disable="isLoading"
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
import { version } from '../../package.json';

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
    // Automatically populate serverUrl
    serverUrl.value = newFacility.value.url;

    // Check if rememberUsername is enabled
    const settings = JSON.parse(localStorage.getItem('settings')) || {};
    if (settings.rememberUsername) {
      // Find the selected facility in localStorage
      const savedFacilities =
        JSON.parse(localStorage.getItem('facilities')) || [];
      const selectedFacilityData = savedFacilities.find(
        (facility) => facility.key === newFacility.value.key
      );

      // If the facility has a userName, auto-populate the username field
      if (selectedFacilityData?.userName) {
        username.value = selectedFacilityData.userName;
      } else {
        username.value = ''; // Clear the username if no userName is found
      }
    }
  } else {
    // Clear the serverUrl and username if no facility is selected
    serverUrl.value = '';
    username.value = '';
  }
});

// Check if configuration exists in local storage
onMounted(() => {
  const justLoggedOut = sessionStorage.getItem('justLoggedOut');

  if (!justLoggedOut) {
    // Show privacy warning only if the user did not just log out
    showPrivacyWarning();
  } else {
    // Remove the flag after the check
    sessionStorage.removeItem('justLoggedOut');
  }

  const savedFacilities = localStorage.getItem('facilities');
  if (!savedFacilities) {
    isFirstTimeSetup.value = true;
  } else {
    facilities.value = JSON.parse(savedFacilities);

    // Automatically set the facility if there's only one
    if (facilities.value.length === 1) {
      selectedFacility.value = {
        label: facilities.value[0].name,
        value: facilities.value[0],
      };

      // Auto-populate the server URL and username (if applicable)
      serverUrl.value = facilities.value[0].url;

      const settings = JSON.parse(localStorage.getItem('settings')) || {};
      if (settings.rememberUsername && facilities.value[0].userName) {
        username.value = facilities.value[0].userName;
      }
    }
  }
});

const handleReconfigure = async () => {
  const confirmed = await alertWarningAction(
    'Deseja apagar todas as configurações do aplicativo e reconfigurar?'
  );

  if (confirmed) {
    // Clear localStorage and sessionStorage
    localStorage.clear();
    userService.logout();
  }
};

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
    sessionStorage.setItem(
      'selectedFacility',
      JSON.stringify(selectedFacility.value)
    );

    // Extract the actual selected facility object
    const selectedFacilityData =
      selectedFacility.value.value || selectedFacility.value;

    // Encrypt and save credentials to session storage
    EncryptionManager.setEncryptedSessionItem('username', username.value);
    EncryptionManager.setEncryptedSessionItem('password', password.value);

    // Call login with username and password
    await userService.login(username.value, password.value);

    // Update facilities in localStorage
    const facilities = JSON.parse(localStorage.getItem('facilities')) || [];
    const updatedFacilities = facilities.map((facility) => {
      if (facility.key === selectedFacilityData.key) {
        return { ...facility, userName: username.value };
      }
      return facility;
    });

    // Save updated facilities back to local storage
    localStorage.setItem('facilities', JSON.stringify(updatedFacilities));

    // Redirect to main page after successful login
    router.push('/home');
  } catch (error) {
    console.error('Login failed:', error);
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
