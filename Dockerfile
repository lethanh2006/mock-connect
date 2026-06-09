# 1. For build React app
FROM node:22-alpine AS development


# Set environment variables
ENV APP_CONFIG_IP_ROOT=https://ais.aisenote.com/sit-vinuni/
ENV APP_CONFIG_ONE_SIGNAL_ID=
ENV APP_CONFIG_SENTRY_DSN=
ENV APP_CONFIG_KEYCLOAK_AUTHORITY=https://ais.aisenote.com/sit/keycloak/realms/sit-vinuni
ENV APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID=sit-vinuni-
ENV APP_CONFIG_APP_VERSION=250513.1045

ENV APP_CONFIG_TEN_TRUONG='Trường Đại học VinUni'
ENV APP_CONFIG_TIEN_TO_TRUONG='Trường'
ENV APP_CONFIG_TEN_TRUONG_VIET_TAT_TIENG_ANH='VINUNI'
ENV APP_CONFIG_PRIMARY_COLOR='#134D8B'
ENV APP_CONFIG_HIGHLIGHT_COLOR='#C72127'
ENV APP_CONFIG_HO_TRO_KY_THUAT=

ENV APP_CONFIG_URL_LANDING=
ENV APP_CONFIG_URL_CONNECT=https://connect-sit.vercel.app/
ENV APP_CONFIG_URL_CAN_BO=https://congcanbo-sit.vercel.app/
ENV APP_CONFIG_URL_DAO_TAO=https://qldt-sit.vercel.app/
ENV APP_CONFIG_URL_NHAN_SU=https://nhansu-sit.vercel.app/
ENV APP_CONFIG_URL_TAI_CHINH=https://taichinh-sit.vercel.app/
ENV APP_CONFIG_URL_CTSV=https://ctsv-sit.vercel.app/
ENV APP_CONFIG_URL_QLKH=https://qlkh-sit.vercel.app/
ENV APP_CONFIG_URL_VPS=https://vanphongso-sit.vercel.app/
ENV APP_CONFIG_URL_KHAO_THI=https://khaothi-sit.vercel.app/
ENV APP_CONFIG_URL_CORE=https://danhmuc-sit.vercel.app/
ENV APP_CONFIG_URL_CSVC=https://csvc-sit.vercel.app/
ENV APP_CONFIG_URL_THU_VIEN=https://thuvien-sit.vercel.app/
ENV APP_CONFIG_URL_QLVB=
ENV APP_CONFIG_URL_VBCC=https://vbcc-sit.vercel.app/
ENV APP_CONFIG_URL_QLND=https://iam-sit.vercel.app/
ENV APP_CONFIG_URL_TAP_CHI_KH=https://tapchi-sit.vercel.app/
ENV APP_CONFIG_URL_KY_SO=

ENV APP_CONFIG_MOODLE_ENDPOINT=''

# Set working directory
WORKDIR /app

COPY package.json yarn.lock /app/
RUN yarn install

COPY . /app

FROM development AS build
RUN cp .env.uat .env.production && yarn build

FROM nginx:alpine
COPY --from=build /app/.nginx/nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /var/www/website

RUN rm -rf ./*
COPY --from=build /app/dist .
ENTRYPOINT ["nginx", "-g", "daemon off;"]
