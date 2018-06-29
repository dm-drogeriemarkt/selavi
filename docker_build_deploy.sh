#!/bin/sh

# set some environment variables
export REPO=dmopensource/selavi
export TAG=`if [ "${TRAVIS_BRANCH}" = "master" ]; then echo "latest"; else echo "${TRAVIS_BRANCH}" ; fi`

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

# release image on heroku
export DOCKER_IMAGE_ID=$(docker inspect $REPO:$TAG --format={{.Id}})
curl -n -X PATCH https://api.heroku.com/apps/selavi/formation \
  -d '{
  "updates": [
    {
      "type": "web",
      "docker_image": "$DOCKER_IMAGE_ID"
    }
  ]
}' \
  -H "Content-Type: application/json" \
  -H "Accept: application/vnd.heroku+json; version=3.docker-releases"
  -H "Authorization: Bearer $HEROKU_TOKEN"
