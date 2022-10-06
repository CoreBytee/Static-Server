#!/bin/zsh
TypeWriter build --branch=Server
rm ./src/Main/resources/Server.twr
cp ./.TypeWriter/Build/Static-Server.twr ./src/Main/resources/Server.twr
TypeWriter build