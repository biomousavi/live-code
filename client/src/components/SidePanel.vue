<script setup lang="ts">
import { useRoute } from 'vue-router';
import { defineAsyncComponent, ref, watch } from 'vue';
import { useEditorStore } from '@/stores/editor';
import { useToast, POSITION } from 'vue-toastification';
import {
  mdiCloudDownload,
  mdiFileUpload,
  mdiMonitorShare,
  mdiContentCopy,
  mdiWindowClose,
} from '@mdi/js';
import { Text } from '@codemirror/state';
const SettingsModal = defineAsyncComponent(() => import('@/components/SettingsModal.vue'));

const route = useRoute();
const toast = useToast();
const store = useEditorStore();
const menu = ref(false);
const roomLinkLoading = ref(true);

function exportCode(): void {
  const doc = store.view?.state.doc.toJSON().join('\r\n')!;
  const blob = new Blob([doc], { type: 'text/plain' });
  const elem = window.document.createElement('a');
  elem.style.display = 'none';
  elem.href = window.URL.createObjectURL(blob);
  const language = store.languages.find((lang) => lang.title === store.selectedLanguage);
  elem.download = `live-code.${language?.ext}`;
  document.body.appendChild(elem);
  elem.click();
  document.body.removeChild(elem);
}

function importCode(): void {
  const input = document.createElement('input');
  input.onchange = onchange;
  input.type = 'file';
  input.click();

  async function onchange(e: Event) {
    const file = (e.target as HTMLInputElement)?.files?.[0];

    if (file) {
      // check the extension is exists
      const fileExt = file.name.split('.').pop();
      const fileLanguage = store.languages.find((lang) => lang.ext === fileExt);

      // if file language exist on supported langs
      if (fileLanguage) {
        const code = await file.text();
        const splitedCode = code.split(/\r\n|\r|\n/);

        await store.updateLanguage(fileLanguage.title);

        // add imported code to editor
        store.view?.dispatch({
          changes: {
            from: 0,
            insert: Text.of(splitedCode),
            to: store.view.state.doc.length,
          },
        });

        // if lang not supported
      } else {
        toast('File not supported.', {
          position: POSITION.TOP_CENTER,
          timeout: 4000,
          icon: false,
        });
      }
    }
  }
}

function getCurrentUrl() {
  return window.location.href;
}

function onClickCopy(): void {
  navigator.clipboard.writeText(getCurrentUrl());
  toast('Copied Coding Link.', {
    position: POSITION.TOP_RIGHT,
    timeout: 3000,
    icon: false,
  });
}

watch(route, () => {
  if (route.path !== 'new') roomLinkLoading.value = false;
});
</script>

<template>
  <SettingsModal />

  <v-btn
    @click="exportCode"
    rounded="lg"
    size="x-large"
    title="Export"
    variant="plain"
    :icon="mdiCloudDownload"
  >
  </v-btn>

  <v-btn
    @click="importCode"
    rounded="lg"
    size="x-large"
    title="Import"
    variant="plain"
    :icon="mdiFileUpload"
  >
  </v-btn>

  <v-menu v-model="menu" :close-on-content-click="false" location="start center">
    <template v-slot:activator="{ props }">
      <v-btn
        rounded="lg"
        title="Share"
        variant="plain"
        size="x-large"
        :loading="roomLinkLoading"
        :icon="mdiMonitorShare"
        v-bind="props"
      ></v-btn>
    </template>

    <v-card max-width="300" min-height="200" rounded="lg">
      <v-btn
        rounded="xl"
        size="small"
        title="Close"
        variant="plain"
        @click="menu = false"
        :icon="mdiWindowClose"
      >
      </v-btn>

      <v-card-title class="pt-0 font-weight-bold text-subtitle-2 quicksand">
        Share the Link and start collaborating!
      </v-card-title>

      <v-card-subtitle class="text-caption" style="white-space: initial">
        Please copy the following link, send it to your friends, and enjoy real-time coding!
      </v-card-subtitle>

      <v-card-text v-if="menu">
        <v-row
          class="mt-8 px-2 w-100 bg-grey-lighten-3 rounded px-2 flex-nowrap"
          no-gutters
          justify="space-between"
          align="center"
        >
          <v-col cols="10">
            <p style="white-space: nowrap; overflow-x: auto; font-size: 12px">
              {{ getCurrentUrl() }}
            </p>
          </v-col>
          <v-col cols="auto">
            <v-btn
              @click="onClickCopy"
              title="Copy"
              variant="plain"
              size="small"
              :icon="mdiContentCopy"
            ></v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-menu>
</template>
