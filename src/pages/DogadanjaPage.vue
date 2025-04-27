<template>
  <q-page padding>
    <h4 class="q-mb-md">Glazbena događanja</h4>

    <q-table
      flat
      bordered
      :rows="nastupi"
      :columns="columns"
      row-key="sifra_nastupa"
      no-data-label="Nema dostupnih nastupa"
      @row-click="otvoriIzvodaca"
    />

    <!-- Dijalog za prikaz izvođača -->
    <q-dialog v-model="prikaziDetalje">
      <q-card>
        <q-card-section>
          <div class="text-h6">
            {{ `${izvodac.ime_izvodaca} ${izvodac.prezime_izvodaca}` }}
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Zatvori" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const nastupi = ref([])
const izvodac = ref({})
const prikaziDetalje = ref(false)

// Kolone za prikaz u tablici
const columns = [
  { name: 'datum_nastupa', label: 'Datum', field: 'datum_nastupa', align: 'left', sortable: true },
  {
    name: 'mjesto_nastupa',
    label: 'Mjesto',
    field: 'mjesto_nastupa',
    align: 'left',
    sortable: true,
  },
]

async function dohvatiNastupe() {
  try {
    const token = localStorage.getItem('token') // ➡️ Uzmi token iz localStorage

    const response = await axios.get('http://localhost:3000/api/nastupi', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    nastupi.value = response.data || []
  } catch (error) {
    console.error('Greška pri dohvaćanju nastupa:', error)
    nastupi.value = []
  }
}

// Kada korisnik klikne na redak, dohvaća izvođača
async function otvoriIzvodaca(event, row) {
  if (!row || !row.sifra_izvodaca) {
    console.error('Greška: Nema šifre izvođača!', row)
    return
  }

  try {
    const response = await axios.get(`http://localhost:3000/api/izvodac/${row.sifra_izvodaca}`)
    izvodac.value = response.data
    prikaziDetalje.value = true
  } catch (error) {
    console.error('Greška pri dohvaćanju izvođača:', error)
  }
}

// Pokreni dohvaćanje kad stranica učita
onMounted(dohvatiNastupe)
</script>
