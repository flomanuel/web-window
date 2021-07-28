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
    shift
    shift
    ;;
  -bp | --build-path)
    buildPath="$2"
    shift
    shift
    ;;
  -n | --app-name)
    appName="$2"
    shift
    shift
    ;;
  *) # unknown option
    POSITIONAL+=("$1")
    shift
    ;;
  esac
done
set -- "${POSITIONAL[@]}" # restore positional parameters

if [[ -z $appName ]]; then
  appName='WebWindow'
fi

if [[ -z $buildPath ]]; then
  buildPath='/output'
fi

if [[ -z $srcCodePath ]]; then
  srcCodePath='/opt/project'
fi

# check if variables are valid
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
  fatal "npm is not installed. \n "
else
  success "Checking if npm is installed... \n"
fi

#if necessary clean build path, create folder structure
if [ -d "$buildPath" ]; then
  divider
  info "Cleaning build path... \n"
  if [ -n "$(ls $buildPath)" ]; then
    info "    Path not empty. Deleting content... \n"
    rm -r ${buildPath:?}/* || fatal "    Couldn't delete content."
    success "    Path not empty. Deleting content... \n"
  fi
  success "Cleaning build path... \n"
fi

divider
info "Creating folder structure inside build path... \n"
mkdir -p "$buildPath/srcCode/dist" || fatal "Couldn't create folder structure inside build path."
success "Creating folder structure inside build path... \n"

#if necessary clean dist folder in source code path
if [ -d "$srcCodePath" ]; then
  divider
  info "Cleaning dist folder in source code path... \n"
  if [ -n "$(ls $srcCodePath/dist)" ]; then
    info "    Path not empty. Deleting content... \n"
    rm -rf ${srcCodePath:?}/dist/* || fatal "    Couldn't delete content."
    success "    Path not empty. Deleting content... \n"
  fi
  success "Cleaning dist folder in source code path... \n"
fi

divider
info "Building webpack bundles... \n"
cd $srcCodePath || fatal "    Source code path not existing."
npm run wp_build || fatel "    Couldn't build webpack bundles."
success "Building webpack bundles... \n"

# copy necessary source code into build path
divider
info "Copying files to build path... \n"
cp -r "$srcCodePath/dist/" "$buildPath/srcCode/dist/" || fatal "Couldn't copy source code into the build directory."
cp "$srcCodePath/package.json" "$buildPath/srcCode/" || fatal "Couldn't copy package.json into the build directory."
cp "$srcCodePath/package-lock.json" "$buildPath/srcCode/" || fatal "Couldn't copy package-lock.json into the build directory."
cp "$srcCodePath/LICENSE" "$buildPath/srcCode/" || fatal "Couldn't copy LICENSE into the build directory."
success "Copying files to build path... \n"

# installing node modules
divider
info "Installing node modules... \n"
cd "$buildPath/srcCode" || fatal "Couldn't switch into source code folder."
npm install || fatal "Couldn't install node modules."
success "Installing node modules... \n"

# switch to build path
divider
info "Switching to build path... \n"
cd $buildPath || fatal "Couldn't switch to build path."
success "Switching to build path... \n"

# get Electron"s prebuilt binaries
divider
info "Downloading electron binaries... \n"
npm install electron-packager -g
success "Downloading electron binaries... \n"

# build app
divider
info "Building app... \n"
electron-packager "$buildPath/srcCode" "$appName" --platform=linux --arch=x64 --prune=true --executableName='web-window' || fatal "Couldn't build the app."
success 'Building app... \n \n'

# get electrons installer for creating .deb-files
divider ""
info "Getting electrons tools for creating .deb-files... \n"
npm install -g electron-installer-debian
success 'Getting electrons tools for creating .deb-files... \n \n'

# create debian package
divider
info "Creating debian package... \n \n"
cd "$buildPath/$appName-linux-x64/" || fatal "Couldn't create debian package ..."
electron-installer-debian --src "$buildPath/$appName-linux-x64/" --arch amd64 --config /opt/project/debian.json

success 'Creating debian package... \n \n'
