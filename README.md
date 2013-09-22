# Greppy Demo Application

Demo application for the Greppy framework.

For more details take a look at [greppy.org](http://greppy.org)
or the [Greppy API](http://greppy.org/docs).

## Dependencies

* Node.js (pacman -S nodejs)
* Bower (npm install -g bower)
* [Ruby] (pacman -S ruby)

### Development

**Note:** These steps are optional.

To enjoy the live reloading features just install the awesome
Guard ruby gem:

    $ gem install guard guard-livereload guard-shell

After installing the dependencies you need to install the livereload
browser extension. Just follow the Installation steps on
[livereload.com](http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions-).

## Installation

To setup greppy just run:

    $ npm install -g greppy

To prepare the demo run these commands, which will setup all dependencies:

    $ npm install
    $ bower install
    $ greppy --assets install

## Usage

To start the demo application you only need to run:

    $ greppy --start demo --debug

### Development

**Note:** These steps are optional.

Get get livereload to work just start the Guard daemon.

    $ guard

