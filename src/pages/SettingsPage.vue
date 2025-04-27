<template>
  <q-page class="q-pa-sm q-pt-sm">
    <q-card flat bordered>
      <!-- Naslov -->
      <q-card-section>
        <div class="text-h6 text-bold">Postavke</div>
      </q-card-section>

      <q-separator />

      <!-- Dark Mode -->
      <q-card-section>
        <div class="q-gutter-md flex items-center">
          <q-toggle
            v-model="isDarkMode"
            label="Tamni način rada"
            color="primary"
            @update:model-value="toggleDarkMode"
          />
        </div>
      </q-card-section>

      <q-separator />

      <!-- Upute PDF -->
      <q-card-section class="q-mt-md">
        <div class="text-body1 q-mb-sm">Trebate li pomoć pri korištenju aplikacije?</div>
        <q-btn
          color="primary"
          icon="open_in_new"
          label="Otvori upute (PDF)"
          href="/help/upute.pdf"
          target="_blank"
          type="a"
          class="q-mb-md"
        />
      </q-card-section>

      <q-separator />

      <!-- Korisnički podaci -->
      <q-card-section class="q-mt-lg">
        <div class="text-subtitle2 q-mb-sm">
          Ulogirani ste kao: <b>{{ username }}</b>
        </div>

        <q-btn
          color="secondary"
          icon="edit"
          label="Uredi korisničke podatke"
          @click="openEditDialog"
        />
      </q-card-section>

      <!-- Odjava odvojena -->
      <q-card-section class="q-mt-xl">
        <q-btn color="negative" icon="logout" label="Odjava" @click="logout" />
      </q-card-section>
    </q-card>

    <!-- Popup za uređivanje korisničkih podataka -->
    <q-dialog v-model="showEditDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Uredi korisničke podatke</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input v-model="editUsername" label="Korisničko ime" />
          <q-input v-model="editEmail" label="Email" />
          <q-input v-model="editPassword" label="Nova lozinka" type="password" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Odustani" v-close-popup />
          <q-btn flat label="Spremi" color="primary" @click="saveUserData" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Popup za potvrdu uspješne izmjene -->
    <q-dialog v-model="showSuccessDialog">
      <q-card>
        <q-card-section class="text-center">
          <div class="text-h6">✅ Podaci su uspješno promijenjeni!</div>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useSettingsStore } from 'src/stores/settingsStore'
import { useRouter } from 'vue-router'
import axios from 'axios'

const $q = useQuasar()
const router = useRouter()
const settingsStore = useSettingsStore()

// Dark Mode kontrola
const isDarkMode = ref($q.dark.isActive)

const toggleDarkMode = () => {
  $q.dark.toggle()
}

// Username prikaz
const username = ref(settingsStore.username || 'Nepoznat korisnik')

// Logout funkcija
const logout = () => {
  settingsStore.clearSettings()
  router.push('/login')
}

// Dialog za uređivanje korisnika
const showEditDialog = ref(false)
const editUsername = ref('')
const editEmail = ref('')
const editPassword = ref('')

// Success popup
const showSuccessDialog = ref(false)

// Funkcija za otvaranje popupa i postavljanje trenutnih podataka
const openEditDialog = () => {
  editUsername.value = settingsStore.username || ''
  editEmail.value = ''
  editPassword.value = ''
  showEditDialog.value = true
}

// Spremanje novih podataka
const saveUserData = async () => {
  try {
    const token = localStorage.getItem('token')
    await axios.put(
      'http://localhost:3000/api/user/update',
      {
        username: editUsername.value || undefined,
        email: editEmail.value || undefined,
        password: editPassword.value || undefined,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )

    if (editUsername.value) {
      settingsStore.setUsername(editUsername.value)
      username.value = editUsername.value
    }

    showEditDialog.value = false
    showSuccessDialog.value = true
  } catch (error) {
    console.error('Greška pri spremanju podataka:', error.message)
    $q.notify({ type: 'negative', message: 'Greška pri spremanju podataka.' })
  }
}
</script>
