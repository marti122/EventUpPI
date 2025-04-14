<template>
  <q-page padding>
    <h4 class="q-mb-md">O nama</h4>

    <q-card>
      <q-card-section>
        <div class="text-h6">Event Up</div>
        <p><strong>Adresa:</strong> Vukovarska ul. 58, 51000 Rijeka</p>
      </q-card-section>
    </q-card>

    <div class="map-container">
      <iframe width="100%" height="400" :src="googleMapUrl" allowfullscreen loading="lazy"></iframe>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

// Unesi svoj Google Maps API Key ovdje
const googleMapsApiKey = 'AIzaSyAdvn5K8piopxy6HKd0oDCi95Qx3jgL0Ec'

// Lokacija firme (lat, lng)
const latitude = 45.3305
const longitude = 14.4422

// Generiranje URL-a za Google mapu
const googleMapUrl = ref(
  `https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=${latitude},${longitude}`,
)
</script>

<style scoped>
.map-container {
  margin-top: 20px;
  border-radius: 10px;
  overflow: hidden;
}
</style>
