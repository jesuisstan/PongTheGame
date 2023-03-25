#!/usr/bin/env bash

# set -x

abort() {
    printf -- "$@"
    exit 1
}

if [[ -f .env ]]; then
    abort '.env already exists\n'
fi

declare -a new_env

while read -r line; do

    # skip empty lines and comments
    if [[ -z "${line}" ]] || [[ "$(echo "${line}" | cut -c 1-1)" = '#' ]]; then
        continue
    fi

    key="$(echo "${line}" | sed 's/\(.*\)=\(.*\)/\1/')"
    default_value="$(eval '$'"${key}")"

    if [[ -z "${default_value}" ]]; then
        default_value="$(echo "${line}" | sed 's/\(.*\)=\(.*\)/\2/')"
    fi

    prompt="${key}"

    if [[ -n "${default_value}" ]]; then
        prompt="${prompt} (${default_value})"
    fi

    printf -- '%s: ' "${prompt}"
    read -r -u 1 value

    if [[ -z "${value}" ]]; then
        value="${default_value}"
    fi

    new_env[${#new_env[@]}]="${key}=${value}"

done < .env.example

printf -- '%s\n' "${new_env[@]}" > .env
