# Tencent EdgeOne Purge Action

<div align = center>

[简体中文](/README.md) | English

</div>

## Introduction

A GitHub Action for purging Tencent EdgeOne CDN cache.

Are you using GitHub Pages to deploy static websites and want to automatically refresh Tencent EdgeOne CDN cache after each deployment?

If yes, this Action is designed for you.

## Features

- Effortlessly purge EdgeOne CDN cache without complex signature verification

## Input Parameters

| Parameter    | Required            | Description                                  |
| ------------ | ------------------- | -------------------------------------------- |
| secret_id    | Yes                 | Tencent Cloud SecretID                      |
| secret_key   | Yes                 | Tencent Cloud SecretKey                     |
| zone_id      | Yes                 | EdgeOne Zone ID                             |
| type         | Yes                 | Purge type, default: purge_host Options: purge_host |
| hostnames    | `type = purge_host` | Comma-separated list of hostnames to purge  |

## Usage Example

```yaml
name: Purge EdgeOne Cache

on:
  push:
    branches: [main]

jobs:
  purge-cache:
    runs-on: ubuntu-latest
    steps:
      - name: Purge EdgeOne Cache
        uses: 2061360308/edgeone-purge-action@v1
        with:
          secret_id: ${{ vars.TENCENT_SECRET_ID }}
          secret_key: ${{ secrets.TENCENT_SECRET_KEY }}
          zone_id: ${{ vars.EDGEONE_ZONE_ID }}
          hostnames: ${{ vars.EDGEONE_HOSTNAMES }}
```

## Development
### Install Dependencies

```bash
pnpm install
```

For detailed documentation please refer to [DEVELOPMENT_EN.md](DEVELOPMENT_EN.md)