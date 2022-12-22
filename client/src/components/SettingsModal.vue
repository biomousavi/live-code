<script setup lang="ts">
import { useEditorStore } from "@/stores/editor";
import { mdiCogBox, mdiMenuDown } from "@mdi/js";

const store = useEditorStore();
</script>

<template>
  <v-dialog v-model="store.settingsDialog">
    <template v-slot:activator="{ props }">
      <v-btn
        rounded="lg"
        size="x-large"
        title="Settings"
        variant="plain"
        :icon="mdiCogBox"
        v-bind="props"
      >
      </v-btn>
    </template>

    <v-row no-gutters justify="center" align="center">
      <v-col cols="11" sm="6" md="4">
        <v-card class="rounded-lg">
          <v-card-title class="text-center font-weight-bold quicksand">
            Editor Settings
          </v-card-title>

          <v-card-text>
            <div class="my-2 text-subtitle-2 font-weight-bold">Syntax</div>
            <v-select
              density="compact"
              variant="outlined"
              label="Select Syntax"
              :append-inner-icon="mdiMenuDown"
              :items="store.languages"
              v-model="store.selectedLanguage"
            ></v-select>

            <div class="my-2 text-subtitle-2 font-weight-bold">Theme</div>

            <v-select
              density="compact"
              variant="outlined"
              label="Select Theme"
              :append-inner-icon="mdiMenuDown"
              :items="store.themes"
              v-model="store.selectedTheme"
            ></v-select>

            <div class="my-2 text-subtitle-2 font-weight-bold">Tab Size</div>
            <v-select
              density="compact"
              variant="outlined"
              label="Select Tab Size"
              :append-inner-icon="mdiMenuDown"
              :items="[1, 2, 3, 4, 6, 8]"
              v-model="store.tabSizeNumber"
            ></v-select>
          </v-card-text>

          <v-card-actions class="d-flex justify-space-between">
            <v-btn
              color="black"
              class="font-weight-bold"
              @click="store.settingsDialog = false"
              rounded="lg"
            >
              Cancel
            </v-btn>
            <v-btn
              variant="flat"
              rounded="lg"
              class="font-weight-bold"
              color="black"
              @click="store.updateSettings"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-dialog>
</template>
