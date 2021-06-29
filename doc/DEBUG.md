# Debugging the application

Electron consists of two processes. The main and the render process. I've added my WebStorm debug configurations
_Electron Main_ and _Electron Render_ as project files.

Debugging an Electron instance running inside of Docker with WebStorm's Debugger is a bit flimsy (or I've made a
mistake... if so, please let me know 😀).

## The main process (WebStorm)

Set your breakpoints and start the application by running _Electron Main_.

The debugger might stop at the projects first line of code. Press _Resume Program_ once to jump to your first
breakpoint.

## The render process (WebStorm)

WebWindow should already be running with the command line switch _--remote-debugging-port=PORT_. Or simply run _Electron
Main_.

You also should have established a ssh connection to the container **before** running _Electron Render_. You can use the
small script [sshTunnel.sh](docker/shell/sshTunnel.sh) if you like.

Then run _Electron Render_.

You need to establish a ssh connection beforehand, because the DevTools are only listening on 127.0.0.1.
Exposing the port to the host won't work because the request's ip-address isn't 127.0.0.1 (if I understand it
correctly).
