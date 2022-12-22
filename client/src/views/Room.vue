<script setup lang="ts">
import { onMounted } from 'vue';
import { mdiEye } from '@mdi/js';
import { RoomEvents, type JoinAck, type JoinPayload } from '../types';
import { useEditorStore } from '@/stores/editor';
import router from '../router';
import socket from '../socket';
import SidePanel from '@/components/SidePanel.vue';

const store = useEditorStore();

onMounted(() => {
  store.initExtensions();
  initRoomSocket();
});

function joinToRoom() {
  // create payload for joining
  const payload: JoinPayload = { roomId: store.getRoomId() };
  // fire join event with payload nad handle acknowledgement
  socket.emit(RoomEvents.JOIN, payload, handleJoinAck);
}

function handleJoinAck(ack: JoinAck) {
  // update url path
  router.replace({ name: store.route.name!, params: { roomId: ack.roomId } });

  // if changes exist, apply
  if (ack.changes) store.updateCodeChanges(ack.changes);
}

function initRoomSocket() {
  socket.connect();
  joinToRoom();
  socket.on(RoomEvents.PARTICIPANTS, store.updateParticipants);
  socket.on(RoomEvents.CODE_CHANGES, store.updateCodeChanges);
}

function onClickContainer() {
  store.view?.focus();
}
</script>

<template>
  <main>
    <v-row no-gutters style="min-height: 94vh">
      <v-col style="position: relative" @click="onClickContainer" cols="10" sm="11">
        <v-card class="container" height="90vh"> </v-card>
        <div class="participants d-flex justify-center align-center">
          <v-icon color="black" :icon="mdiEye"></v-icon>
          <span class="ma-1 font-weight-bold">
            {{ store.participantsCount }}
          </span>
          <v-tooltip activator="parent" location="start"> Participants </v-tooltip>
        </div>
      </v-col>
      <v-col cols="2" sm="1" class="d-flex flex-column align-center">
        <SidePanel />
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
  font-family: 'Fira Code', sans-serif !important;
  word-wrap: break-word;
}
.participants {
  position: absolute;
  right: 0;
  top: -30px;
  z-index: 2;
}
</style>
