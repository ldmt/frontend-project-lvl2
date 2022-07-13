install: # install
	npm ci
lint:
	npx eslint .
publish: # checkout
	npm publish --dry-run
test:
	npm test
test-coverage:
	npm test -- --coverage --coverageProvider=v8