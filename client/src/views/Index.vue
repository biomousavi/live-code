<script setup lang="ts">
import { defineAsyncComponent } from "vue";

const ShowcaseCard = defineAsyncComponent(
  () => import("@/components/ShowcaseCard.vue")
);

const useCases = [
  {
    title: "Code with your team",
    desc: "Open a Codeshare editor, write or copy the code, then share it with friends and colleagues. Pair program and troubleshoot together.",
  },
  {
    title: "Interview developers",
    desc: "Set coding tasks and observe in real-time when interviewing remotely or in person. Nobody likes writing code on a whiteboard.",
  },
  {
    title: "Teach people to program",
    desc: "Share your code with students and peers then educate them. Universities and colleges around the world use Codeshare every day.",
  },
];
</script>

<template>
  <main>
    <div
      style="position: relative; min-height: 100vh"
      class="d-flex flex-column align-center"
    >
      <div style="z-index: 1" class="d-flex flex-column align-center">
        <h1 class="text-h3 font-weight-bold mt-12 quicksand">
          Share the code in real-time
        </h1>

        <p class="my-5">
          A lightweight and real-time code editor in your browser.
        </p>
        <v-btn color="black" class="font-weight-bold" rounded="lg">
          Get started
        </v-btn>
      </div>

      <dotlottie-player
        src="/FIVd9i7InI.lottie"
        background="transparent"
        speed="1"
        style="
          width: 100%;
          height: 100vh;
          position: absolute;
          left: -6%;
          bottom: -4%;
          transform: scale(1.1);
        "
        loop
        autoplay
      ></dotlottie-player>
    </div>

    <div class="d-flex flex-wrap justify-space-around py-10 my-16">
      <template v-for="useCase in useCases" :key="useCase.title">
        <ShowcaseCard>
          <template v-slot:header>
            <h3 class="font-weight-bold">{{ useCase.title }}</h3>
          </template>
          <template v-slot:content>
            <p>{{ useCase.desc }}</p>
          </template>
        </ShowcaseCard>
      </template>
    </div>
  </main>
</template>
