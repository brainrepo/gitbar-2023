import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

import image from "@astrojs/image";

// https://astro.build/config
export default defineConfig({
	site: 'https://www.gitbar.it',
  integrations: [react(), tailwind(), image({
    serviceEntryPoint: '@astrojs/image/sharp'
  })],
});
