// cypress.config.js
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Configuraciones adicionales aquí
    },
    baseUrl: "http://localhost:5174",
    supportFile: false,  
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});
