FROM node:18-alpine as builder

WORKDIR /app

RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory

RUN corepack enable && corepack prepare pnpm@latest --activate
COPY . ./

RUN pnpm install

# service
RUN pnpm build

FROM node:18-alpine as runner
WORKDIR /app
ARG app_folder_name

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/dist .

ENV TZ=Asia/Seoul
ENV PORT=3000
ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "main.js"]
