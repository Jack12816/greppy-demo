[![Greppy Demo logo](http://greppy.org/img/greppy-demo-teaser.png)](http://greppy.org/)

Demo application for the Greppy framework. This application is deployed and powering
the greppy.org domain. All modules, sites, functionality of the application can be
viewed in details here.

For more details take a look at [greppy.org](http://greppy.org) or the
[Greppy API](http://greppy.org/docs). If you got any problems, a wish to
contribute or to discuss new features take a look at our #greppy IRC channel on
freenode.

[![Gittip](http://img.shields.io/gittip/Jack12816.png)](https://www.gittip.com/Jack12816/)

## Dependencies

* Node.js (pacman -S nodejs)
* Bower (sudo npm install -g bower)

## Installation

Commonly it is a good idea to install Greppy globally on your system, so you
can use the ``greppy`` binary. To install greppy run the following command:

    $ sudo npm install -g greppy

The second step to get the demo application running is to prepare all dependencies.
For this task we provide a simple command which runs all commands to setup the project.
Just run:

    $ make install

## Getting started

To start the demo application you only need to run:

    $ greppy -sd

This will start a GNU screen session where you can navigate through multiple
tabs with the right/left arrow keys. Every tab is a running module.

### Development

**Note:** These steps are optional.

To build all minified assets run:

    $ make build

If you would like to automatically rebuild the minified assets,
run the following command:

    $ make watch

