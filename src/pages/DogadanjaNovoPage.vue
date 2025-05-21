<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import eventBus from 'src/eventBus' // Ispravljeni import

const router = useRouter()

const nastup = ref({
  sifra_nastupa: '',
  datum_nastupa: '',
  mjesto_nastupa: '',
  sifra_izvodaca: null,
})

const izvodaci = ref([])

// Dohvati izvođače
async function dohvatiIzvodace() {
  try {
    const token = localStorage.getItem('token')

    const response = await axios.get('http://localhost:3000/api/izvodac', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    izvodaci.value = response.data.map((izvodac) => ({
      sifra_izvodaca: izvodac.sifra_izvodaca,
      punoIme: `${izvodac.ime_izvodaca} ${izvodac.prezime_izvodaca}`,
    }))
  } catch (error) {
    console.error('Greška pri dohvaćanju izvođača:', error)
  }
}

// Spremi nastup i obavijesti event bus
async function spremiNastup() {
  try {
    const response = await axios.post('http://localhost:3000/api/nastupi', nastup.value)
    eventBus.emit('nastup-dodan', response.data) // Emit eventa
    router.push('/nastupi') // Preusmjeri na popis
  } catch (error) {
    console.error('Greška pri spremanju nastupa:', error)
  }
}

onMounted(dohvatiIzvodace)
</script>

<template>
  <q-page padding>
    <h4 class="q-mb-md">Nova glazbena događanja</h4>

    <q-form @submit.prevent="spremiNastup">
      <q-input v-model="nastup.sifra_nastupa" label="Šifra nastupa" class="q-mb-md" />
      <q-input v-model="nastup.datum_nastupa" label="Datum nastupa" type="date" class="q-mb-md" />
      <q-input v-model="nastup.mjesto_nastupa" label="Mjesto nastupa" class="q-mb-md" />

      <q-select
        v-model="nastup.sifra_izvodaca"
        :options="izvodaci"
        option-label="punoIme"
        option-value="sifra_izvodaca"
        label="Izvođač"
        emit-value
        map-options
        class="q-mb-md"
      />

      <q-btn type="submit" label="Spremi" color="primary" />
      <q-btn
        label="Odustani"
        color="negative"
        flat
        @click="router.push('/nastupi')"
        class="q-ml-md"
      />
    </q-form>
  </q-page>
</template>
