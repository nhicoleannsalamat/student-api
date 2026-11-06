import { ref, computed } from 'vue';
import { request, getUser, getToken, setSession, clearSession } from '../api';

const currentUser = ref(getUser());
const token = ref(getToken());
const isSigningIn = ref(false);
const signInError = ref('');
const signInFieldErrors = ref({});

const isLoggedIn = computed(() => !!token.value && !!currentUser.value);
const isAdmin = computed(() => currentUser.value?.role === 'admin');
const roleLabel = computed(() => (isAdmin.value ? 'Administrator' : 'Regular User'));

export function useSession() {
    async function signIn(email, password) {
        signInError.value = '';
        signInFieldErrors.value = {};
        isSigningIn.value = true;
        try {
            const data = await request('/login', {
                method: 'POST',
                body: { email, password },
            });
            setSession(data.token, data.user);
            token.value = data.token;
            currentUser.value = data.user;
            return true;
        } catch (e) {
            signInError.value = e.message;
            signInFieldErrors.value = e.errors || {};
            return false;
        } finally {
            isSigningIn.value = false;
        }
    }

    function dropSession() {
        clearSession();
        token.value = null;
        currentUser.value = null;
    }

    async function signOut() {
        try {
            await request('/logout', { method: 'POST' });
        } catch (e) {
           
        }
        dropSession();
    }

    function clearSignInErrors() {
        signInError.value = '';
        signInFieldErrors.value = {};
    }

    return {
        currentUser,
        token,
        isLoggedIn,
        isAdmin,
        roleLabel,
        isSigningIn,
        signInError,
        signInFieldErrors,
        signIn,
        signOut,
        dropSession,
        clearSignInErrors,
    };
}