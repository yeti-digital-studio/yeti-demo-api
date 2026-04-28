FROM node:22-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && pnpm install --frozen-lockfile

COPY tsconfig.json index.ts ./
RUN pnpm build

EXPOSE 8080

CMD ["node", "dist/index.js"]
