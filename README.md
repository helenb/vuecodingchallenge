# Vue coding challenge Wagtail site

## Intro

This is a wagtail-kit build for us to try out using Vue for dynamic listings. The aim of the challenge is to create a dynamic paginated listing of news articles, filtered by news type. It could optionally also allow changes to ordering, e.g. newest first, oldest first and news title. (I know no-one ever wanted to organise their news items by title - this is just for a learning exercise). The dynamic listing should be within the news listing template with the usual surrounding page furniture such as the header and footer.

The build has vue version 3 added via npm. Webpack aliases 'vue.esm-bundler.js' to 'vue'. This includes the runtime compiler (see https://v3.vuejs.org/guide/installation.html#explanation-of-different-builds). Note that at the moment we do not have vue-loader set up so we can't use templates with a .vue extension. Feel free to change the set-up as part of your submission if it doesn't work for you - it's my best guess as to what will work for us at the moment.

`static_src/vue.js` is set up as a separate entry with Webpack, so any code in there will compile to `static_compiled/vue.js` - this file is loaded on the news index template which displays the 'Hello vue' message. Because django templates already use mustache tags, I've changed the vue delimiters to use `[[` and `]]`.

I have set up a news feed in the api including the news type - you can view it in the browser at http://localhost:3002/api/v2/pages/?type=news.NewsPage&fields=introduction,body,news_types(news_type_name) Note the news_type_name in brackets at the end - without it the news type will just come through as an id, not a name. It would be good to also add a news thumbnail to the api as part of the challenge - see Tom's 'headless wagtail with vue' tutorial for a reminder of how to do that: https://gist.github.com/tomdyson/abf1e973db4dcd50b388816f8c20adb0.

Please submit your solution as a PR on this repo.

## Technical documentation

This project contains technical documentation written in Markdown in the `/docs` folder. This covers:

- continuous integration
- deployment
- git branching
- project conventions

You can view it using `mkdocs` by running:

```bash
mkdocs serve
```

The documentation will be available at: http://localhost:8001/

# Setting up a local build

This repository includes `docker-compose` configuration for running the project in local Docker containers,
and a fabfile for provisioning and managing this.

## Dependencies

The following are required to run the local environment. The minimum versions specified are confirmed to be working:
if you have older versions already installed they _may_ work, but are not guaranteed to do so.

- [Docker](https://www.docker.com/), version 19.0.0 or up
  - [Docker Desktop for Mac](https://hub.docker.com/editions/community/docker-ce-desktop-mac) installer
  - [Docker Engine for Linux](https://hub.docker.com/search?q=&type=edition&offering=community&sort=updated_at&order=desc&operating_system=linux) installers
- [Docker Compose](https://docs.docker.com/compose/), version 1.24.0 or up
  - [Install instructions](https://docs.docker.com/compose/install/) (Linux-only: Compose is already installed for Mac users as part of Docker Desktop.)
- [Fabric](https://www.fabfile.org/), version 2.4.0 or up
  - [Install instructions](https://www.fabfile.org/installing.html)
- Python, version 3.6.9 or up

Note that on Mac OS, if you have an older version of fabric installed, you may need to uninstall the old one and then install the new version with pip3:

```bash
pip uninstall fabric
pip3 install fabric
```

You can manage different python versions by setting up `pyenv`: https://realpython.com/intro-to-pyenv/

## Running the local build for the first time

If you are using Docker Desktop, ensure the Resources:File Sharing settings allow the cloned directory to be mounted in the web container (avoiding `mounting` OCI runtime failures at the end of the build step).

Starting a local build can be done by running:

```bash
git clone [URL TO GIT REMOTE]
cd vuecodingchallenge
fab build
fab start
fab sh
```

Then within the SSH session:

```bash
dj migrate
dj createcachetable
dj createsuperuser
djrun

```

The site should be available on the host machine at: http://127.0.0.1:8000/

### Frontend tooling

There are 2 ways to run the frontend tooling:

#### With the frontend docker container (default)

After starting the containers as above and running `djrun`, in a new
terminal session run `fab npm start`. This will start the frontend container and the site will
be available on port :3000 using browsersync. E.G `localhost:3000`.

#### Locally

To run the FE tooling locally. Create a `.env` file in the project root (see .env.example) and add `FRONTEND=local`.
Running `fab start` will now run the frontend container and you can start npm locally instead

There are a number of other commands to help with development using the fabric script. To see them all, run:

```bash
fab -l
```

## Front-end assets

Frontend npm packages can be installed locally with npm, then added to the frontend container with fabric like so:

```bash
npm install promise
fab npm install
```

## Installing python packages

Python packages can be installed using poetry in the web container:

```
fab sh-root
poetry install wagtail-guide
```
