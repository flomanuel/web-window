![WebWindow logo](doc/assets/mainImage.png)

[![License](https://img.shields.io/badge/License-MIT-blue)](https://opensource.org/licenses/MIT)

## Overview

Electron-based application that makes all your favourite webapps run like native apps.

It's basically a Chromium browser that opens all added websites in a new window respectively.

### Requirements

You will need

- Docker
- Docker Compose

### Setting up the project

Read [this file](./doc/DOCKER.md) on how to set up the project.

### Debugging the application

Read [this file](./doc/DEBUG.md) on how to debug the project.

### Building the application (currently only linux 64 Bit )

Currently, the project is only compatible with linux 64-bit systems.

Getting it to work under macOS / Windows shouldn't be a lot of work.

Execute the bash script [build-app.sh](scripts/build-app.sh) from inside the container **as root user**.

The script accepts some optional parameters:

- Path to Project folder `- scp` `-src-code-path` (e.g. `- scp '/opt/project'`). Defaults to _/opt/project_.
- Path to build folder `-bp` `--build-path` (The necessary files will be downloaded in this path. The results will also
  be saved there.) (e.g. `-bp '/output'`). Defaults to _/output_. If altered, debian.json must be adjusted, too.
- Defining the app name `-n` `--app-name` (e.g. `-n 'WebWindow'`). Defaults to _WebWindow_.

The final command could look like this: `/bin/bash build-app.sh -scp '/opt/project' -bp '/output' -n 'WebWindow'`

**! Don't use relative paths since the bash script changes directories !**

## Terms of use

### WebWindow

The license for this project can be found [here](./LICENSE).

### Third-party Libraries

This project builds upon open source libraries. Please see each projects' terms of use when using the provided code in
this repository.

### Picture credits

This project uses different images. Please see each images' license when using them.

- [Microsoft OneNote icon. Edited: changed aspect ratio to 1:1.](https://commons.wikimedia.org/wiki/File:Microsoft_Office_OneNote_(2019%E2%80%93present).svg) (
  last accessed 04.05.2021 22:51)
- [Microsoft To Do icon](https://commons.wikimedia.org/wiki/File:To_Do.svg) (last accessed 04.05.2021 22:51)
- [Window emoji used for WebWindows icon and logo was designed by OpenMoji – the open-source emoji and icon project. License: CC BY-SA 4.0](https://github.com/hfg-gmuend/openmoji) (
  last accessed 03.06.2021 00:21)
- [All other icons / emojis were designed by OpenMoji – the open-source emoji and icon project. License: CC BY-SA 4.0](https://github.com/hfg-gmuend/openmoji) (
  last accessed 04.06.2021 10:36)
