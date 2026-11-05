<script setup>
import { reactive, ref } from 'vue';
import { apiRequest } from '../lib/http';

const props = defineProps({
    student: { type: Object, default: null },
});
const emit = defineEmits(['saved', 'close']);

const inputs = [
    { name: 'student_number', label: 'Student Number', type: 'text' },
    { name: 'first_name', label: 'First Name', type: 'text' },
    { name: 'last_name', label: 'Last Name', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'course', label: 'Course', type: 'text' },
    { name: 'year_level', label: 'Year Level (1 to 6)', type: 'number' },
];

const formData = reactive({
    student_number: props.student?.student_number ?? '',
    first_name: props.student?.first_name ?? '',
    last_name: props.student?.last_name ?? '',
    email: props.student?.email ?? '',
    course: props.student?.course ?? '',
    year_level: props.student?.year_level ?? '',
});

const fieldErrors = ref({});
const errorText = ref('');
const busy = ref(false);

async function handleSave() {
    fieldErrors.value = {};
    errorText.value = '';
    busy.value = true;

    const payload = {
        ...formData,
        year_level: formData.year_level === '' ? null : Number(formData.year_level),
    };

    try {
        if (props.student) {
            await apiRequest(`/students/${props.student.id}`, { method: 'PUT', body: payload });
            emit('saved', 'Student record updated successfully.');
        } else {
            await apiRequest('/students', { method: 'POST', body: payload });
            emit('saved', 'New student added successfully.');
        }
    } catch (e) {
        fieldErrors.value = e.errors;
        errorText.value = e.status === 422 ? 'Please correct the highlighted fields.' : e.message;
    } finally {
        busy.value = false;
    }
}
</script>

<template>
    <div class="backdrop" @click.self="$emit('close')">
        <div class="panel modal-box">
            <h2>{{ student ? 'Edit Student' : 'Add New Student' }}</h2>
            <p v-if="errorText" class="banner banner-error">{{ errorText }}</p>

            <div v-for="input in inputs" :key="input.name" class="form-row">
                <label>{{ input.label }}</label>
                <input
                    v-model="formData[input.name]"
                    :type="input.type"
                    :class="{ 'input-bad': fieldErrors[input.name] }"
                />
                <small v-if="fieldErrors[input.name]" class="err-text">{{ fieldErrors[input.name][0] }}</small>
            </div>

            <div class="modal-buttons">
                <button class="button" @click="$emit('close')">Cancel</button>
                <button class="button button-main" :disabled="busy" @click="handleSave">
                    {{ busy ? 'Saving...' : 'Save' }}
                </button>
            </div>
        </div>
    </div>
</template>