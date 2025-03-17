test:
	npm run test

install:
ifndef CI
	asdf plugin add nodejs || true
	asdf install || true
endif
	npm install

version:
	npm run standard-version

release:
	git push --follow-tags origin main
	npm run release

workspace:
	docker compose build workspace
	docker compose run --rm workspace

clean:
	docker compose down