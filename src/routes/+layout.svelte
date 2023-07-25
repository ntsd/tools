<script lang="ts">
  import '../app.css';
  import '@carbon/charts-svelte/styles.css'

  import Footer from '../components/layout/Footer.svelte';
  import Navbar from '../components/layout/Navbar.svelte';

  if ('serviceWorker' in navigator) {
    addEventListener('load', function () {
      navigator.serviceWorker.register('./service-worker.js');
    });
  }
</script>

<div class="flex flex-col min-h-screen">
  <Navbar />
  <div class="flex-grow container mx-auto justify-items-center">
    <slot />
  </div>
  <Footer />
</div>
