<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import eventBus from 'src/eventBus' // Ispravljeni import

const dogadanja = ref([])

// Funkcija za dohvaćanje događanja
async function dohvatiDogadanja() {
  try {
    const response = await axios.get('http://localhost:3000/api/nastupi')
    dogadanja.value = response.data
  } catch (error) {
    console.error('Greška pri dohvaćanju događanja:', error)
  }
}

// Kad dođe novo događanje, dodaj ga u popis
onMounted(() => {
  dohvatiDogadanja()

  eventBus.on('nastup-dodan', (noviNastup) => {
    dogadanja.value.push(noviNastup)
  })
})

onUnmounted(() => {
  eventBus.off('nastup-dodan')
})
</script>

<template>
  <q-page padding>
    <h4 class="q-mb-md">Popis događanja</h4>
    <q-list bordered separator>
      <q-item v-for="nastup in dogadanja" :key="nastup.sifra_nastupa">
        <q-item-section>
          <q-item-label>{{ nastup.datum_nastupa }} - {{ nastup.mjesto_nastupa }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>
