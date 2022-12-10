<script setup lang="ts">
import { onMounted, ref, shallowRef } from "vue";
import { defaultKeymap, insertTab } from "@codemirror/commands";
import { EditorState, type Extension, StateEffect } from "@codemirror/state";
import { EditorView, keymap, placeholder, lineNumbers } from "@codemirror/view";

import { css } from "@codemirror/lang-css";
import { cpp } from "@codemirror/lang-cpp";
import { html, htmlLanguage } from "@codemirror/lang-html";
import { python } from "@codemirror/lang-python";
import { rust } from "@codemirror/lang-rust";
import { dracula, cobalt, barf, coolGlow, tomorrow, clouds } from "thememirror";
import { oneDark } from "@codemirror/theme-one-dark";
import { sql } from "@codemirror/lang-sql";
import { defaultHighlightStyle, HighlightStyle } from "@codemirror/language";
import { basicSetup } from "codemirror";
import { mdiCogBox, mdiMenuDown } from "@mdi/js";
import { Codemirror } from "vue-codemirror";
import { javascript } from "@codemirror/lang-javascript";

// let view = ref<EditorView>();
// let state = ref<EditorState>();

const dialog = ref(false);

let extensions = ref<Extension[]>();

// Codemirror EditorView instance ref
const view = shallowRef<EditorView>();
const handleReady = (payload: any) => {
  view.value = payload.view;
  initExtensions();
  updateSettings();
};

function onclick() {
  view.value?.focus();
}

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
  { title: "JavaScript", module: javascript },
  { title: "HTML", module: html },
  { title: "CSS", module: css },
  { title: "C++", module: cpp },
  { title: "python", module: python },
  { title: "Rust", module: rust },
  { title: "SQL", module: sql },
]);

const themes = ref([
  { title: "Tomorrow", module: tomorrow },
  { title: "Barf", module: barf },
  { title: "Dracula", module: dracula },
  { title: "Cobalt", module: cobalt },
  { title: "CoolGlow", module: coolGlow },
  { title: "Clouds", module: clouds },
  { title: "One Dark", module: oneDark },
]);

const code = ref(`console.log('Hello, world!')`);

const selectedLanguage = ref(languages.value[0].title);
function updateLanguage(selected: string) {
  const language = languages.value.find((lang) => lang.title === selected);
  extensions.value?.push(language?.module()!);
}

const selectedTheme = ref(themes.value[0].title);
function updateTheme(selected: string) {
  //@ts-ignore
  const theme = themes.value.find((theme) => theme.title === selected);
  //@ts-ignore
  extensions.value?.push(theme?.module);
}

function updateTabSize(size: number) {
  extensions.value?.push(EditorState.tabSize.of(size));
}

// function reconfigureEditor() {
//   view.value?.dispatch({
//     effects: StateEffect.reconfigure.of(extensions.value!),
//   });
// }

const tabSize = ref(3);

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

// const extensions = ref<Extension[]>([
//   basicSetup,
//   EditorState.tabSize.of(3),
//   placeholder("Write the code here..."),
//   lineNumbers(),
//   javascript(),
//   keymap.of([
//     ...defaultKeymap,
//     { key: "Tab", preventDefault: true, run: insertTab },
//   ]),
//   dracula,
// ]);

onMounted(() => {
  // const parent = document.getElementById("editor")!;
  // state.value = EditorState.create({
  //   extensions: extensions.value,
  //   doc: doc.value,
  // });
  // view.value = new EditorView({ state: state.value, parent });
  // view.value.focus();
});
</script>

<template>
  <main>
    <v-row no-gutters style="min-height: 92vh">
      <v-col>
        <codemirror
          @click="onclick"
          v-model="code"
          placeholder="Code goes here..."
          :style="{ height: '400px' }"
          :autofocus="true"
          :tab-size="2"
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
      </v-col>
    </v-row>
  </main>
</template>

<style>
.cm-editor {
  height: 100%;
  outline: solid !important;
}

.cm-scroller {
  font-family: "Fira Code", sans-serif !important;
}
</style>
