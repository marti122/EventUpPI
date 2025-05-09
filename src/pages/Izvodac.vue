<template>
  <q-page>
    <div class="q-pa-md">
      <q-table
        title="Izvođači"
        :rows="musicians"
        :columns="columns"
        row-key="sifra_izvodaca"
        flat
        selection="single"
        v-model:selected="selectedIzvodac"
        @update:selected="onSelectionRow"
      >
        <template v-slot:top>
          <q-btn color="primary" label="Osvježi" @click="onRead" />
          <q-space />

          <q-btn color="primary" label="Novi izvođač" @click="onAddRow" />
          <q-btn
            v-if="selectedIzvodac.length !== 0"
            class="q-ml-sm"
            color="primary"
            label="Izmijeni izvođača"
            @click="onEditRow"
          />
          <q-btn
            v-if="selectedIzvodac.length !== 0"
            class="q-ml-sm"
            color="red"
            label="Obriši izvođača"
            @click="onDeleteRow"
          />
        </template>
      </q-table>
    </div>

    <!-- Forma za unos/uređivanje izvođača -->
    <div class="q-pa-md" v-if="showForm">
      <q-card flat bordered class="q-pa-sm">
        <q-card-section>
          <q-form @submit.prevent="onSave" ref="izvođačForm">
            <q-input
              filled
              v-model="editIzvodac.sifra_izvodaca"
              label="Šifra izvođača"
              lazy-rules
              :disable="isEditing"
              :rules="[(val) => (val && val.length === 8) || 'Šifra mora imati točno 8 znakova']"
            />
            <q-input
              filled
              v-model="editIzvodac.ime_izvodaca"
              label="Ime izvođača"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Unesite ime izvođača']"
            />
            <q-input
              filled
              v-model="editIzvodac.prezime_izvodaca"
              label="Prezime izvođača"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Unesite prezime izvođača']"
            />
            <q-input
              filled
              v-model="editIzvodac.umjetnickoIme_izvodaca"
              label="Umjetničko ime izvođača"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Unesite umjetničko ime izvođača']"
            />
            <q-input
              filled
              v-model="editIzvodac.kontakt_izvodaca"
              label="Kontakt izvođača"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Unesite kontakt izvođača']"
            />

            <div>
              <q-btn label="Spremi" type="submit" color="primary" />
              <q-btn label="Zatvori" color="primary" @click="onClose" class="q-ml-sm" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'boot/axios'

defineOptions({
  name: 'IzvodacPage',
})

const columns = [
  {
    name: 'sifra_izvodaca',
    label: 'Šifra izvođača',
    field: 'sifra_izvodaca',
    sortable: true,
  },
  {
    name: 'ime_izvodaca',
    label: 'Ime izvođača',
    field: 'ime_izvodaca',
    sortable: true,
  },
  {
    name: 'prezime_izvodaca',
    label: 'Prezime izvođača',
    field: 'prezime_izvodaca',
    sortable: true,
  },
  {
    name: 'umjetnickoIme_izvodaca',
    label: 'Umjetničko ime ',
    field: 'umjetnickoIme_izvodaca',
    sortable: true,
  },
  {
    name: 'kontakt_izvodaca',
    label: 'Kontakt izvođača',
    field: 'kontakt_izvodaca',
    sortable: true,
  },
]

const musicians = ref([])
const selectedIzvodac = ref([])
const editIzvodac = ref({
  sifra_izvodaca: '',
  ime_izvodaca: '',
  prezime_izvodaca: '',
  umjetnickoIme_izvodaca: '',
  kontakt_izvodaca: '',
})
const showForm = ref(false)
const isEditing = ref(false)

const onRead = async () => {
  try {
    const result = await api.get('/izvodac')
    musicians.value = result.data
    selectedIzvodac.value = []
    showForm.value = false
  } catch (error) {
    console.error('Greška pri učitavanju podataka:', error)
  }
}

const onDeleteRow = async () => {
  if (!selectedIzvodac.value.length) return

  // Potvrda za brisanje
  const isConfirmed = window.confirm('Želite li obrisati ovog izvođača?')
  if (!isConfirmed) return // Ako korisnik otkaže, prestani s brisanjem

  try {
    await api.delete(`/izvodac/${selectedIzvodac.value[0].sifra_izvodaca}`)
    onRead() // Osvježi popis izvođača
  } catch (error) {
    console.error('Greška pri brisanju:', error)
  }
}

const onAddRow = () => {
  selectedIzvodac.value = []
  editIzvodac.value = {
    sifra_izvodaca: '',
    ime_izvodaca: '',
    prezime_izvodaca: '',
    umjetnickoIme_izvodaca: '',
    kontakt_izvodaca: '',
  }
  showForm.value = true
  isEditing.value = false
}

const onEditRow = () => {
  if (!selectedIzvodac.value.length) return
  editIzvodac.value = { ...selectedIzvodac.value[0] }
  showForm.value = true
  isEditing.value = true
}

const onClose = () => {
  showForm.value = false
}

const onSelectionRow = (selected) => {
  selectedIzvodac.value = selected
}

const onSave = async () => {
  try {
    if (isEditing.value) {
      await api.put(`/izvodac/${editIzvodac.value.sifra_izvodaca}`, editIzvodac.value)
    } else {
      await api.post('/izvodac', editIzvodac.value)
    }

    // Prikazivanje alert obavijesti nakon uspješno spremljenih podataka
    alert('Podaci su uspješno spremljeni!')

    onRead() // Osvježi popis izvođača
    showForm.value = false
  } catch (error) {
    console.error('Greška pri spremanju:', error)
  }
}

onMounted(() => {
  onRead()
})
</script>
