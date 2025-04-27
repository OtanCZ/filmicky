Svelte kit app for managing and rating movies, university semester project made over the weekend held together with duct tape.

## Developing

```bash
add mysql url to .env file
npm i
prisma db push
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
