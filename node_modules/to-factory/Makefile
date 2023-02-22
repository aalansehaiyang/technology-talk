test: prepublish test/test.js
	node test/test.js

test/test.js: test/index.js
	babel test/index.js > test/test.js

prepublish: to-factory.js

to-factory.js: index.js
	babel index.js > to-factory.js

clean:
	rm to-factory.js test/test.js

.PHONY: test prepublish clean
