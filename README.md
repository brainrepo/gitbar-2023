# Gitbar Podcast website

Questo sito รจ il nuovo sito di gitbar.
Attinge alle informazioni del sito direttamente dal feed RSS saltando tutti i passaggi intermedi verso spreaker.

Qui trovate il branch main in staging: https://www.gitbar.it/

## ๐ Project Structure

Inside of your Astro project, you'll see the following folders and files:

```
/
โโโ public/
โ   โโโ favicon.ico
โ   โโโ assets.png
โโโ src/
โ   โโโ components/
โ   โ   โโโ Card.astro
โ   โโโ layouts/
โ   โ   โโโ Layout.astro
โ   โโโ pages/
โ       โโโ index.astro
โโโ package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## ๐ง Commands

All commands are run from the root of the project, from a terminal:

| Command                | Action                                             |
| :--------------------- | :------------------------------------------------- |
| `npm install`          | Installs dependencies                              |
| `npm run dev`          | Starts local dev server at `localhost:3000`        |
| `npm run build`        | Build your production site to `./dist/`            |
| `npm run preview`      | Preview your build locally, before deploying       |
| `npm run astro ...`    | Run CLI commands like `astro add`, `astro preview` |
| `npm run astro --help` | Get help using the Astro CLI                       |

## ๐ Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
