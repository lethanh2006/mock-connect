#!/bin/sh
set -eu

env_file="${APP_RUNTIME_CONFIG_FILE:-/var/www/website/env.js}"
tmp_file="${env_file}.tmp"

{
	printf '%s\n' 'window.__APP_CONFIG__ = window.__APP_CONFIG__ || {};'
	env | sort | while IFS='=' read -r key value; do
		case "$key" in
			APP_CONFIG_*)
				escaped_value=$(printf '%s' "$value" | sed "s/\\\\/\\\\\\\\/g; s/'/\\\\'/g")
				printf "window.__APP_CONFIG__['%s']='%s';\n" "$key" "$escaped_value"
				printf "window.%s=window.__APP_CONFIG__['%s'];\n" "$key" "$key"
				;;
		esac
	done
} > "$tmp_file"

mv "$tmp_file" "$env_file"
