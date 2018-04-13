#!/bin/sh

# set some environment variables
export REPO=dmopensource/selavi
export TAG=`if [ "$TRAVIS_BRANCH" == "master" ]; then echo "latest"; else echo $TRAVIS_BRANCH ; fi`

# build and tag image
docker build -f Dockerfile -t $REPO:$COMMIT .
docker tag $REPO:$COMMIT $REPO:$TAG
docker tag $REPO:$COMMIT $REPO:travis-$TRAVIS_BUILD_NUMBER

# login and push image to docker.io
docker login -u $DOCKER_USER -p $DOCKER_PASS
docker push $REPO

# tag image for heroku, login and push image to heroku
docker tag $REPO:$COMMIT registry.heroku.com/selavi/web
docker login --username=_ --password=$HEROKU_TOKEN registry.heroku.com
docker push registry.heroku.com/selavi/web
