# [![docs.architus](https://i.imgur.com/iv0wgAg.png)](https://docs.archit.us)

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Farchitus%2Fdocs.archit.us.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Farchitus%2Fdocs.archit.us?ref=badge_shield) [![Build Status](https://travis-ci.org/architus/docs.archit.us.svg?branch=master)](https://travis-ci.org/architus/docs.archit.us) [![Website Uptime](https://img.shields.io/uptimerobot/ratio/7/m783218822-e416787a37a1f22b540d0654.svg?label=website%20uptime)](https://status.archit.us/) [![Netlify Status](https://api.netlify.com/api/v1/badges/8ee5067a-c5a8-4309-9167-2cfe8b8d4cb3/deploy-status)](https://app.netlify.com/sites/architus-docs/deploys)

> Implementation documentation for the architus ecosystem, including the microservice-based backend application as well as the React-based web dashboard. Built in Gatsby.js, React, and MDX

## 🔗 Quick Links

- [Source documentation repository](https://github.com/architus/docs.archit.us)
  - [Netlify deploys](https://app.netlify.com/sites/architus-docs/deploys)
- [Bot backend repository](https://github.com/architus/architus)
- [Web app frontend repository](https://github.com/architus/archit.us)
  - [Storybook](https://storybook.archit.us/)
    - [Netlify deploys](https://app.netlify.com/sites/storybook-architus/deploys)
  - [Main web app](https://archit.us/)
  - [Develop branch web app](https://develop.archit.us/)
  - [Netlify deploys](https://app.netlify.com/sites/architus/deploys)

## 🚀 Getting Started

### Setup

To set up the docs.archit.us website locally, you'll need to have [Node.js](https://nodejs.org/en/download/) installed. Once installed, run the following commands to download dependencies:

```console
npm install -g yarn
yarn install
```

## 📝 Authoring Documentation

To edit documentation or add new pages, add `.md` or `.mdx` (preferred) files to the `docs/` folder in the repository root. Any files automatically result in generated pages at the same public path as their relative path, starting from the `docs/` folder. To add a page with the same name/path as a subdirectory, simply add a file named `index.md` or `index.mdx`.

### File Format

```md
---
title: (Required). Name that appears in the title <h1> and in the side NavBar
shortTitle: (Optional; defaults to title). Name that appears in the title bar & breadcrumb
---

# Markdown content

See external guides for specifics on Markdown syntax
```

## 📡 Development Server

Similar to the frontend web dashboard, there are two options to preview the app while developing: a **hot reload-enabled development server** *(recommended)* and a **statically-generated site preview**.

### Hot-reload-enabled

```console
yarn start
```

### Statically-generated preview

```console
yarn build
yarn serve
```

### Code Style

docs.archit.us uses [eslint](https://eslint.org/) and [prettier](https://prettier.io/) to enforce JavaScript code style across the repository. To run the linter locally, run:

```console
yarn run lint
```

## 📜 License

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Farchitus%2Fdocs.archit.us.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Farchitus%2Fdocs.archit.us?ref=badge_large)
