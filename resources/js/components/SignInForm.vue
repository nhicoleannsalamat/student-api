<script setup>
import { ref } from 'vue';
import { useSession } from '../composables/useSession';

const emit = defineEmits(['signed-in']);

const { signIn, isSigningIn, signInError, signInFieldErrors, clearSignInErrors } = useSession();

const email = ref('');
const password = ref('');

async function submit() {
    const ok = await signIn(email.value, password.value);
    if (ok) {
        password.value = '';
        emit('signed-in');
    }
}
</script>

<template>
    <form class="card login" novalidate @submit.prevent="submit">
        <h2>Login</h2>
        <p v-if="signInError" class="alert error">{{ signInError }}</p>

        <label for="email">Email</label>
        <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Enter your email"
            :class="{ invalid: signInFieldErrors.email }"
            @input="clearSignInErrors"
        />
        <small v-if="signInFieldErrors.email" class="field-error">{{ signInFieldErrors.email[0] }}</small>

        <label for="password">Password</label>
        <input
            id="password"
            v-model="password"
            type="password"
            :class="{ invalid: signInFieldErrors.password }"
            @input="clearSignInErrors"
        />
        <small v-if="signInFieldErrors.password" class="field-error">{{ signInFieldErrors.password[0] }}</small>

        <button type="submit" class="btn primary" :disabled="isSigningIn">
            <span v-if="isSigningIn" class="spinner"></span>
            {{ isSigningIn ? 'Logging in...' : 'Login' }}
        </button>
    </form>
</template>