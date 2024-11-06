#!/bin/bash
# TODO: execute this shell script once mongodb connection is instantiated, but for now, manually run below command inside mongodb container to seed data

if [ "$NODE_ENV" = "development" ]; then
    mongorestore --uri="mongodb://mongodb:27017/${MONGODB_NAME}" $DUMP_DIRECTORY
else
    mongorestore --uri="mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@mongodb:27017/${MONGODB_NAME}?authSource=${MONGODB_AUTH_SOURCE}" $DUMP_DIRECTORY
fi
