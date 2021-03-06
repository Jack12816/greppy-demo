SHELL=/bin/bash

.PHONY: all clean configure deinstall install build watch

configure:
uninstall:
clean:
	# Clean logs
	@eval `find ./var/log -type f -name '*.log' | awk '{print "echo \"\033[0;31mremove \033[0m" $$0 "\" && rm " $$0 ";"}'`

install: configure
	@npm install
	@bower install --allow-root
	@greppy --assets install

build:
	@./node_modules/.bin/grunt
	@cp public/components/bootstrap/fonts/* public/fonts/
	@cp public/components/font-awesome/fonts/* public/fonts/

watch:
	@./node_modules/.bin/grunt watch

