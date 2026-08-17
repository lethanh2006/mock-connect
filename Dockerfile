# syntax=docker/dockerfile:1.7
ARG BUILD_BASE_IMAGE=jfrog.vinsmartfuture.tech/vsf-shared-docker-virtual/node:22-alpine
ARG NGINX_BASE_IMAGE=jfrog.vinsmartfuture.tech/vsf-shared-docker-virtual/nginx:alpine-slim

FROM ${BUILD_BASE_IMAGE} AS build

WORKDIR /app
COPY package.json yarn.lock /app/
RUN --mount=type=secret,id=jfrog_token,required=true \
    sed -i \
      -e 's#https://registry.yarnpkg.com#https://registry.npmjs.org#g' \
      -e 's#https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz#https://jfrog.vinsmartfuture.tech/artifactory/vsf-shared-generic-remote-sheetjs/xlsx-0.20.3/xlsx-0.20.3.tgz#g' \
      package.json yarn.lock && \
    npm_token="$(tr -d '\r\n' < /run/secrets/jfrog_token)" && \
    test -n "${npm_token}" && \
    printf 'always-auth=true\n//jfrog.vinsmartfuture.tech/:_authToken=%s\n_authToken=%s\n' "${npm_token}" "${npm_token}" > .npmrc && \
    if [ ! -d node_modules ] || [ ! -f /opt/build-base.yarn.lock ] || ! cmp -s yarn.lock /opt/build-base.yarn.lock; then \
      yarn install --frozen-lockfile && yarn cache clean; \
    fi; \
    rc=$?; rm -f .npmrc; exit ${rc}

COPY . /app
RUN yarn build && rm -rf node_modules

FROM ${NGINX_BASE_IMAGE}
COPY --from=build /app/.nginx/nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /var/www/website
RUN rm -rf ./*
COPY --from=build /app/dist .
CMD ["nginx", "-g", "daemon off;"]
