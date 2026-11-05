<script setup>
import { ref, computed, onMounted } from 'vue';
import { apiRequest, getUser, clearSession } from './lib/http';
import LoginPanel from './components/LoginPanel.vue';
import StudentList from './components/StudentList.vue';
import StudentModal from './components/StudentModal.vue';

const currentUser = ref(getUser());
const records = ref([]);
const isLoading = ref(false);
const banner = ref(null);
const modalOpen = ref(false);
const selected = ref(null);
const searchText = ref('');

const isAdmin = computed(() => currentUser.value?.role === 'admin');

const filteredRecords = computed(() => {
    const q = searchText.value.trim().toLowerCase();
    if (!q) return records.value;
    return records.value.filter((r) =>
        `${r.first_name} ${r.last_name} ${r.student_number} ${r.course}`.toLowerCase().includes(q)
    );
});

let bannerTimer = null;
function showBanner(type, text) {
    banner.value = { type, text };
    clearTimeout(bannerTimer);
    bannerTimer = setTimeout(() => (banner.value = null), 4000);
}

async function fetchRecords() {
    isLoading.value = true;
    try {
        records.value = await apiRequest('/students');
    } catch (e) {
        if (e.status === 401) {
            clearSession();
            currentUser.value = null;
            showBanner('error', 'Session expired. Please sign in again.');
        } else {
            showBanner('error', e.message);
        }
    } finally {
        isLoading.value = false;
    }
}

function handleAuthenticated(user) {
    currentUser.value = user;
    showBanner('success', `Welcome, ${user.name}!`);
    fetchRecords();
}

async function handleLogout() {
    try {
        await apiRequest('/logout', { method: 'POST' });
    } catch (e) {
        // ituloy ang logout bisan mo-error
    }
    clearSession();
    currentUser.value = null;
    records.value = [];
    searchText.value = '';
    showBanner('success', 'You have been logged out.');
}

function openAddModal() {
    selected.value = null;
    modalOpen.value = true;
}

function openEditModal(student) {
    selected.value = student;
    modalOpen.value = true;
}

function handleSaved(text) {
    modalOpen.value = false;
    showBanner('success', text);
    fetchRecords();
}

async function handleRemove(student) {
    if (!confirm(`Delete ${student.first_name} ${student.last_name}?`)) return;
    try {
        const result = await apiRequest(`/students/${student.id}`, { method: 'DELETE' });
        showBanner('success', result.message || 'Student deleted.');
        fetchRecords();
    } catch (e) {
        showBanner('error', e.message);
    }
}

onMounted(() => {
    if (currentUser.value) fetchRecords();
});
</script>

<template>
    <div class="page">
        <header class="topbar">
            <h1>Student Records Manager</h1>
            <div v-if="currentUser" class="user-info">
                <span>{{ currentUser.name }} ({{ isAdmin ? 'Administrator' : 'Regular User' }})</span>
                <button class="button button-sm" @click="handleLogout">Logout</button>
            </div>
        </header>

        <p v-if="banner" class="banner" :class="'banner-' + banner.type">{{ banner.text }}</p>

        <LoginPanel v-if="!currentUser" @authenticated="handleAuthenticated" />

        <template v-else>
            <div class="toolbar">
                <h2>Students</h2>
                <div class="toolbar-right">
                    <input v-model="searchText" class="search" type="text" placeholder="Search name, number, course..." />
                    <button v-if="isAdmin" class="button button-main" @click="openAddModal">+ Add Student</button>
                </div>
            </div>
            <p v-if="!isAdmin" class="hint">Signed in as a Regular User: view only.</p>

            <p v-if="isLoading" class="hint">Loading records...</p>
            <StudentList
                v-else
                :records="filteredRecords"
                :can-manage="isAdmin"
                @edit="openEditModal"
                @remove="handleRemove"
            />

            <StudentModal
                v-if="modalOpen"
                :student="selected"
                @saved="handleSaved"
                @close="modalOpen = false"
            />
        </template>
    </div>
</template>