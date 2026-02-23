<template>
  <vue-particles id="tsparticles" :options="options" />
</template>

<script setup>
const options = {
  background: {
    color: { value: "#160721" },
  },

  fullScreen: { enable: false },

  fpsLimit: 60,

  particles: {
    number: {
      value: 180,
      density: {
        enable: true,
        area: 800, // particles.js: value_area
      },
    },

    color: { value: "#ffffff" },

    shape: {
      type: "circle",
      stroke: {
        width: 0,
        color: "#ff0836",
      },
      polygon: {
        sides: 5, // particles.js: nb_sides
      },
      image: {
        src: "img/github.svg",
        width: 100,
        height: 100,
      },
    },

    opacity: {
      value: 0.5,
      random: {
        enable: false, // particles.js: random: false
      },
      animation: {
        enable: false,
        speed: 1,
        minimumValue: 0.1, // particles.js: opacity_min
        sync: false,
      },
    },

    size: {
      value: { min: 1, max: 3 }, // particles.js: value: 3 + random: true
      random: {
        enable: true,
      },
      animation: {
        enable: false,
        speed: 40,
        minimumValue: 0.1, // particles.js: size_min
        sync: false,
      },
    },

    links: {
      enable: false, // particles.js: line_linked.enable
      distance: 150,
      color: "#ffffff",
      opacity: 0.4,
      width: 1,
    },

    move: {
      enable: true,
      speed: 3,
      direction: "none",
      random: false,
      straight: false,
      outModes: {
        default: "out", // particles.js: out_mode
      },
      bounce: false,
      attract: {
        enable: false,
        rotate: {
          x: 600, // particles.js: rotateX
          y: 1200, // particles.js: rotateY
        },
      },
    },
  },

  interactivity: {
    detectsOn: "window",
    events: {
      onHover: {
        enable: true,
        mode: "repulse",
      },
      onClick: {
        enable: true,
        mode: "push",
      },
      resize: true,
    },
    modes: {
      grab: {
        distance: 400,
        links: {
          opacity: 1, // particles.js: line_linked.opacity
        },
      },
      bubble: {
        distance: 400,
        size: 40,
        duration: 2,
        opacity: 8,
        speed: 3,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
      push: {
        quantity: 4, // particles.js: particles_nb
      },
      remove: {
        quantity: 2, // particles.js: particles_nb
      },
    },
  },

  detectRetina: true, // particles.js: retina_detect
};
</script>

<style scoped>
#tsparticles {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
</style>
