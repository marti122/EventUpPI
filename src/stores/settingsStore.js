import { defineStore } from 'pinia'
import { LocalStorage } from 'quasar'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    uloga: LocalStorage.getItem('Uloga') || null,
    username: LocalStorage.getItem('Username') || null,
  }),

  actions: {
    setUloga(uloga) {
      this.uloga = uloga
      LocalStorage.setItem('Uloga', uloga)
    },

    setUsername(username) {
      this.username = username
      LocalStorage.setItem('Username', username)
    },

    clearSettings() {
      this.uloga = null
      this.username = null
      LocalStorage.remove('Uloga')
      LocalStorage.remove('Username')
    },
  },
})
