This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Backups de base de datos

Comando:

```bash
pg_dump \
  --host=localhost \
  --port=5432 \
  --username=myuser \
  --dbname=mydatabase \
  --schema=myschema \
  --file=/path/to/myschema_backup.sql \
  --format=plain \
  --verbose
```

Se pedirá la contraseña.

Ubicación de archivos de backup:

- Google Drive > Finanzas > Backups-MisGestiones

## Correr funciones de API

1. Instalar Vercel CLI

```bash
npm i -g vercel
```

2. Luego ejecutar vercel:

```bash
vercel dev
```

3. Autenticarse a través de la web, siguiendo las instrucciones de la consola. Setear las demás opciones como se ven debajo:

```bash
vercel dev
Vercel CLI 49.1.1
> NOTE: The Vercel CLI now collects telemetry regarding usage of the CLI.
> This information is used to shape the CLI roadmap and prioritize features.
> You can learn more, including how to opt-out if you'd not like to participate in this program, by visiting the following URL:
> https://vercel.com/docs/cli/about-telemetry
> No existing credentials found. Please log in:

  Visit https://vercel.com/oauth/device?user_code=BSTC-BPML

  Congratulations! You are now signed in.

  To deploy something, run `vercel`.

  💡 To deploy every commit automatically,
  connect a Git Repository (vercel.link/git (https://vercel.link/git)).
? Set up and develop “~\Proyectos\mis-gestiones”? yes
? Which scope should contain your project? Andres Asteasuain projects
? Found project “andres-asetasuains-projects/mis-gestiones”. Link to it? yes
🔗  Linked to andres-asetasuains-projects/mis-gestiones (created .vercel)
? Would you like to pull environment variables now? yes
> Downloading `development` Environment Variables for andres-asetasuains-projects/mis-gestiones
✅  Created .env.local file  [315ms]
> Running Dev Command “next dev --port $PORT”
   ▲ Next.js 15.5.4
   - Local:        http://localhost:3000
   - Network:      http://192.168.1.36:3000
   - Environments: .env.local, .env

 ✓ Starting...
 ✓ Ready in 8.4s
> Ready! Available at http://localhost:3000
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
