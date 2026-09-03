#!/bin/sh
set -eu

runtime_dir="${APP_RUNTIME_CONFIG_DIR:-/var/www/website/runtime-config}"
runtime_file="${runtime_dir}/env.js"
legacy_file="${APP_LEGACY_RUNTIME_CONFIG_FILE:-/var/www/website/env.js}"

mkdir -p "${runtime_dir}"

is_public_runtime_config_key() {
	case "$1" in
		APP_CONFIG_APP_VERSION|APP_CONFIG_BASE_PATH|APP_CONFIG_CO_QUAN_CHU_QUAN|APP_CONFIG_DON_VI_BAN_GIAM_DOC|APP_CONFIG_HIGHLIGHT_COLOR|APP_CONFIG_INIT_*|APP_CONFIG_IP_ROOT|APP_CONFIG_IP_ROOT_API|APP_CONFIG_IP_ROOT_BY_HOST|APP_CONFIG_KEYCLOAK_AUTHORITY|APP_CONFIG_KE_HOACH_NAM_HIGHLIGHT_TUAN|APP_CONFIG_KHOAN_THU_HOC_PHI|APP_CONFIG_NGUON_THU_CO_DINH|APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID|APP_CONFIG_PRIMARY_COLOR|APP_CONFIG_SO_TIN_CHI_HOC_KY_MIN|APP_CONFIG_SO_TIN_CHI_HOC_KY_MAX|APP_CONFIG_TEN_TRUONG|APP_CONFIG_TEN_TRUONG_VIET_TAT_TIENG_ANH|APP_CONFIG_TIEN_TO_TRUONG|APP_CONFIG_TITLE_*|APP_CONFIG_URL_*) return 0 ;;
		*) return 1 ;;
	esac
}

is_sensitive_runtime_config_key() {
	case "$1" in
		*_TOKEN|*_TOKEN_*|*_PASSWORD|*_PASSWORD_*|*_SECRET|*_SECRET_*|*_PRIVATE_KEY|*_PRIVATE_KEY_*|*_CREDENTIAL|*_CREDENTIAL_*|*_API_KEY|*_API_KEY_*|*_ENCRYPTION_KEY|*_ENCRYPTION_KEY_*|*_SIGNING_KEY|*_SIGNING_KEY_*) return 0 ;;
		*) return 1 ;;
	esac
}

write_runtime_config() {
	target_file="$1"
	temporary_file="${target_file}.tmp.$$"

	{
		printf '%s\n' '(function (global) {'
		printf '%s\n' '  var config = {};'

		env | sort | while IFS='=' read -r key value; do
			case "${key}" in
				APP_CONFIG_*)
					if ! is_public_runtime_config_key "${key}" || is_sensitive_runtime_config_key "${key}"; then
						continue
					fi
					escaped_value=$(printf '%s' "${value}" | sed \
						-e 's/\\/\\\\/g' \
						-e 's/"/\\"/g' \
						-e 's/\r/\\r/g' \
						-e 's/\t/\\t/g')
					printf '  config["%s"] = "%s";\n' "${key}" "${escaped_value}"
					;;
			esac
		done

		printf '%s\n' '  global.__APP_CONFIG__ = global.__APP_CONFIG__ || {};'
		printf '%s\n' '  for (var key in config) {'
		printf '%s\n' '    if (Object.prototype.hasOwnProperty.call(config, key)) {'
		printf '%s\n' '      global.__APP_CONFIG__[key] = config[key];'
		printf '%s\n' '      global[key] = config[key];'
		printf '%s\n' '    }'
		printf '%s\n' '  }'
		printf '%s\n' '})(window);'
	} > "${temporary_file}"

	mv "${temporary_file}" "${target_file}"
}

write_runtime_config "${runtime_file}"

# Keep the legacy path available during the rollout of the runtime-config path.
write_runtime_config "${legacy_file}"
