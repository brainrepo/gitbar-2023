import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

import image from "@astrojs/image";
import lyra from "./src/plugins/lyra"

// https://astro.build/config
export default defineConfig({
	site: 'https://www.gitbar.it',
  integrations: [react(), tailwind(), lyra(), image({
    serviceEntryPoint: '@astrojs/image/sharp'
  })],
});
