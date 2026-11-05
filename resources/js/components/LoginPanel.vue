<script setup>
import { ref } from 'vue';
import { apiRequest, saveSession } from '../lib/http';

const emit = defineEmits(['authenticated']);

const email = ref('');
const password = ref('');
const errorText = ref('');
const fieldErrors = ref({});
const busy = ref(false);

async function handleLogin() {
    errorText.value = '';
    fieldErrors.value = {};
    busy.value = true;
    try {
        const result = await apiRequest('/login', {
            method: 'POST',
            body: { email: email.value, password: password.value },
        });
        saveSession(result.token, result.user);
        emit('authenticated', result.user);
    } catch (e) {
        errorText.value = e.message;
        fieldErrors.value = e.errors;
    } finally {
        busy.value = false;
    }
}
</script>

<template>
    <div class="panel login-panel">
        <h2>Sign In</h2>
        <p v-if="errorText" class="banner banner-error">{{ errorText }}</p>

        <label>Email</label>
        <input v-model="email" type="email" placeholder="admin@example.com" @keyup.enter="handleLogin" />
        <small v-if="fieldErrors.email" class="err-text">{{ fieldErrors.email[0] }}</small>

        <label>Password</label>
        <input v-model="password" type="password" @keyup.enter="handleLogin" />
        <small v-if="fieldErrors.password" class="err-text">{{ fieldErrors.password[0] }}</small>

        <button class="button button-main" :disabled="busy" @click="handleLogin">
            {{ busy ? 'Signing in...' : 'Sign In' }}
        </button>
    </div>
</template>