import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

import image from "@astrojs/image";
import lyraInEpisode from "./src/plugins/lyra_in_episode"

// https://astro.build/config
export default defineConfig({
	site: 'https://www.gitbar.it',
  integrations: [react(), tailwind(),  lyraInEpisode(), image({
    serviceEntryPoint: '@astrojs/image/sharp'
  })],
});
