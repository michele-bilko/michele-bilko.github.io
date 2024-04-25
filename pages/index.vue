<template>
  <main>
    <div>Hello World!</div>
    <div>
      My name is Michele Bilko 
      <span ref="typeWriter"></span>
      <Transition name="blink">
        <span v-if="typingStatus">_</span>
      </Transition>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, Transition } from 'vue';

// Sleep using setTimeout and promise:
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main text blinking:
const typingStatus = ref(true);
const staticTypingCursor = ref(false);

function typingBlink() {
  if (!staticTypingCursor.value) {
    typingStatus.value = !typingStatus.value;
  } else {
    typingStatus.value = true;
  }
}

// Typewriter functionality:
const typeList = ref(["Computer Science Student @ Boston University", "Independent Game Dev", "Junior Web Dev"]);
const typeWriter = ref(null);

async function typeWord(word) {
  if (typeWriter.value) {
    for (let i = 0; i < word.length; i++) {
      typeWriter.value.$el.innerText += word.charAt(i);
      await sleep(100);
    }
    staticTypingCursor.value = false;
    typingBlink();
    await sleep(5000);
    staticTypingCursor.value = true;
    typingStatus.value = true;
    for (let i = 0; i < word.length; i++) {
      typeWriter.value.$el.innerText = typeWriter.value.$el.innerText.substring(0, typeWriter.value.$el.innerText.length - 1);
      await sleep(100);
    }
  } else {
    setTimeout(typeWord, 200, word);
  }
}

async function type() {
  for (const word of typeList.value) {
    staticTypingCursor.value = true;
    await typeWord(word + ".");
    staticTypingCursor.value = false;
    typingBlink();
    await sleep(500);
  }
}

// Do the thing :)
onMounted(() => {
  setInterval(typingBlink, 600);
  type();
});
</script>

<style scoped>
/* Blink animation */
.blink-enter-active,
.blink-leave-active {
  transition: opacity 0.6s ease;
}

.blink-enter-from,
.blink-leave-to {
  opacity: 0;
}

main {
  word-break: break-all;
  font-size: 2rem;
}
</style>
