#!/bin/bash

function error() {
  printf "\e[0;31m[X]\e[0m $@ \n"
}

function success() {
  printf "\e[0;32m[✅]\e[0m $@ \n"
}

function info() {
  printf "\e[1;33m[i]\e[0m $@ \n"
}

# "\e[0;31m \e[0m"

function divider() {
  printf "\e[48;5;027m================$@================\e[0m \n"
}

function fatal() {
  error "$@"
  printf "Stopping script ... \n"
  exit 1
}

clear

divider " starting script "

POSITIONAL=()
while [[ $# -gt 0 ]]; do
  key="$1"

  case $key in
  -scp | --src-code-path)
    srcCodePath="$2"
    shift # past argument
    shift # past value
    ;;
  -bp | --build-path)
    buildPath="$2"
    shift # past argument
    shift # past value
    ;;
  -n | --app-name)
    appName="$2"
    shift # past argument
    shift # past value
    ;;
  *) # unknown option
    POSITIONAL+=("$1") # save it in an array for later
    shift              # past argument
    ;;
  esac
done
set -- "${POSITIONAL[@]}" # restore positional parameters

if [[ -z $appName ]]; then
  appName='WebWindow'
fi

# check if variables are set and valid
if [[ -z $srcCodePath ]]; then
  fatal "Path to source code not specified. \n Please specify it with -scp or --src-code-path. \n"
fi
if [[ -z $buildPath ]]; then
  fatal "Build path is not specified. \n Please specify it with -bp or --build-path. \n"
fi
if [[ ! -d $srcCodePath ]]; then
  fatal "Path to source code not existing. \n"
fi
if [[ ! -d $buildPath ]]; then
  fatal "Build path not existing. \n "
fi

# check if npm is installed
info "Checking if npm is installed... \n"
whereIsNpm=$(whereis npm)
if [[ $whereIsNpm == 'npm:' ]]; then
  error "npm is not installed. Stopping script..."
  exit 1
else
  success "Checking if npm is installed... \n"
fi

# switch to build path
divider
info "Switching to build path... \n"
cd $buildPath || fatal "couldn"t switch to build path"
success "Switching to build path... \n"

# get Electron"s prebuilt binaries
divider
info "Downloading electron binaries... \n"
npm install electron-packager -g
success "Downloading electron binaries... \n"

# build app
divider
info "Building app... \n"
electron-packager "$srcCodePath" "$appName" --platform=linux --arch=x64 --prune=true --executableName='web-window'
success 'Building app... \n \n'

# get electrons installer for creating .deb-files
divider ""
info "Getting electrons tools for creating .deb-files... \n"
npm install -g electron-installer-debian
success 'Getting electrons tools for creating .deb-files... \n \n'

# create debian package
divider
info "Creating debian package... \n \n"
cd "$buildPath/$appName-linux-x64/" || fatal "couldn't create debian package ..."
electron-installer-debian --src "$buildPath/$appName-linux-x64/" --arch amd64 --config /opt/project/debian.json

success 'Creating debian package... \n \n'
