<script setup>
defineProps({
    records: { type: Array, required: true },
    canManage: { type: Boolean, default: false },
});
defineEmits(['edit', 'remove']);
</script>

<template>
    <div class="table-box">
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Student No.</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Course</th>
                    <th>Year</th>
                    <th v-if="canManage">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="records.length === 0">
                    <td :colspan="canManage ? 7 : 6" class="no-data">No student records found.</td>
                </tr>
                <tr v-for="item in records" :key="item.id">
                    <td>{{ item.id }}</td>
                    <td>{{ item.student_number }}</td>
                    <td>{{ item.first_name }} {{ item.last_name }}</td>
                    <td>{{ item.email }}</td>
                    <td>{{ item.course }}</td>
                    <td>{{ item.year_level }}</td>
                    <td v-if="canManage" class="row-actions">
                        <button class="button button-sm" @click="$emit('edit', item)">Edit</button>
                        <button class="button button-sm button-danger" @click="$emit('remove', item)">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>