# Dependency problems

_Last updated 6/18/22_

Be very, very careful with everything CodeMirror-related. Some of the libraries
introduce breaking changes, even for minor/patch versions. We're not fully sure
which libraries are causing problems, but we suspect it's not the main
CodeMirror libraries, but the unofficial @uiw/react-codemirror.

Just to be on the safe side, we removed the carets from the version numbers in
`package.json` for everything CodeMirror-related. This locks them in at very
specific version numbers, preventing NPM from installing minor or patch
versions. If you try updating these, and your app suddenly breaks when you click
buttons in the app, these are probably the culprits.

## What is CodeMirror?

CodeMirror is just a library for putting ready-made code editors inside an app.
It's supposed to be plug-and-play, but it might be touch-and-go, especially with
libraries like React. The decision to include CodeMirror in the codebase was
made several iteration groups ago.

## What is `@uiq/react-codemirror`?

This is an unofficial library for making it possible/easy to insert CodeMirror
instances through React components. It is maintained by one developer who is
good about updating things regularly, but they're the only one making sure the
tool is stable. In our case, minor versions after 4.7.0 introduce bugs that
cause the app to break.

[There is a closed issue thread about this.](https://github.com/uiwjs/react-codemirror/issues/216)

