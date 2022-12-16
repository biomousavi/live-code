import socket from "@/socket";
import { RoomEvents, type CodeChangedPayload } from "@/types";
import { Text } from "@codemirror/state";
import { EditorView, ViewUpdate } from "@codemirror/view";
import { useEditorStore } from "@/stores/editor";

export default EditorView.updateListener.of((v: ViewUpdate) => {
  const store = useEditorStore();
  if (v.docChanged && !v.state.doc.eq(Text.of(store.latestUpdate))) {
    const payload: CodeChangedPayload = {
      roomId: store.getRoomId(),
      changes: v.state.doc,
      selection: v.state.selection,
    };
    socket.emit(RoomEvents.CODE_CHANGED, payload);
  }
});
