# Tencent EdgeOne Purge Action

用于刷新腾讯云 EdgeOne CDN 缓存的 GitHub Action

## 输入参数

| 参数名称   | 必填 | 描述                                          |
| ---------- | ---- | --------------------------------------------- |
| secret_id  | 是   | 腾讯云 SecretID                               |
| secret_key | 是   | 腾讯云 SecretKey                              |
| zone_id    | 是   | EdgeOne 区域 ID                               |
| type       | 是   | 刷新类型，默认：purge_host 可选值：purge_host |
| hostnames  | 是   | 需要刷新的域名列表（逗号分隔）                |

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
        uses: your-username/edgeone-purge-action@v1
        with:
          secret_id: ${{ secrets.TENCENT_SECRET_ID }}
          secret_key: ${{ secrets.TENCENT_SECRET_KEY }}
          zone_id: ${{ vars.EDGEONE_ZONE_ID }}
          hostnames: ${{ vars.EDGEONE_HOSTNAMES }}
```
