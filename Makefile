.PHONY: lint
lint:
	./lint

.PHONY: test
test:
	npx mocha test/apple.js -R spec -b --timeout=5000 --path=false
	npx mocha test/google.js -R spec -b --path=false --pk=false
	npx mocha test/amazon.js -R spec -b --timeout=5000 --sharedKey=false --path=false
	npx mocha test/windows.js -R spec -b --timeout=5000 --path=false
	#npx mocha test/facebook.js -R spec -b --timeout=5000 --appAccessToken=false --path=false

.PHONY: aptest
aptest:
	npx mocha test/apple.js -R spec -b --timeout=5000 --path=false

.PHONY: gotest
gotest:
	npx mocha test/google.js -R spec -b --path=false --pk=false

.PHONY: amtest
amtest:
	npx mocha test/amazon.js -R spec -b --timeout=5000 --sharedKey=false --path=false

.PHONY: witest
witest:
	npx mocha test/windows.js -R spec -b --timeout=5000 --path=false

.PHONY: fatest
witest:
	npx mocha test/facebook.js -R spec -b --timeout=5000 --appAccessToken=false --path=false

.PHONY: test-apple
test-apple:
	npx mocha test/apple.js -R spec -b --timeout=5000 --path=$(path)

.PHONY: test-google
test-google:
	npx mocha test/google.js -R spec -b --path=$(path) --pk=$(pk)

.PHONY: test-windows
test-windows:
	npx mocha test/windows.js -R spec -b --timeout=5000 --path=$(path)

.PHONY: test-amazon
test-amazon:
	npx mocha test/amazon.js -R spec -b --timeout=5000 --sharedKey=$(sharedKey) --path=$(path)

.PHONY: test-facebook
test-facebook:
	npx mocha test/facebook.js -R spec -b --timeout=5000 --appAccessToken=$(appAccessToken) --path=$(path)
