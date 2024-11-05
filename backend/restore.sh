#!/bin/bash
# TODO: execute this shell script once mongodb connection is instantiated, but for now, manually run below command inside mongodb container to seed data
mongorestore --uri="mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@mongodb:27017/inventory?authSource=${MONGODB_AUTH_SOURCE}" $DUMP_DIRECTORY
