<template>
  <div class="login-page">
    <div class="login-form">
      <h1>Login</h1>
      <q-input
        v-model="username"
        label="Username"
        outlined
        dense
        autofocus
        :error="!!usernameError"
        :error-message="usernameError"
      />
      <q-input
        v-model="password"
        label="Password"
        outlined
        dense
        type="password"
        :error="!!passwordError"
        :error-message="passwordError"
      />
      <q-btn
        label="Login"
        color="primary"
        class="full-width"
        @click="handleLogin"
        :loading="isLoading"
        :disable="isLoading"
      />
      <p v-if="loginError" class="error-message">{{ loginError }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import userService from 'src/services/user/userService'; 

// State variables
const username = ref('');
const password = ref('');
const isLoading = ref(false);
const loginError = ref('');
const usernameError = ref('');
const passwordError = ref('');

const router = useRouter();

// Validation function
const validateForm = (): boolean => {
  usernameError.value = username.value.trim() ? '' : 'Username is required';
  passwordError.value = password.value.trim() ? '' : 'Password is required';

  return !usernameError.value && !passwordError.value;
};

// Login handler
const handleLogin = async () => {
  if (!validateForm()) return;

  isLoading.value = true;
  loginError.value = '';

  try {
    // Call the login function from userService
    await userService.login(username.value, password.value);

    // Redirect to the main page or dashboard
    router.push('/main');
  } catch (error) {
    if (error instanceof Error) {
      loginError.value = error.message;
    } else {
      loginError.value = 'Login failed'; // Fallback for non-error instances
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.login-page {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.full-width {
  width: 100%;
}

.error-message {
  color: red;
  text-align: center;
}
</style>
