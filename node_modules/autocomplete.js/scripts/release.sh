#!/usr/bin/env bash

function error_exit
{
	echo "release: $1" 1>&2
	exit 1
}

if [[ $# -eq 0 ]] ; then
  error_exit "use ``npm run release [major|minor|patch|x.x.x]``"
fi

currentVersion=$(json -f package.json version)

if [[ $1 != 'patch' && $1 != 'minor' && $1 != 'major' ]]
then
  nextVersion=$1
else
  nextVersion=$(semver $currentVersion -i $1)
fi

semver $nextVersion -r ">$currentVersion" ||
error_exit "Cannot bump from $currentVersion to $nextVersion"

if ! npm owner ls | grep -q "$(npm whoami)"
then
  error_exit "Not an owner of the npm repo, ask for it"
fi

currentBranch=$(git rev-parse --abbrev-ref HEAD)
if [[ $currentBranch != 'master' ]]; then
  error_exit "You must be on master branch"
fi

if [[ -n $(git status --porcelain) ]]; then
  error_exit "Release: Working tree is not clean (git status)"
fi

echo "module.exports = \"${nextVersion}\";" > version.js

yarn &&
mversion $nextVersion &&
yarn build &&
conventional-changelog --infile CHANGELOG.md --same-file --preset angular &&
doctoc --notitle --maxlevel 3 README.md &&
git add README.md CHANGELOG.md package.json bower.json version.js dist/ &&
git commit -m $nextVersion &&
git tag v$nextVersion &&
git push &&
git push --tags &&
npm publish || error_exit "Something went wrong, check log, be careful and start over"
