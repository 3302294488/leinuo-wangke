# 雷诺网课

基于 [OCS 网课助手](https://github.com/ocsjs/ocsjs)与 [OCS Desktop](https://github.com/ocsjs/ocs-desktop)的非官方界面定制版。桌面端与用户脚本统一整理，显示名称为 **雷诺网课**，课程功能沿用上游。

## 目录

| 路径 | 内容 |
|---|---|
| `desktop/` | Electron + Vue 桌面端，多浏览器与账号环境管理 |
| `userscript/` | 学习通、知到等平台的用户脚本 |
| `tools/project.ts` | 安装、构建、开发和打包入口 |
| `UPSTREAM.md` | 上游提交、版权与改动范围 |

## 开发与构建

需要 Node.js **22.18+**（建议 24）和 pnpm **10.21.0**。两个子项目分别保留自己的锁文件，不在根目录合并依赖。

```sh
npm install -g pnpm@10.21.0
pnpm run setup
pnpm build
pnpm dev
```

- `pnpm build:script`：编译脚本，并复制到桌面端静态资源目录。
- `pnpm build`：构建脚本、检查桌面端类型并构建桌面应用。
- `pnpm check`：运行类型检查与上游答案解析回归测试。
- `pnpm dist`：生成当前系统安装包，位于 `desktop/releases/`。

Windows 构建过程可能需要下载 Electron、浏览器扩展及打包工具。首次运行需要联网补全浏览器环境。操作系统须允许 pnpm 创建 workspace 目录链接。

## 使用

1. 安装构建得到的「雷诺网课」桌面端。
2. 新建浏览器环境；桌面端默认安装本项目随包构建的「雷诺网课」脚本。
3. 打开学习通或知到，由账号本人完成登录和必要验证。
4. 进入具体课程，按脚本面板提示设置并观察运行情况。

也可单独将 `userscript/dist/ocs.user.js` 安装到脚本猫或 Tampermonkey。不要同时启用原版 OCS 和本定制脚本。

每个浏览器环境单独保存登录状态。账号、密码、Cookie、题库密钥和导出的 `.ocsdata` 文件均不应提交到仓库。

## 范围与依赖

这是界面改名和项目整合，不新增课程逻辑。平台适配情况取决于上游及平台页面变化，实际课程效果需要登录后测试。题库、扩展下载、教程及部分资源仍依赖上游服务；不是完全离线版。已完成与尚未完成的检查见 [验证记录](VALIDATION.md)。

桌面更新入口已指向本仓库 Releases。维护者发布安装包和 `latest.yml` 前，没有可用的自动更新包。

## 许可与致谢

MIT，保留原作者 **enncy** 的版权和许可声明；详情见 [LICENSE](LICENSE) 和 [UPSTREAM.md](UPSTREAM.md)。原始说明保存在各子目录的 `README.upstream.md`。
