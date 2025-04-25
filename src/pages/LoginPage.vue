<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="q-pa-md flex flex-center">
        <q-card class="q-pa-md shadow-2" style="width: 300px;">
          <q-card-section>
            <div class="text-h6">Prijava</div>
            <div class="text-subtitle2">Unesite podatke za prijavu</div>
          </q-card-section>

          <q-card-section class="q-gutter-md">
            <q-input
              v-model="username"
              label="Korisničko ime"
              filled
              dense
              clearable
            />
            <q-input
              v-model="password"
              label="Lozinka"
              type="password"
              filled
              dense
              clearable
            />
            <q-select
              v-model="selectedRole"
              :options="roleOptions"
              label="Uloga"
              emit-value
              map-options
              filled
              dense
            />
            <q-banner v-if="error" class="bg-red text-white q-mt-md">
              {{ error }}
            </q-banner>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn label="Prijavi se" color="primary" @click="login" />
          </q-card-actions>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useSettingsStore } from 'src/stores/settingsStore'

const router = useRouter()
const settingsStore = useSettingsStore()

const username = ref('')
const password = ref('')
const selectedRole = ref(null)
const error = ref(null)

const roleOptions = [
  { value: 'Izvođač', label: 'Izvođač' },
  { value: 'Organizator', label: 'Organizator' },
  { value: 'Administrator', label: 'Administrator' },
]

async function login() {
  error.value = null
  try {
    const res = await axios.post('http://localhost:3000/api/login', {
      username: username.value,
      password: password.value,
      role: selectedRole.value,
    })

    if (res.data.success) {
  settingsStore.setUloga(res.data.role)
  localStorage.setItem('token', res.data.token)
  router.push('/')
}

  } catch (err) {
    error.value = err.response?.data?.message || 'Greška pri prijavi.'
  }
}
</script>
