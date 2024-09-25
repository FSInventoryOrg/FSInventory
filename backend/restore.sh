#!/bin/bash
# This is ran inside docker, so if you are in windows, don't worry
mongorestore --uri='mongodb://mongo:27017/inventory' /dump
