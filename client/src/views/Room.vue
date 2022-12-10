<script setup lang="ts">
import {
  dracula,
  cobalt,
  barf,
  coolGlow,
  tomorrow,
  clouds,
  rosePineDawn,
} from "thememirror";
import {
  mdiCogBox,
  mdiMenuDown,
  mdiCloudDownload,
  mdiFileUpload,
} from "@mdi/js";
import { ref, shallowRef } from "vue";
import { Codemirror } from "vue-codemirror";
import { EditorView, keymap } from "@codemirror/view";
import { useToast, POSITION } from "vue-toastification";
import { defaultKeymap, insertTab } from "@codemirror/commands";
import { EditorState, type Extension } from "@codemirror/state";
import { sql } from "@codemirror/lang-sql";
import { css } from "@codemirror/lang-css";
import { cpp } from "@codemirror/lang-cpp";
import { html } from "@codemirror/lang-html";
import { rust } from "@codemirror/lang-rust";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { javascript } from "@codemirror/lang-javascript";
import socket from "../socket";

const toast = useToast();
const tabSize = ref(3);
const dialog = ref(false);
let extensions = ref<Extension[]>();
const view = shallowRef<EditorView>();
const onclick = () => view.value?.focus();
const code = ref(`console.log('Hello, world!')`);

const handleReady = (payload: any) => {
  view.value = payload.view;
  initExtensions();
  updateSettings();
};

// Status is available at all times via Codemirror EditorView
const getCodemirrorStates = () => {
  const state = view?.value?.state!;
  const ranges = state.selection.ranges;
  const selected = ranges.reduce((r, range) => r + range.to - range.from, 0);
  const cursor = ranges[0].anchor;
  const length = state.doc.length;
  const lines = state.doc.lines;
  // more state info ...
  // return ...
};

const languages = ref([
  {
    title: "JavaScript",
    ext: "js",
    module: javascript,
    conf: { typescript: true },
  },
  {
    title: "HTML",
    ext: "html",
    module: html,
    conf: { autoCloseTags: true, matchClosingTags: true },
  },
  { title: "CSS", module: css, ext: "css", conf: {} },
  { title: "C++", module: cpp, ext: "cpp", conf: {} },
  { title: "python", ext: "py", module: python, conf: {} },
  { title: "Rust", ext: "rs", module: rust, conf: {} },
  { title: "SQL", module: sql, conf: {}, ext: "sql" },
]);
const selectedLanguage = ref(languages.value[0].title);

const themes = ref([
  { title: "Tomorrow", module: tomorrow },
  { title: "Rosé Pine Dawn", module: rosePineDawn },
  { title: "Barf", module: barf },
  { title: "Dracula", module: dracula },
  { title: "Cobalt", module: cobalt },
  { title: "CoolGlow", module: coolGlow },
  { title: "Clouds", module: clouds },
  { title: "One Dark", module: oneDark },
]);
const selectedTheme = ref(themes.value[0].title);

function updateLanguage(selected: string) {
  const language = languages.value.find((lang) => lang.title === selected);
  extensions.value?.push(language?.module(language.conf)!);
}

function updateTheme(selected: string) {
  //@ts-ignore
  const theme = themes.value.find((theme) => theme.title === selected);
  //@ts-ignore
  extensions.value?.push(theme?.module);
}

function updateTabSize(size: number) {
  extensions.value?.push(EditorState.tabSize.of(size));
}

function initExtensions() {
  extensions.value = [];
  extensions.value.push(
    keymap.of([
      ...defaultKeymap,
      { key: "Tab", preventDefault: true, run: insertTab },
    ])
  );
}

function updateSettings() {
  initExtensions();
  updateLanguage(selectedLanguage.value);
  updateTheme(selectedTheme.value);
  updateTabSize(tabSize.value);
  dialog.value = false;
}

function exportCode() {
  const blob = new Blob([code.value], { type: "text/plain" });
  const elem = window.document.createElement("a");
  elem.style.display = "none";
  elem.href = window.URL.createObjectURL(blob);

  const language = languages.value.find(
    (lang) => lang.title === selectedLanguage.value
  );

  elem.download = `live-code.${language?.ext}`;
  document.body.appendChild(elem);
  elem.click();
  document.body.removeChild(elem);
}

function importCode() {
  const input = document.createElement("input");
  input.onchange = onchange;
  input.type = "file";
  input.click();

  async function onchange(e: Event) {
    const file = (e.target as HTMLInputElement)?.files?.[0];

    if (!file) return;

    // check the extension is exists
    const fileExt = file.name.split(".").pop();

    const fileLanguage = languages.value.find((lang) => lang.ext === fileExt);

    if (!fileLanguage) {
      return toast("File not supported.", {
        position: POSITION.TOP_CENTER,
        timeout: 4000,
        icon: false,
      });
    }
    code.value = await file.text();
  }
}
</script>

<template>
  <main>
    <v-row no-gutters style="min-height: 92vh">
      <v-col cols="10" sm="11">
        <codemirror
          @click="onclick"
          v-model="code"
          placeholder="Code goes here..."
          :style="{ height: '400px' }"
          :autofocus="true"
          :extensions="extensions"
          @ready="handleReady"
        />
      </v-col>
      <v-col cols="2" sm="1" class="d-flex flex-column align-center">
        <v-dialog v-model="dialog">
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
                  <div class="my-2 text-subtitle-2 font-weight-bold">
                    Syntax
                  </div>
                  <v-select
                    density="compact"
                    variant="outlined"
                    label="Select Syntax"
                    :append-inner-icon="mdiMenuDown"
                    :items="languages"
                    v-model="selectedLanguage"
                  ></v-select>

                  <div class="my-2 text-subtitle-2 font-weight-bold">Theme</div>

                  <v-select
                    density="compact"
                    variant="outlined"
                    label="Select Theme"
                    :append-inner-icon="mdiMenuDown"
                    :items="themes"
                    v-model="selectedTheme"
                  ></v-select>

                  <div class="my-2 text-subtitle-2 font-weight-bold">
                    Tab Size
                  </div>
                  <v-select
                    density="compact"
                    variant="outlined"
                    label="Select Tab Size"
                    :append-inner-icon="mdiMenuDown"
                    :items="[1, 2, 3, 4, 6, 8]"
                    v-model="tabSize"
                  ></v-select>
                </v-card-text>

                <v-card-actions class="d-flex justify-space-between">
                  <v-btn
                    color="black"
                    class="font-weight-bold"
                    @click="dialog = false"
                    rounded="lg"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    variant="flat"
                    rounded="lg"
                    class="font-weight-bold"
                    color="black"
                    @click="updateSettings"
                  >
                    Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-dialog>

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
      </v-col>
    </v-row>
  </main>
</template>

<style>
.cm-editor {
  height: 100%;
  outline: none !important;
  border: 1px #e0e0e0 solid;
}

.cm-scroller {
  font-family: "Fira Code", sans-serif !important;
  word-wrap: break-word;
}
</style>
