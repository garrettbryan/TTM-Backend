FROM node:12.16 as build
# make directory
RUN mkdir /source
# Create a user group
RUN addgroup --system cgroup
# Create a user in group -S -D -h
RUN adduser --system --disabled-password --ingroup cgroup cuser

COPY server.js /source
COPY package.json /source
COPY Gruntfile.js /source

WORKDIR /source
RUN ["npm", "install"]

# Chown all the files to the user
RUN chown -R cuser:cgroup /source
USER cuser:cgroup

RUN ["bower", "install"]
RUN ["grunt", "build"]


FROM node:12.16-alpine as production
# make directory
RUN mkdir /source
# Create a user group
RUN addgroup --system cgroup
# Create a user in group -S -D -h
RUN adduser --system --disabled-password --ingroup cgroup cuser

COPY --from=build /source /api

WORKDIR /api

# Chown all the files to the user
RUN chown -R cuser:cgroup /api
USER cuser:cgroup

CMD ["node", "server.js"]