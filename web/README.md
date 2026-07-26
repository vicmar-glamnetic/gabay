# Gabay — landing page

Static landing page for the Gabay app. Three files, no build step, no framework,
no dependencies. This is the public page an App Builders PH submission needs.

## Deploy

```bash
cd web
npx vercel login      # once
npx vercel --prod
```

Vercel serves this directory as-is. There is nothing to build, so there is no
build command and no output directory to configure.

## Before you deploy

Open `index.html` and fill in the `LINKS` object near the bottom:

```js
var LINKS = {
  web:  "",   // where the Expo web build is hosted
  repo: "",   // the GitHub repo
};
```

Anything left blank renders visibly disabled instead of as a working link. That
is deliberate — a dead download button on a launch page costs more than a missing
one.

## Hosting the app itself

The landing page and the app are two separate deployments.

```bash
cd ..                     # repo root
npm run build:web         # Expo static export -> dist/
npx vercel deploy dist --prod
```

Then paste that URL into `LINKS.web` and redeploy this page.

They are kept separate because the Expo export writes absolute asset paths, so
serving it from a subdirectory of this site would need a `baseUrl` change in
`app.json` and a rebuild.

## Store links

The iOS and Android tiles are marked "in review" and are not links. Replace the
`<span class="dl disabled">` blocks with anchors once the listings are live.
