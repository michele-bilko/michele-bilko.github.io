<template>
  <main>
    <Title>About Me</Title>
    <p>The first program I ever wrote was a "game" made of if else blocks in python at age 13. Since then, I've improved a bit (I think).</p>

    <section class="columns">
      <div class="column">
        <h2>Education</h2>
        <p>Boston University: </p>
        <p>University of California, Santa Cruz: </p>
        <p>Bergen County Academies: </p>
      </div>
      <div class="column">
        <h2>Experience</h2>
        <p>Columbia University Media Center for Art History: Intern</p>

      </div>
      <div class="column">
        <h2>Languages</h2>
        <p>Proficient: Python (TensorFlow, PyTorch), Javascript (Vue, Node, React), Java, HTML & CSS, SQL, C#</p>
        <p>Intermediate: C, C++, C#, Bash/Shell Scripting</p>
      </div>
    </section>
  </main>
</template>

<style scoped>
main {
  overflow-y: auto;
  font-size: 1rem;
}

.columns {
  display: flex;
}

.column {
  flex: 1;
  padding: 0 10px;
}

.column h2 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}
</style>
