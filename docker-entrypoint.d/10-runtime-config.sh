#!/bin/sh
set -eu

runtime_dir="${APP_RUNTIME_CONFIG_DIR:-/var/www/website/runtime-config}"
runtime_file="${runtime_dir}/env.js"
legacy_file="${APP_LEGACY_RUNTIME_CONFIG_FILE:-/var/www/website/env.js}"

mkdir -p "${runtime_dir}"

write_runtime_config() {
	target_file="$1"
	temporary_file="${target_file}.tmp.$$"

	{
		printf '%s\n' '(function (global) {'
		printf '%s\n' '  var config = {};'

		env | sort | while IFS='=' read -r key value; do
			case "${key}" in
				APP_CONFIG_*)
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
