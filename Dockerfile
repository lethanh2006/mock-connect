# 1. For build React app
FROM node:22-alpine AS development


# Set environment variables
ENV APP_CONFIG_IP_ROOT=https://uat-apigw.vinuni.edu.vn/
ENV APP_CONFIG_ONE_SIGNAL_ID=
ENV APP_CONFIG_SENTRY_DSN=
ENV APP_CONFIG_KEYCLOAK_AUTHORITY=https://one-sso.vinuni.edu.vn/realms/vinuni
ENV APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID=vinuni-
ENV APP_CONFIG_APP_VERSION=241218.1100

ENV APP_CONFIG_TEN_TRUONG='Trường Đại học VinUni'
ENV APP_CONFIG_TIEN_TO_TRUONG='Trường'
ENV APP_CONFIG_TEN_TRUONG_VIET_TAT_TIENG_ANH='VIN'
ENV APP_CONFIG_PRIMARY_COLOR='#134D8B'
ENV APP_CONFIG_HIGHLIGHT_COLOR='#C72127'

ENV APP_CONFIG_URL_LANDING=https://vinuni.edu.vn/
ENV APP_CONFIG_URL_CONNECT=https://one.vinuni.edu.vn/student/
ENV APP_CONFIG_URL_CAN_BO=https://canbo.vinuni.edu.vn/
ENV APP_CONFIG_URL_DAO_TAO=https://one.vinuni.edu.vn/qldt/
ENV APP_CONFIG_URL_NHAN_SU=https://one.vinuni.edu.vn/to-chuc-nhan-su/
ENV APP_CONFIG_URL_TAI_CHINH=https://taichinh.vinuni.edu.vn/
ENV APP_CONFIG_URL_CTSV=https://one.vinuni.edu.vn/cong-tac-sinh-vien/
ENV APP_CONFIG_URL_QLKH=https://qlkh.vinuni.edu.vn/
ENV APP_CONFIG_URL_VPS=https://vanphong.vinuni.edu.vn/
ENV APP_CONFIG_URL_KHAO_THI=https://khaothi.vinuni.edu.vn/
ENV APP_CONFIG_URL_CORE=https://core.vinuni.edu.vn/
ENV APP_CONFIG_URL_CSVC=https://one.vinuni.edu.vn/co-so-vat-chat/
ENV APP_CONFIG_URL_THU_VIEN=https://thuvien.vinuni.edu.vn/
ENV APP_CONFIG_URL_QLVB=https://sso.vinuni.edu.vn/realms/vinuni/protocol/openid-connect/auth?response_type=token&client_id=vinuni-odoo-qlvb&redirect_uri=http%3A%2F%2Fqlvb.vinuni.edu.vn%2Fauth_oauth%2Fsignin&scope=profile+openid+email&state=%7B%22d%22%3A+%22qlvb1%22%2C+%22p%22%3A+4%2C+%22r%22%3A+%22http%253A%252F%252Fqlvb.vinuni.edu.vn%252Fweb%22%7D
ENV APP_CONFIG_URL_VBCC=https://vbcc.vinuni.edu.vn/
ENV APP_CONFIG_URL_QLND=https://iam.vinuni.edu.vn/
ENV APP_CONFIG_URL_TAP_CHI_KH=https://tapchikhoahoc.vinuni.edu.vn/

ENV APP_CONFIG_INIT_TRINH_DO=7
ENV APP_CONFIG_INIT_HINH_THUC=1
ENV APP_CONFIG_KE_HOACH_NAM_HIGHLIGHT_TUAN=5,8,10,12,15
ENV APP_CONFIG_MOODLE_ENDPOINT=''
ENV APP_CONFIG_INIT_MA_NHOM_TIET_HOC=G
ENV APP_CONFIG_SO_TIN_CHI_HOC_KY_MIN=14
ENV APP_CONFIG_SO_TIN_CHI_HOC_KY_MAX=24
ENV APP_CONFIG_BASE_PATH=/cong-tac-sinh-vien/

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
