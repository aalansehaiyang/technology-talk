#!/usr/bin/env bash

set -e # exit when error, no verbose

if [ "$TEST_SUITE" == "unit" ]; then
  ./node_modules/karma/bin/karma start --single-run
elif [ "$TRAVIS_SECURE_ENV_VARS" == "true" -a "$TEST_SUITE" == "integration" ]; then
  static -p 8080 &
  sleep 3 &&
  ./node_modules/mocha/bin/mocha --harmony -R spec ./test/integration/test.js
elif [ "$TEST_SUITE" == "examples" ]; then
  yarn docs:netlify
else
  echo "Not running any tests"
fi
