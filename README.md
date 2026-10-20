# MC Keepalive

用 GitHub Actions 每 6 小时让一个 Minecraft 假人进服挂机 5 分钟。

## 使用
1. 推送到你的 GitHub 仓库
2. 修改 `.github/workflows/keepalive.yml` 中的 `MC_SERVER`（地址:端口）
3. Actions 页面手动 Run workflow 测试

## 白名单（可选）
服务器开启白名单时，在服务器执行：

    whitelist add KeepAliveBot

或运行 `node gen-whitelist.js KeepAliveBot` 生成条目放入 `whitelist.json`，再执行 `whitelist reload`。

## 注意
- 服务器 online-mode=true 时离线登录会被拒绝
- GitHub 定时任务可能延迟；公开仓库 60 天无提交会被停用定时任务
