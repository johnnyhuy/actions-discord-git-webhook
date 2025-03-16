test:
	npm run test

install:
	asdf plugin add nodejs || true
	asdf install || true
	npm install

build:
	docker compose build release

version:
	docker compose run --rm release standard-version

release:
	git push --follow-tags origin main
	docker compose run --rm release conventional-github-releaser

workspace:
	docker compose build workspace
	docker compose run --rm workspace

clean:
	docker compose down