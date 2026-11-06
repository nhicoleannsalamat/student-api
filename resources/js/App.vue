<script setup>
import { ref, onMounted } from 'vue';
import { useSession } from './composables/useSession';
import { useStudentRecords } from './composables/useStudentRecords';
import { useAlerts } from './composables/useAlerts';
import SignInForm from './components/SignInForm.vue';
import StudentList from './components/StudentList.vue';
import StudentModal from './components/StudentModal.vue';

const { currentUser, isLoggedIn, isAdmin, roleLabel, signOut, dropSession } = useSession();
const {
    records,
    filteredRecords,
    isLoadingRecords,
    deletingId,
    searchText,
    fetchRecords,
    deleteRecord,
    clearRecords,
} = useStudentRecords();
const { alertBox, pushAlert } = useAlerts();

const showModal = ref(false);
const selectedStudent = ref(null);
const isSigningOut = ref(false);


function handleApiError(e) {
    if (e.status === 401) {
        dropSession();
        clearRecords();
        showModal.value = false;
        pushAlert('error', 'Session expired. Please login again.');
    } else if (e.status === 403) {
        pushAlert('error', 'Access denied: you do not have permission to perform this action.');
    } else {
        pushAlert('error', e.message);
    }
}

async function loadList() {
    try {
        await fetchRecords();
    } catch (e) {
        handleApiError(e);
    }
}

async function onSignedIn() {
    pushAlert('success', `Welcome, ${currentUser.value.name}!`);
    await loadList();
}

async function handleSignOut() {
    isSigningOut.value = true;
    await signOut();
    clearRecords();
    showModal.value = false;
    isSigningOut.value = false;
    pushAlert('success', 'Logged out successfully.');
}

function openAdd() {
    if (!isAdmin.value) return pushAlert('error', 'Only administrators can add students.');
    selectedStudent.value = null;
    showModal.value = true;
}

function openEdit(student) {
    if (!isAdmin.value) return pushAlert('error', 'Only administrators can edit students.');
    selectedStudent.value = student;
    showModal.value = true;
}

function onSaved(text) {
    showModal.value = false;
    pushAlert('success', text);
}

function onModalFailed(e) {
    showModal.value = false;
    handleApiError(e);
}

async function handleDelete(student) {
    if (!isAdmin.value) return pushAlert('error', 'Only administrators can delete students.');
    if (!confirm(`Delete ${student.first_name} ${student.last_name}?`)) return;
    try {
        const data = await deleteRecord(student.id);
        pushAlert('success', data?.message || 'Student deleted successfully.');
    } catch (e) {
        handleApiError(e);
    }
}

onMounted(() => {
    if (isLoggedIn.value) loadList();
});
</script>

<template>
    <div class="container">
        <header>
            <h1>Student Management</h1>
            <div v-if="isLoggedIn" class="user-box">
                <span>{{ currentUser.name }}</span>
                <span class="badge" :class="isAdmin ? 'badge-admin' : 'badge-user'">{{ roleLabel }}</span>
                <button class="btn small" :disabled="isSigningOut" @click="handleSignOut">
                    {{ isSigningOut ? 'Logging out...' : 'Logout' }}
                </button>
            </div>
        </header>

        <p v-if="alertBox" class="alert" :class="alertBox.type">{{ alertBox.text }}</p>

        <SignInForm v-if="!isLoggedIn" @signed-in="onSignedIn" />

        <template v-else>
            <div class="toolbar">
                <h2>Student Records</h2>
                <div class="toolbar-right">
                    <input
                        v-model="searchText"
                        class="search"
                        type="text"
                        placeholder="Search name, number, course..."
                    />
                    <button v-if="isAdmin" class="btn primary" @click="openAdd">+ Add Student</button>
                </div>
            </div>

            <p v-if="!isAdmin" class="note">You are logged in as a Regular User (view only).</p>
            <p class="count">Showing {{ filteredRecords.length }} of {{ records.length }} students</p>

            <p v-if="isLoadingRecords" class="note"><span class="spinner"></span>Loading records...</p>
            <StudentList
                v-else
                :records="filteredRecords"
                :is-admin="isAdmin"
                :deleting-id="deletingId"
                @edit="openEdit"
                @remove="handleDelete"
            />

            <StudentModal
                v-if="showModal"
                :student="selectedStudent"
                @saved="onSaved"
                @cancel="showModal = false"
                @failed="onModalFailed"
            />
        </template>
    </div>
</template>