# 开发流程规范

## Git 提交规范

使用 Conventional Commits 规范，格式为：

### 提交类型说明
| 类型     | 说明                     | 示例                  |
|---------|------------------------|----------------------|
| feat    | 新增功能                | `feat: 添加缓存刷新功能` |
| fix     | 修复bug                | `fix: 修正签名验证错误`  |
| docs    | 文档更新                | `docs: 更新API文档`     |
| style   | 代码格式/样式调整        | `style: 格式化请求模块`  |
| refactor| 代码重构                | `refactor: 优化错误处理` |
| test    | 测试相关                | `test: 添加单元测试`     |
| chore   | 构建/工具变更           | `chore: 更新依赖版本`    |
| ci      | CI配置变更             | `ci: 添加GitHub Actions` |

### 提交/发布方法

#### 提交方法
1. 常规提交（自动校验）：
```bash
git commit -m "feat: 添加缓存刷新功能"
 ```

2. 交互式提交（推荐）：
```bash
pnpm run commit
 ```

#### 发布方法
```bash
pnpm run release
```

## 测试
### 简单测试脚本
1. 构建
```bash
pnpm run build
```
2. 运行测试
```bash
pnpm run test
```

### 完整Action环境模拟测试

#### 测试环境准备
1. 安装 Docker
2. 安装act并配置环境变量 [act相关介绍](https://github.com/nektos/act)

#### 测试步骤

1. 构建
```bash
pnpm run build
```
2. 运行测试
```bash
pnpm run docker-test
```

## 分支管理规范
- `main`: 生产稳定分支
- `dev`: 开发集成分支
- `feature/*`: 功能开发分支
- `fix/*`: bug修复分支