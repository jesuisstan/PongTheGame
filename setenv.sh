#!/usr/bin/env bash

function __usage() {
    printf -- 'Usage: setenv.sh <dev[elopment]|prod[uction]>\n' >&2
    exit 1
}

if [[ $# != 1 ]]; then
    __usage
fi

case "$1" in
    dev|development)
        new_env=.env.development
        env_name=development
        ;;
    prod|production)
        new_env=.env.production
        env_name=production
        ;;
    *)
        __usage
        ;;
esac

current_env="$(readlink .env)"

if [[ "${current_env}" = "${new_env}" ]]; then
    printf -- 'Already in %s environment\n' "${env_name}"
elif ! [[ -f "${new_env}" ]]; then
    printf -- 'No such file: %s\n' "${new_env}" >&2
    exit 2
else
    rm -vf .env
    ln -vs "${new_env}" .env
fi
