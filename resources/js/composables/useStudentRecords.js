import { ref, computed } from 'vue';
import { apiRequest as request } from '../lib/http';

const records = ref([]);
const isLoadingRecords = ref(false);
const deletingId = ref(null);
const searchText = ref('');

const filteredRecords = computed(() => {
    const q = searchText.value.trim().toLowerCase();
    if (!q) return records.value;
    return records.value.filter((s) =>
        `${s.first_name} ${s.last_name} ${s.student_number} ${s.course}`
            .toLowerCase()
            .includes(q)
    );
});

export function useStudentRecords() {
    async function fetchRecords() {
        isLoadingRecords.value = true;
        try {
            records.value = await request('/students');
        } finally {
            isLoadingRecords.value = false;
        }
    }

    async function addRecord(payload) {
        const created = await request('/students', { method: 'POST', body: payload });
        records.value.unshift(created);
        return created;
    }

    async function editRecord(id, payload) {
        const updated = await request(`/students/${id}`, { method: 'PUT', body: payload });
        const index = records.value.findIndex((s) => s.id === id);
        if (index !== -1) records.value[index] = updated;
        return updated;
    }

    async function deleteRecord(id) {
        deletingId.value = id;
        try {
            const result = await request(`/students/${id}`, { method: 'DELETE' });
            records.value = records.value.filter((s) => s.id !== id);
            return result;
        } finally {
            deletingId.value = null;
        }
    }

    function clearRecords() {
        records.value = [];
        searchText.value = '';
    }

    return {
        records,
        filteredRecords,
        isLoadingRecords,
        deletingId,
        searchText,
        fetchRecords,
        addRecord,
        editRecord,
        deleteRecord,
        clearRecords,
    };
}