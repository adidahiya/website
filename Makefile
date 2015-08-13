BIN = ./node_modules/.bin/

all: clean build

build: index.html

index.html: build/app.css
	@$(BIN)/wiredep -s index.html --includeSelf

build/app.css:
	@$(BIN)/cssnext src/app.css > build/app.css

clean:
	rm build/*

server:
	python -m SimpleHTTPServer
