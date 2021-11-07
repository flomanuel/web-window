# Building the application (currently only linux 64 Bit )

Currently, the project is only compatible with linux 64-bit systems.

Execute the bash script [build-app.sh](scripts/build-app.sh) from inside the container (_/opt/project/scripts/_) **as
user root**.

The script accepts some optional parameters:

- Path to Project folder `- scp` `-src-code-path` (e.g. `- scp '/opt/project'`). Defaults to _/opt/project_.
- Path to build folder `-bp` `--build-path` (The necessary files will be downloaded in this path. The results will also
  be saved there.) (e.g. `-bp '/output'`). Defaults to _/output_. Watch out, all preexisting content gets deleted whilst
  running the build script. If altered, _debian.json_ must be adjusted, too.
- Defining the app name `-n` `--app-name` (e.g. `-n 'WebWindow'`). Defaults to _WebWindow_.

The final command could look like this: `/bin/bash build-app.sh -scp '/opt/project' -bp '/output' -n 'WebWindow'`

**! Don't use relative paths since the bash script changes directories !**
