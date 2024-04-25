<script setup>
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - michele-bilko` : 'michele-bilko';
  }
})

</script>

<template>
  <div class="root">
  <header>
    <div>
      <span><NuxtLink to="/">$ home</NuxtLink></span>
      <span><NuxtLink to ="/aboutme">aboutMe();</NuxtLink></span>
      <span><NuxtLink to="/projects">myWebProjects();</NuxtLink></span>
      <span><NuxtLink to="/contact">ContactMe();</NuxtLink></span>
      <a href="/Michele_Bilko_Resume.pdf" target="_blank" download="Michele_Bilko_Resume.pdf">download(myResume)</a>
    </div>
  </header>
  <NuxtPage />
  <footer></footer>
  </div>
</template>
<style>
:root {
  --background-color: #0F0326;
  --text-color: #F9F9F9;
  --link-color: #9EABBD;
}

* {
  box-sizing: border-box;
  scrollbar-color: #9EABBD transparent;
}

::-webkit-scrollbar {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #9EABBD;
}

body {
  margin: 0;
  user-select: none;
  font-family: monospace;
  font-size: 32px;
}


.root {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-wrap: nowrap;
  margin: 9px;
  border-radius: 20px;
  background: var(--background-color);
  color: var(--text-color);
  padding: 30px;
  overflow-y: auto;
  padding-top: 0;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: var(--background-color);
  margin-top: 30px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
}

header img {
  width: 2em;
  color: var(--text-color);
}

header div {
  display: flex;
  font-size: 1rem;
  flex-wrap: wrap;
}

header div > span {
  margin-right: 3em;
  margin-bottom: 0.5rem;
}

a {
  color: var(--link-color);
  text-decoration: none;
}

a:hover {
  cursor: pointer;
  color: var(--text-color);
}
</style>