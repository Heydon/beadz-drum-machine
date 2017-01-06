<template>
  <div class="portrait-warning">
    <div>
      <h1>Beadz</h1>
      <p>Rotate your screen into a landscape orientation.</p>
    </div>
  </div>
</template>

<style>
* {
  margin: 0;
}

.portrait-warning {
  display: none;
}

@media (orientation: portrait) {

  .portrait-warning {
    display: flex;
    background: #ddd;
    padding: 1.5rem;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin: 0;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

}
</style>
