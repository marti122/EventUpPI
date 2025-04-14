<template>
  <q-page>
    <div class="q-pa-md">
      <q-table
        title="Organizatori"
        :rows="organizators"
        :columns="columns"
        row-key="sifra_organizatora"
        flat
        selection="single"
        v-model:selected="selectedOrganizator"
        @update:selected="onSelectionRow"
      >
        <template v-slot:top>
          <q-btn color="primary" label="Osvježi" @click="onRead" />
          <q-space />

          <q-btn color="primary" label="Novi organizator" @click="onAddRow" />
          <q-btn
            v-if="selectedOrganizator.length !== 0"
            class="q-ml-sm"
            color="primary"
            label="Izmijeni organizatora"
            @click="onEditRow"
          />
          <q-btn
            v-if="selectedOrganizator.length !== 0"
            class="q-ml-sm"
            color="red"
            label="Obriši organizatora"
            @click="onDeleteRow"
          />
        </template>
      </q-table>
    </div>

    <!-- Forma za unos/uređivanje organizatora -->
    <div class="q-pa-md" v-if="showForm">
      <q-card flat bordered class="q-pa-sm">
        <q-card-section>
          <q-form @submit.prevent="onSave" ref="organizatorForm">
            <q-input
              filled
              v-model="editOrganizator.sifra_organizatora"
              label="Šifra organizatora"
              lazy-rules
              :disable="isEditing"
              :rules="[(val) => (val && val.length === 8) || 'Šifra mora imati točno 8 znakova']"
            />
            <q-input
              filled
              v-model="editOrganizator.naziv_organizatora"
              label="Naziv organizatora"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Unesite naziv organizatora']"
            />
            <q-input
              filled
              v-model="editOrganizator.kontakt_organizatora"
              label="Kontakt organizatora"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Unesite kontakt organizatora']"
            />
            <q-input
              filled
              v-model="editOrganizator.lokacija_organizatora"
              label="Lokacija organizatora"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Unesite lokaciju organizatora']"
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
  name: 'OrganizatorPage',
})

const columns = [
  {
    name: 'sifra_organizatora',
    label: 'Šifra organizatora',
    field: 'sifra_organizatora',
    sortable: true,
  },
  {
    name: 'naziv_organizatora',
    label: 'Naziv organizatora',
    field: 'naziv_organizatora',
    sortable: true,
  },
  {
    name: 'kontakt_organizatora',
    label: 'Kontakt organizatora',
    field: 'kontakt_organizatora',
    sortable: true,
  },
  {
    name: 'lokacija_organizatora',
    label: 'Lokacija organizatora',
    field: 'lokacija_organizatora',
    sortable: true,
  },
]

const organizators = ref([])
const selectedOrganizator = ref([])
const editOrganizator = ref({
  sifra_organizatora: '',
  naziv_organizatora: '',
  kontakt_organizatora: '',
  lokacija_organizatora: '',
})
const showForm = ref(false)
const isEditing = ref(false)

const onRead = async () => {
  try {
    const result = await api.get('/organizator')
    organizators.value = result.data
    selectedOrganizator.value = []
    showForm.value = false
  } catch (error) {
    console.error('Greška pri učitavanju podataka:', error)
  }
}

const onDeleteRow = async () => {
  if (!selectedOrganizator.value.length) return
  try {
    await api.delete(`/organizator/${selectedOrganizator.value[0].sifra_organizatora}`)
    onRead() // Osvježi popis organizatora
  } catch (error) {
    console.error('Greška pri brisanju:', error)
  }
}

const onAddRow = () => {
  selectedOrganizator.value = []
  editOrganizator.value = {
    sifra_organizatora: '',
    naziv_organizatora: '',
    kontakt_organizatora: '',
    lokacija_organizatora: '',
  }
  showForm.value = true
  isEditing.value = false
}

const onEditRow = () => {
  if (!selectedOrganizator.value.length) return
  editOrganizator.value = { ...selectedOrganizator.value[0] }
  showForm.value = true
  isEditing.value = true
}

const onClose = () => {
  showForm.value = false
}

const onSelectionRow = (selected) => {
  selectedOrganizator.value = selected
}

const onSave = async () => {
  try {
    if (isEditing.value) {
      await api.put(
        `/organizator/${editOrganizator.value.sifra_organizatora}`,
        editOrganizator.value,
      )
    } else {
      await api.post('/organizator', editOrganizator.value)
    }
    onRead()
    showForm.value = false
  } catch (error) {
    console.error('Greška pri spremanju:', error)
  }
}

onMounted(() => {
  onRead()
})
</script>
