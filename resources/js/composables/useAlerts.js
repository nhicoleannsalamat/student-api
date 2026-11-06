import { ref } from 'vue';

const alertBox = ref(null);
let timerId = null;

export function useAlerts() {
    function pushAlert(type, text, duration = 4000) {
        alertBox.value = { type, text };
        clearTimeout(timerId);
        if (duration > 0) {
            timerId = setTimeout(() => {
                alertBox.value = null;
            }, duration);
        }
    }

    function dismissAlert() {
        alertBox.value = null;
    }

    return { alertBox, pushAlert, dismissAlert };
}