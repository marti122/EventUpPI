<template>
  <q-page padding>
    <h4 class="q-mb-md">Glazbena događanja</h4>

    <q-table
      flat
      bordered
      :rows="nastupi"
      :columns="columns"
      row-key="datum_nastupa"
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
import { ref, onMounted, onUnmounted } from 'vue'
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

// Dohvati nastupe iz backend-a
async function dohvatiNastupe() {
  try {
    const response = await axios.get('http://localhost:3000/api/nastupi')
    nastupi.value = response.data
  } catch (error) {
    console.error('Greška pri dohvaćanju nastupa:', error)
  }
}

// Kada korisnik klikne na redak, dohvaća izvođača
async function otvoriIzvodaca(event, row) {
  if (!row || !row.sifra_izvodaca) {
    console.error('Greška: Nema šifre izvođača!', row)
    return
  }

  try {
    console.log(`Dohvaćam izvođača: ${row.sifra_izvodaca}`)
    const response = await axios.get(`http://localhost:3000/api/izvodac/${row.sifra_izvodaca}`)
    izvodac.value = response.data
    prikaziDetalje.value = true
  } catch (error) {
    console.error('Greška pri dohvaćanju izvođača:', error)
  }
}

// Slušaj događaj za dodavanje novog nastupa
onMounted(() => {
  dohvatiNastupe()
  window.addEventListener('nastupDodan', dohvatiNastupe)
})

// Ukloni event listener kada se komponenta uništi
onUnmounted(() => {
  window.removeEventListener('nastupDodan', dohvatiNastupe)
})
</script>
