# Tencent EdgeOne 缓存刷新 Action

<div align = center>

简体中文 | [English](/README_EN.md)

</div>

## 介绍

这是一个用于刷新腾讯云 EdgeOne CDN 缓存的 GitHub Action。

你是否在使用Github Pages部署静态网站，并且希望在每次部署后自动刷新腾讯云 EdgeOne CDN 缓存？

如果是的话，那么这个 Action 就是为你准备的。

## 功能

- 轻松刷新 EdgeOne CDN 缓存，无需繁杂处理签名验证等。
- 支持 `purge_host`（Hostname 刷新）和 `purge_prefix`（目录刷新）。

## 输入参数

| 参数名称   | 必填                 | 描述                                                         |
| ---------- | -------------------- | ------------------------------------------------------------ |
| secret_id  | 是                   | 腾讯云 SecretID                                              |
| secret_key | 是                   | 腾讯云 SecretKey                                             |
| zone_id    | 是                   | EdgeOne 区域 ID                                              |
| type       | 是                   | 刷新类型，默认：`purge_host`；可选：`purge_host`、`purge_prefix` |
| hostnames  | `type = purge_host`  | 需要刷新的域名列表（逗号或换行分隔）                         |
| paths      | `type = purge_prefix` | 需要刷新的目录 URL 列表（逗号或换行分隔，必须包含协议）      |
| method     | 否                   | 目录刷新方式：`invalidate`（默认）或 `delete`                |

## 示例用法

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

### 目录刷新

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

`paths` 也可以写成逗号分隔的一行：

```yaml
paths: https://example.com/docs/,https://example.com/assets/
```

`method` 为 `invalidate` 时只刷新已产生更新的资源，为 `delete` 时强制删除目录下全部节点缓存。

## 开发
### 安装依赖

```bash
pnpm install
```

详细开发文档请查看 [DEVELOPMENT.md](DEVELOPMENT.md)
