<script setup>
defineProps({
    records: { type: Array, required: true },
    isAdmin: { type: Boolean, default: false },
    deletingId: { type: Number, default: null },
});
defineEmits(['edit', 'remove']);
</script>

<template>
    <div class="table-wrap">
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Student No.</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Course</th>
                    <th>Year</th>
                    <th v-if="isAdmin">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="records.length === 0">
                    <td :colspan="isAdmin ? 7 : 6" class="empty">No student records found.</td>
                </tr>
                <tr v-for="s in records" :key="s.id">
                    <td>{{ s.id }}</td>
                    <td>{{ s.student_number }}</td>
                    <td>{{ s.first_name }} {{ s.last_name }}</td>
                    <td>{{ s.email }}</td>
                    <td>{{ s.course }}</td>
                    <td>{{ s.year_level }}</td>
                    <td v-if="isAdmin" class="actions">
                        <button class="btn small" :disabled="deletingId === s.id" @click="$emit('edit', s)">Edit</button>
                        <button class="btn small danger" :disabled="deletingId === s.id" @click="$emit('remove', s)">
                            {{ deletingId === s.id ? 'Deleting...' : 'Delete' }}
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>