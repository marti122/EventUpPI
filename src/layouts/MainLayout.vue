<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>Event Up</q-toolbar-title>
        <div>v{{ version }}</div>

        <!-- 🔵 Logout gumb, prikazuje se samo ako je korisnik prijavljen -->
        <q-btn
          v-if="isLoggedIn"
          flat
          label="Logout"
          icon="logout"
          class="q-ml-md"
          @click="logout"
        />
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
import { useRouter } from 'vue-router'
import { useSettingsStore } from 'src/stores/settingsStore'
import EssentialLink from 'components/EssentialLink.vue'

const version = '1.0'
const leftDrawerOpen = ref(false)
const router = useRouter()
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

// Dinamičke stranice ovisno o ulozi
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
    return routes
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

// Provjera je li korisnik prijavljen (ima li spremljenu ulogu)
const isLoggedIn = computed(() => !!settingsStore.uloga)

// Funkcija za otvaranje/zatvaranje lijevog drawer-a
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

// Funkcija za logout
function logout() {
  settingsStore.setUloga(null)
  localStorage.removeItem('token')
  router.push('/login')
}
</script>
