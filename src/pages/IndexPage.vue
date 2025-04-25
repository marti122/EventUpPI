<template>
  <q-page class="flex flex-center column">
    <div class="text-h4 text-bold text-center">DOBRODOŠLI U EVENT UP!</div>
    <div class="text-subtitle1 text-center q-mb-md">
      O svim glazbenim izvođačima na jednom mjestu.
    </div>
    <img alt="Event up" src="~assets/002-03.jpg" style="width: 350px; height: 250px" />
  </q-page>
</template>


<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSettingsStore } from 'src/stores/settingsStore'

const router = useRouter()
const settingsStore = useSettingsStore()

onMounted(() => {
  if (!settingsStore.uloga) {
    router.push('/login')
  }
})
</script>
