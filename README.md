This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

## Connect to the database

Follow [the documentation](https://supabase.com/docs/guides/local-development) to set it up.

### Locally

You need to have docker desktop installed on your computer.

```
# Run the docker container
npx supabase start

# Access database via Supabase Studio
http://localhost:54323
```

### Migrations

For now we have to write our migrations manually, you can use the following commands to create & run migrations:

```
npm run migration:create
npm run migration:run
```

### On production environment

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Auto-deploy

The app can be found at https://kbj-la-meujie-v2-a4hn.vercel.app/.
Any push/merge to master will trigger it automatically.
