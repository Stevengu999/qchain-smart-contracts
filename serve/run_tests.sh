#!/bin/bash
list_descendants () {
  local children=$(ps -o pid= --ppid "$1")

  for pid in $children
  do
    list_descendants "$pid"
  done

  echo "$children"
}

shutdown() {
  kill $(list_descendants $$) &> /dev/null
}

./serve/run_testrpc.sh &> /dev/null  &
yarn run truffle compile
yarn run truffle test ./test/owned.js ./test/qchain_token.js
shutdown &> /dev/null
trap 'shutdown' SIGINT SIGTERM EXIT
