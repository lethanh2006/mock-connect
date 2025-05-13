# 1. For build React app
FROM node:16-alpine AS development


# Set environment variables
ENV APP_CONFIG_IP_ROOT=https://gw.ufm.edu.vn/
ENV APP_CONFIG_ONE_SIGNAL_ID=
ENV APP_CONFIG_SENTRY_DSN=
ENV APP_CONFIG_KEYCLOAK_AUTHORITY=https://sso.ufm.edu.vn/realms/ufm
ENV APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID=ufm-
ENV APP_CONFIG_APP_VERSION=250513.1045

ENV APP_CONFIG_CO_QUAN_CHU_QUAN='Bộ Tài Chính'
ENV APP_CONFIG_TEN_TRUONG='Trường đại học Tài chính - Marketing'
ENV APP_CONFIG_TIEN_TO_TRUONG='Trường'
ENV APP_CONFIG_TEN_TRUONG_VIET_TAT_TIENG_ANH=UFM
ENV APP_CONFIG_PRIMARY_COLOR="#14468c"

ENV APP_CONFIG_URL_LANDING=https://ufm.edu.vn/
ENV APP_CONFIG_URL_CONNECT=https://sinhvien1.ufm.edu.vn/
ENV APP_CONFIG_URL_CAN_BO=https://canbo.ufm.edu.vn/
ENV APP_CONFIG_URL_DAO_TAO=https://qldt.ufm.edu.vn/
ENV APP_CONFIG_URL_NHAN_SU=https://tcns.ufm.edu.vn/
ENV APP_CONFIG_URL_TAI_CHINH=https://taichinh.ufm.edu.vn/
ENV APP_CONFIG_URL_CTSV=https://ctsv.ufm.edu.vn/
ENV APP_CONFIG_URL_QLKH=https://qlkh.ufm.edu.vn/
ENV APP_CONFIG_URL_VPS=https://vps.ufm.edu.vn/
ENV APP_CONFIG_URL_KHAO_THI=https://khaothi.ufm.edu.vn/
ENV APP_CONFIG_URL_CORE=https://core.ufm.edu.vn/
ENV APP_CONFIG_URL_CSVC=https://csvc.ufm.edu.vn/
ENV APP_CONFIG_URL_THU_VIEN=
ENV APP_CONFIG_URL_QLVB=https://qlvb.ufm.edu.vn/

ENV APP_CONFIG_TITLE_LANDING='Cổng thông tin'
ENV APP_CONFIG_TITLE_CONNECT='Cổng người học'
ENV APP_CONFIG_TITLE_CAN_BO='Cổng cán bộ'
ENV APP_CONFIG_TITLE_DAO_TAO='Quản lý đào tạo'
ENV APP_CONFIG_TITLE_NHAN_SU='Tổ chức nhân sự'
ENV APP_CONFIG_TITLE_TAI_CHINH='Tài chính'
ENV APP_CONFIG_TITLE_CTSV='Công tác sinh viên'
ENV APP_CONFIG_TITLE_QLKH='Quản lý khoa học'
ENV APP_CONFIG_TITLE_VPS='Văn phòng điều hành'
ENV APP_CONFIG_TITLE_KHAO_THI='Khảo thí'
ENV APP_CONFIG_TITLE_CORE='Danh mục chung'
ENV APP_CONFIG_TITLE_CSVC='Cơ sở vật chất'
ENV APP_CONFIG_TITLE_THU_VIEN='Thư viện'
ENV APP_CONFIG_TITLE_QLVB='Quản lý văn bản'


# Set working directory
WORKDIR /app

COPY package.json yarn.lock /app/
RUN yarn install

COPY . /app

FROM development AS build
RUN yarn build

FROM nginx:alpine
COPY --from=build /app/.nginx/nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /var/www/website

RUN rm -rf ./*
COPY --from=build /app/dist .
ENTRYPOINT ["nginx", "-g", "daemon off;"]
