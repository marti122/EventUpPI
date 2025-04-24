<template>
  <q-page class="q-pa-sm q-pt-sm">
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6 text-bold">Postavke</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <!-- Odabir uloge -->
        <q-select
          v-model="selectedRole"
          :options="roleOptions"
          dense
          emit-value
          map-options
          @update:model-value="changeRole"
          label="Odaberite ulogu"
        />
      </q-card-section>

      <q-separator />

      <q-card-section class="q-mt-md">
        <div class="text-body1 q-mb-sm">Trebate li pomoć pri korištenju aplikacije?</div>

        <!-- Gumb za otvaranje PDF-a u novoj kartici -->
        <q-btn
          color="primary"
          icon="open_in_new"
          label="Otvori upute (PDF)"
          href="/help/upute.pdf"
          target="_blank"
          type="a"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useSettingsStore } from 'src/stores/settingsStore'

const settingsStore = useSettingsStore()

const roleOptions = [
  { value: 'Izvođač', label: 'Izvođač' },
  { value: 'Organizator', label: 'Organizator' },
  { value: 'Administrator', label: 'Administrator' },
]

const selectedRole = ref(settingsStore.uloga)

const changeRole = () => {
  settingsStore.setUloga(selectedRole.value)
}
</script>
