install: # install
	npm ci
lint:
	npx eslint .
publish: # checkout
	npm publish --dry-run