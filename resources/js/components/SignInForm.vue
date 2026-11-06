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
    <form class="panel login-panel" novalidate @submit.prevent="submit">
        <h2>Sign In</h2>
        <p v-if="signInError" class="banner banner-error">{{ signInError }}</p>

        <label for="email">Email</label>
        <input
            id="email"
            v-model="email"
            type="email"
            placeholder="admin@example.com"
            @input="clearSignInErrors"
        />
        <small v-if="signInFieldErrors.email" class="err-text">{{ signInFieldErrors.email[0] }}</small>

        <label for="password">Password</label>
        <input
            id="password"
            v-model="password"
            type="password"
            @input="clearSignInErrors"
        />
        <small v-if="signInFieldErrors.password" class="err-text">{{ signInFieldErrors.password[0] }}</small>

        <button type="submit" class="button button-main" :disabled="isSigningIn">
            {{ isSigningIn ? 'Signing in...' : 'Sign In' }}
        </button>
    </form>
</template>