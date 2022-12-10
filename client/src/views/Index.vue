<script setup lang="ts">
import { defineAsyncComponent } from "vue";

const ShowcaseCard = defineAsyncComponent(
  () => import("@/components/ShowcaseCard.vue")
);

const useCases = [
  {
    title: "Code with your team",
    img: "/1.png",
    desc: "Open a Codeshare editor, write or copy the code, then share it with friends and colleagues. Pair program and troubleshoot together.",
  },
  {
    title: "Interview developers",
    img: "/2.png",

    desc: "Set coding tasks and observe in real-time when interviewing remotely or in person. Nobody likes writing code on a whiteboard.",
  },
  {
    title: "Teach people to program",
    img: "/3.png",
    desc: "Share your code with students and peers then educate them. Universities and colleges around the world use Codeshare every day.",
  },
];
</script>

<template>
  <main>
    <div class="showcase d-flex flex-column align-center">
      <div style="z-index: 1" class="d-flex flex-column align-center">
        <h1 class="text-h6 text-md-h3 font-weight-bold mt-12 quicksand">
          Share the code in real-time
        </h1>

        <p class="text-caption text-md-subtitle-1 my-5">
          A lightweight and real-time code editor in your browser.
        </p>
        <v-btn color="black" to="/new" class="font-weight-bold" rounded="lg">
          Get started
        </v-btn>

        <p class="my-4 text-caption">It's Free !</p>
      </div>

      <dotlottie-player
        src="/FIVd9i7InI.lottie"
        background="transparent"
        class=""
        speed="1"
        loop
        autoplay
      ></dotlottie-player>
    </div>

    <div class="d-flex flex-wrap justify-space-around py-10 my-16">
      <template v-for="useCase in useCases" :key="useCase.title">
        <ShowcaseCard :data-image="useCase.img">
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

<style scoped>
dotlottie-player {
  width: 100%;
  height: 90vh;
  position: absolute;
  left: -6%;
  bottom: -4%;
}
.showcase {
  position: relative;
  min-height: 100vh;
}

@media (max-width: 640px) {
  dotlottie-player {
    bottom: -14%;
  }
  .showcase {
    min-height: 80vh;
  }
}
</style>
