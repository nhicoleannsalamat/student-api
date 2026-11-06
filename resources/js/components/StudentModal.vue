<script setup>
import { reactive, ref, computed } from 'vue';
import { useStudentRecords } from '../composables/useStudentRecords';

const props = defineProps({
    student: { type: Object, default: null },
});
const emit = defineEmits(['saved', 'cancel', 'failed']);

const { addRecord, editRecord } = useStudentRecords();

const fields = [
    { key: 'student_number', label: 'Student Number', type: 'text' },
    { key: 'first_name', label: 'First Name', type: 'text' },
    { key: 'last_name', label: 'Last Name', type: 'text' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'course', label: 'Course', type: 'text' },
    { key: 'year_level', label: 'Year Level (1 to 6)', type: 'number' },
];


const form = reactive({
    student_number: props.student?.student_number ?? '',
    first_name: props.student?.first_name ?? '',
    last_name: props.student?.last_name ?? '',
    email: props.student?.email ?? '',
    course: props.student?.course ?? '',
    year_level: props.student?.year_level ?? '',
});

const errors = ref({});
const formError = ref('');
const isSaving = ref(false);
const isEdit = computed(() => props.student !== null);


function clearFieldError(key) {
    if (errors.value[key]) {
        const copy = { ...errors.value };
        delete copy[key];
        errors.value = copy;
    }
}

async function submit() {
    errors.value = {};
    formError.value = '';
    isSaving.value = true;

    const payload = {
        ...form,
        year_level: form.year_level === '' ? null : Number(form.year_level),
    };

    try {
        if (isEdit.value) {
            await editRecord(props.student.id, payload);
            emit('saved', 'Student updated successfully.');
        } else {
            await addRecord(payload);
            emit('saved', 'Student added successfully.');
        }
    } catch (e) {
        if (e.status === 422) {
            errors.value = e.errors;
            formError.value = 'Please fix the errors below.';
        } else {
            emit('failed', e);
        }
    } finally {
        isSaving.value = false;
    }
}
</script>

<template>
    <div class="overlay" @click.self="$emit('cancel')">
        <form class="card modal" novalidate @submit.prevent="submit">
            <h2>{{ isEdit ? 'Edit Student' : 'Add Student' }}</h2>
            <p v-if="formError" class="alert error">{{ formError }}</p>

            <div v-for="f in fields" :key="f.key" class="field">
                <label :for="f.key">{{ f.label }}</label>
                <input
                    :id="f.key"
                    v-model="form[f.key]"
                    :type="f.type"
                    :class="{ invalid: errors[f.key] }"
                    @input="clearFieldError(f.key)"
                />
                <small v-if="errors[f.key]" class="field-error">{{ errors[f.key][0] }}</small>
            </div>

            <div class="modal-actions">
                <button type="button" class="btn" :disabled="isSaving" @click="$emit('cancel')">Cancel</button>
                <button type="submit" class="btn primary" :disabled="isSaving">
                    <span v-if="isSaving" class="spinner"></span>
                    {{ isSaving ? 'Saving...' : 'Save' }}
                </button>
            </div>
        </form>
    </div>
</template>