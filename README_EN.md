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
- Supports `purge_host` (hostname purge) and `purge_prefix` (directory purge)

## Input Parameters

| Parameter    | Required              | Description                                                        |
| ------------ | --------------------- | ------------------------------------------------------------------ |
| secret_id    | Yes                   | Tencent Cloud SecretID                                             |
| secret_key   | Yes                   | Tencent Cloud SecretKey                                            |
| zone_id      | Yes                   | EdgeOne Zone ID                                                    |
| type         | Yes                   | Purge type, default: `purge_host`; options: `purge_host`, `purge_prefix` |
| hostnames    | `type = purge_host`   | Comma/newline-separated list of hostnames to purge                 |
| paths        | `type = purge_prefix` | Comma/newline-separated list of directory URLs to purge            |
| method       | No                    | Directory purge method: `invalidate` (default) or `delete`         |

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

### Directory Purge

```yaml
- name: Purge EdgeOne Directories
  uses: 2061360308/edgeone-purge-action@v1
  with:
    secret_id: ${{ vars.TENCENT_SECRET_ID }}
    secret_key: ${{ secrets.TENCENT_SECRET_KEY }}
    zone_id: ${{ vars.EDGEONE_ZONE_ID }}
    type: purge_prefix
    paths: |
      https://example.com/docs/
      https://example.com/assets/
    method: invalidate
```

`paths` can also be a single comma-separated line:

```yaml
paths: https://example.com/docs/,https://example.com/assets/
```

With `method: invalidate`, only resources that changed under the directory are purged. With
`method: delete`, all node cache under the directory is removed.

## Development
### Install Dependencies

```bash
pnpm install
```

For detailed documentation please refer to [DEVELOPMENT_EN.md](DEVELOPMENT_EN.md)