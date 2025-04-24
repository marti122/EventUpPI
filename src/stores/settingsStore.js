import { defineStore } from 'pinia'
import { LocalStorage } from 'quasar'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    uloga: LocalStorage.getItem('Uloga') || null, // Početno stanje, može biti null
  }),

  actions: {
    setUloga(uloga) {
      this.uloga = uloga
      LocalStorage.setItem('Uloga', uloga) // Sprema ulogu u LocalStorage
    },
  },
})
