define GetFromPkg
$(shell node -p "require('./package.json').$(1)")
endef

# package.json properties:
NAME          := $(call GetFromPkg,name)
DOCKERREPO    := $(call GetFromPkg,dockerRepo)
DESCRIPTION   := $(call GetFromPkg,description)
PROJECT_URL   := $(call GetFromPkg,repository)
VERSION       := $(call GetFromPkg,version)

# Other Properties
FEATUREBRANCH := $$(git rev-parse --abbrev-ref HEAD)
COMMIT        := $$(git log -1 --pretty=%h)
IMG           := ${DOCKERREPO}/${NAME}
RELEASE       := ${DOCKERREPO}/${NAME}:${VERSION}
LATEST        := ${DOCKERREPO}/${NAME}:latest
# VERSION       := $$(git describe --tags --abbrev=0)

build:
	@docker build -t ${IMG}:${VERSION}-${FEATUREBRANCH}-${COMMIT} .
	@docker tag ${IMG}:${VERSION}-${FEATUREBRANCH}-${COMMIT} ${LATEST}

release:
	@docker tag ${IMG}:${VERSION}-${FEATUREBRANCH}-${COMMIT} ${RELEASE}

push:
	@docker push ${DOCKERREPO}/${NAME}

login:
	@docker log -u ${DOCKER_USER} -p ${DOCKER_PASS}

echo:
	@echo "LAST_VERSION ${LAST_VERSION}"

default: build 
