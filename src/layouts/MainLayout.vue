<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <!-- Dodajte @click event za povratak na početnu stranicu -->
        <q-toolbar-title @click="goToHomePage"> Event up </q-toolbar-title>

        <div>v{{ version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Glavni izbornik </q-item-label>

        <EssentialLink v-for="route in routesList" :key="route.title" v-bind="route" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router' // Import Vue Router
import EssentialLink from 'components/EssentialLink.vue'

const version = '1.0'
const leftDrawerOpen = ref(false)

// Definirajte rute za izbornik
const routesList = [
  {
    title: 'Izvođači',
    caption: 'Izvođači',
    icon: 'music_note',
    route: '/izvodac',
  },
  {
    title: 'Organizatori',
    caption: 'Organizatori glazbenih događanja',
    icon: 'groups',
    route: '/organizator',
  },
  {
    title: 'Događanja',
    caption: 'Glazbena događanja',
    icon: 'event',
    route: '/nastupi',
  },
  {
    title: 'Kreiraj događanje',
    caption: 'Unesi novo događanje',
    icon: 'timer',
    route: '/nastupiNovo',
  },
  {
    title: 'O nama',
    caption: 'Više o Event Up',
    icon: 'person',
    route: '/onama',
  },
]

// Aktivirajte Vue Router
const router = useRouter()

// Funkcija za preusmjeravanje na početnu stranicu
function goToHomePage() {
  router.push('/') // Preusmjeri na početnu stranicu (IndexPage)
}

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
