<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title> Event up </q-toolbar-title>
        <div>v{{ version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Glavni izbornik </q-item-label>

        <!-- Statičke stranice (O nama, Postavke) -->
        <EssentialLink v-for="route in staticRoutes" :key="route.title" v-bind="route" />

        <!-- Dinamičke stranice ovisno o odabranoj ulozi -->
        <q-separator />
        <EssentialLink v-for="route in dynamicRoutes" :key="route.title" v-bind="route" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSettingsStore } from 'src/stores/settingsStore'
import EssentialLink from 'components/EssentialLink.vue'

const version = '1.0'
const leftDrawerOpen = ref(false)
const settingsStore = useSettingsStore()

// Statičke stranice
const staticRoutes = [
  {
    title: 'O nama',
    caption: 'Više o Event Up',
    icon: 'person',
    route: '/onama',
  },
  {
    title: 'Postavke',
    caption: 'Promjena postavki',
    icon: 'settings',
    route: '/postavke',
  },
]

// Dinamičke stranice
const dynamicRoutes = computed(() => {
  const role = settingsStore.uloga
  if (!role) {
    return [] // Ako nije odabrana uloga, ne prikazujemo dinamičke stranice
  }
  const routes = [
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
  ]
  if (role === 'Izvođač') {
    return routes // Ako je uloga Izvođač, prikazuje osnovne stranice
  }
  // Ako je Organizator ili Administrator
  return [
    ...routes,
    {
      title: 'Kreiraj događanje',
      caption: 'Unesi novo događanje',
      icon: 'timer',
      route: '/nastupiNovo',
    },
  ]
})

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
