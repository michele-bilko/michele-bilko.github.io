<template>
    <main>
      <Title>Projects</Title>
      <div class="project">
        <NuxtLink to="https://replit.com/@MicheleBilko/History">
          <img loading="lazy" src="static/images/first_website.png" alt="first_website">
          My First Website
        </NuxtLink>
        <p>I had just learned the basics of web dev and decided to make my first website for a history project! I've learned a lot more about web dev since then, I've also learned to deploy.</p>
      </div>
      <div class="project">
        <NuxtLink to="https://michele-bilko.github.io/NYAMUN/index.html">
          <img loading="lazy" src="static/images/NYAMUN_site.png" alt="NYAMUN_website">
          NYAMUN's Website
        </NuxtLink>
        <p>My first freelance site! Created for the New York Area Model United Nations virtual conference in 2020 and my first time using version control through git.</p>
      </div>
      <div class="project">
        <NuxtLink to="https://github.com/michele-bilko/theater-organizer">
          <img loading="lazy" src="static/images/theater_organizer.png" alt="theater_organizer">
          Senior Capstone Closet Organizer
        </NuxtLink>
        <p>Created as a capstone project for the theater group at my highschool. We created an easy to use website to find, rent, and upload new costumes using google sheets as our database.</p>
      </div>
      
      <!-- Add more projects here -->
    </main>
  </template>
  
  <style scoped lang="scss">
  main {
    font-size: 1.4rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 1rem;
  
    .project {
      flex-basis: calc(33.33% - 20px); /* Each project takes up 33.33% of the available width with some spacing */
      margin-bottom: 20px; /* Spacing between each project */
      text-align: center; /* Center text within each project */
    }
  
    .project img {
      width: 100%; /* Make the image fill its container */
      height: 200px;
      margin-bottom: 10px; /* Spacing between the image and the title */
    }
  }
  </style>
  