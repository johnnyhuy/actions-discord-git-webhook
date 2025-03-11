test:
ifdef CI
	docker compose -f compose.test.yaml build test
	docker compose -f compose.test.yaml run --rm test
else
	npm run test
endif

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