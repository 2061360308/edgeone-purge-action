# Tencent EdgeOne 缓存刷新 Action

<div align = center>

简体中文 | [English](/README_EN.md)

</div>

## 介绍

这是一个用于刷新腾讯云 EdgeOne CDN 缓存的 GitHub Action。

你是否在使用Github Pages部署静态网站，并且希望在每次部署后自动刷新腾讯云 EdgeOne CDN 缓存？

如果是的话，那么这个 Action 就是为你准备的。

## 功能

- 轻松 EdgeOne CDN 缓存,无需繁杂处理签名验证等。

## 输入参数

| 参数名称   | 必填                | 描述                                          |
| ---------- | ------------------- | --------------------------------------------- |
| secret_id  | 是                  | 腾讯云 SecretID                               |
| secret_key | 是                  | 腾讯云 SecretKey                              |
| zone_id    | 是                  | EdgeOne 区域 ID                               |
| type       | 是                  | 刷新类型，默认：purge_host 可选值：purge_host |
| hostnames  | `type = purge_host` | 需要刷新的域名列表（逗号分隔）                |

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

## 开发
### 安装依赖

```bash
pnpm install
```

详细开发文档请查看 [DEVELOPMENT.md](DEVELOPMENT.md)
