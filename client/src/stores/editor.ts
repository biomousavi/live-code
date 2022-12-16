import {
  barf,
  clouds,
  cobalt,
  dracula,
  coolGlow,
  tomorrow,
  rosePineDawn,
} from "thememirror";
import {
  syntaxHighlighting,
  defaultHighlightStyle,
} from "@codemirror/language";
import { ref, computed, shallowRef } from "vue";
import { defineStore } from "pinia";
import { useRoute } from "vue-router";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorState, Text } from "@codemirror/state";
import { defaultKeymap, insertTab } from "@codemirror/commands";
import updateListener from "@/plugins/codemirror/extension/update-listener";
import type { CodeChangedPayload, ParticipantsPayload } from "@/types";
import { keymap, type EditorView } from "@codemirror/view";

export const useEditorStore = defineStore("editor", () => {
  const languages = [
    { title: "JavaScript", ext: "js" },
    { title: "HTML", ext: "html" },
    { title: "CSS", ext: "css" },
    { title: "C++", ext: "cpp" },
    { title: "python", ext: "py" },
    { title: "Rust", ext: "rs" },
    { title: "SQL", ext: "sql" },
  ];

  const themes = [
    { title: "Tomorrow", module: tomorrow },
    { title: "Rosé Pine Dawn", module: rosePineDawn },
    { title: "Barf", module: barf },
    { title: "Dracula", module: dracula },
    { title: "Cobalt", module: cobalt },
    { title: "CoolGlow", module: coolGlow },
    { title: "Clouds", module: clouds },
    { title: "One Dark", module: oneDark },
  ];

  const code = ref("");
  const count = ref(0);
  const tabSize = ref(3);
  const route = useRoute();
  const latestUpdate = ref([""]);
  const participantsCount = ref(1);
  const settingsDialog = ref(false);
  const view = shallowRef<EditorView>();
  const extensions = ref();
  const selectedTheme = ref(themes[0].title);
  const selectedLanguage = ref(languages[0].title);

  const doubleCount = computed(() => count.value * 2);

  function getRoomId(): string {
    return route.params.roomId as string;
  }

  function updateTabSize(size: number) {
    extensions.value?.push(EditorState.tabSize.of(size));
  }

  function updateTheme(selected: string) {
    const theme = themes.find((theme) => theme.title === selected)!;
    extensions.value?.push(theme.module);
  }

  function updateLanguage(selected: string) {
    const language = languages.find((lang) => lang.title === selected)!;

    // https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
    import(`../plugins/codemirror/syntaxt/${language.ext}.ts`).then((m) => {
      extensions.value?.push(m.default);
    });
  }

  function updateParticipants(payload: ParticipantsPayload) {
    participantsCount.value = payload.count;
  }

  function updateCodeChanges(payload: CodeChangedPayload) {
    // update last changes to prevent update event loop
    latestUpdate.value = payload.changes;

    const { selection, changes } = payload;

    // apply new changes to editor
    view.value?.dispatch({
      changes: {
        from: 0,
        to: view.value.state.doc.length,
        insert: Text.of(changes),
      },
      selection: {
        anchor: selection.ranges[0].anchor,
        head: selection.ranges[0].head,
      },
    });
  }

  function updateSettings() {
    initExtensions();
    updateLanguage(selectedLanguage.value);
    updateTheme(selectedTheme.value);
    updateTabSize(tabSize.value);
    settingsDialog.value = false;
  }

  function initExtensions() {
    extensions.value = [];
    extensions.value.push(updateListener);
    extensions.value.push(syntaxHighlighting(defaultHighlightStyle));
    extensions.value.push(
      keymap.of([
        ...defaultKeymap,
        { key: "Tab", preventDefault: true, run: insertTab },
      ])
    );
  }

  return {
    view,
    code,
    count,
    route,
    themes,
    tabSize,
    getRoomId,
    languages,
    extensions,
    updateTheme,
    doubleCount,
    latestUpdate,
    selectedTheme,
    updateTabSize,
    initExtensions,
    updateLanguage,
    settingsDialog,
    updateSettings,
    selectedLanguage,
    participantsCount,
    updateCodeChanges,
    updateParticipants,
  };
});
