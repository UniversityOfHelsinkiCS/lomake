#!/bin/bash

CONTAINER=lomake_db
SERVICE_NAME=db
DB_NAME=postgres

current_date=$(date +"%Y%m%d")
FILE_NAME="lomake_${current_date}.sql.gz"
FOLDER_NAME="lomake"

PROJECT_ROOT=$(dirname $(dirname $(realpath "$0")))
BACKUPS=$PROJECT_ROOT/backups/
DOCKER_COMPOSE=$PROJECT_ROOT/docker-compose.yml

S3_CONF=~/.s3cfg

retry () {
    for i in {1..60}
    do
        $@ && break || echo "Retry attempt $i failed, waiting..." && sleep 3;
    done
}

if [ ! -f "$S3_CONF" ]; then
  echo ""
  echo "!! No config file for s3 bucket !!"
  echo "Create file for path ~/.s3cfg and copy the credetials from version.helsinki.fi"
  echo ""
  return 0
fi

echo "Creating backups folder"
mkdir -p ${BACKUPS}

echo "Fetching a new dump"

s3cmd -c $S3_CONF get "s3://psyduck/${FOLDER_NAME}/${FILE_NAME}" $BACKUPS

echo "Removing database and related volume"
docker-compose -f $DOCKER_COMPOSE down -v

echo "Starting postgres in the background"
docker-compose -f $DOCKER_COMPOSE up -d $SERVICE_NAME

retry docker-compose -f $DOCKER_COMPOSE exec $SERVICE_NAME pg_isready --dbname=$DB_NAME

echo "Populating Lomake"
docker exec -i $CONTAINER /bin/bash -c "gunzip | psql -U postgres" < ${BACKUPS}${FILE_NAME}
