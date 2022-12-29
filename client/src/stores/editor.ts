import { basicSetup } from 'codemirror';
import { barf, clouds, cobalt, dracula, coolGlow, tomorrow, rosePineDawn } from 'thememirror';
import { ref, shallowRef } from 'vue';
import { defineStore } from 'pinia';
import { useRoute } from 'vue-router';
import { oneDark } from '@codemirror/theme-one-dark';
import { Compartment, EditorState, Text } from '@codemirror/state';
import { defaultKeymap, insertTab } from '@codemirror/commands';
import updateListener from '@/plugins/codemirror/extension/update-listener';
import type { CodeChangedPayload, ParticipantsPayload } from '@/types';
import { EditorView, keymap, highlightActiveLineGutter } from '@codemirror/view';

export const useEditorStore = defineStore('editor', () => {
  const languages = [
    { title: 'JavaScript', ext: 'js' },
    { title: 'HTML', ext: 'html' },
    { title: 'CSS', ext: 'css' },
    { title: 'C++', ext: 'cpp' },
    { title: 'python', ext: 'py' },
    { title: 'Rust', ext: 'rs' },
    { title: 'SQL', ext: 'sql' },
  ];

  const themes = [
    { title: 'Tomorrow', module: tomorrow },
    { title: 'Rosé Pine Dawn', module: rosePineDawn },
    { title: 'Barf', module: barf },
    { title: 'Dracula', module: dracula },
    { title: 'Cobalt', module: cobalt },
    { title: 'CoolGlow', module: coolGlow },
    { title: 'Clouds', module: clouds },
    { title: 'One Dark', module: oneDark },
  ];

  const extensions = ref();
  const view = shallowRef<EditorView>();
  const state = shallowRef<EditorState>();

  const tabSize = new Compartment();
  const tabSizeNumber = ref(4);

  const route = useRoute();
  const latestUpdate = ref(['']);
  const participantsCount = ref(1);
  const settingsDialog = ref(false);

  // set default theme
  const selectedTheme = ref(themes[7].title);
  const theme = new Compartment();

  // set default language
  const selectedLanguage = ref(languages[0].title);
  const language = new Compartment();

  const getRoomId = () => route.params.roomId as string;

  function updateTabSize(size: number) {
    view.value?.dispatch({
      effects: tabSize.reconfigure(EditorState.tabSize.of(size)),
    });
  }

  function updateTheme(selected: string) {
    const newThemen = themes.find((theme) => theme.title === selected)!;
    // extensions.value?.push(theme.module);

    view.value?.dispatch({ effects: theme.reconfigure(newThemen.module) });

    return newThemen.module;
    // extensions.value?.push(theme.module);
  }

  async function updateLanguage(selected: string) {
    const lang = languages.find((lang) => lang.title === selected)!;

    // https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
    const langModule = await import(`../plugins/codemirror/syntaxt/${lang.ext}.ts`);

    view.value?.dispatch({
      effects: language.reconfigure(langModule.default),
    });
    return langModule.default;
  }

  function updateParticipants(payload: ParticipantsPayload) {
    participantsCount.value = payload.count;
  }

  function updateCodeChanges(payload: CodeChangedPayload) {
    // update last changes to prevent update event loop
    latestUpdate.value = payload.changes;
    console.log(payload);

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
    updateLanguage(selectedLanguage.value);
    updateTheme(selectedTheme.value);
    updateTabSize(tabSizeNumber.value);
    settingsDialog.value = false;
  }

  async function initExtensions() {
    const lang = await updateLanguage(selectedLanguage.value);

    state.value = EditorState.create({
      extensions: [
        basicSetup,
        // listen to editor changes
        updateListener,
        // set dfefault language
        language.of(lang),
        highlightActiveLineGutter(),
        // set default theme
        theme.of(updateTheme(selectedTheme.value)),
        tabSize.of(EditorState.tabSize.of(tabSizeNumber.value)),
        keymap.of([...defaultKeymap, { key: 'Tab', preventDefault: true, run: insertTab }]),
      ],
    });

    view.value = new EditorView({
      state: state.value,
      parent: document.querySelector('.container')!,
    });

    view.value.focus();
  }

  return {
    view,
    state,
    route,
    themes,
    getRoomId,
    languages,
    extensions,
    updateTheme,
    latestUpdate,
    tabSizeNumber,
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
