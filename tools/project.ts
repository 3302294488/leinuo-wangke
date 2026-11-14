import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const task = process.argv[2];
function run(folder: string, args: string[], env: Record<string, string> = {}) {
	const result = spawnSync('pnpm', args, {
		cwd: resolve(root, folder),
		stdio: 'inherit',
		shell: process.platform === 'win32',
		env: { ...process.env, HUSKY: '0', ...env }
	});
	if (result.error) throw result.error;
	if (result.status !== 0) process.exit(result.status || 1);
}

function script() {
	// 上游构建依赖 utils 编译结果；统一固定输出，避免依赖未提交的 .env。
	run('userscript', ['exec', 'tsc', '-p', 'packages/utils']);
	run('userscript', ['build'], { BUILD_PATH: '../dist', VITE_BUILD_PATH: '../../dist' });
	const output = resolve(root, 'desktop/packages/web/public/leinuo');
	mkdirSync(output, { recursive: true });
	for (const name of ['ocs.user.js', 'ocs.common.user.js', 'index.js', 'style.css']) {
		copyFileSync(resolve(root, 'userscript/dist', name), resolve(output, name));
	}
	copyFileSync(resolve(root, 'userscript/LICENSE'), resolve(output, 'LICENSE'));
	const generated = readFileSync(resolve(output, 'ocs.user.js'), 'utf8');
	if (!/^\/\/\s*@name\s+雷诺网课\s*$/m.test(generated)) throw new Error('脚本品牌校验失败');
}
function desktop() {
	run('desktop', ['typecheck']);
	run('desktop', ['--filter', '@ocs-desktop/app', 'build']);
}

switch (task) {
	case 'setup':
		run('userscript', ['install', '--frozen-lockfile']);
		run('desktop', ['install', '--frozen-lockfile']);
		break;
	case 'script': script(); break;
	case 'desktop': script(); desktop(); break;
	case 'build': script(); desktop(); break;
	case 'check':
		run('userscript', ['tsc:check']);
		run('userscript', ['test']);
		run('desktop', ['typecheck']);
		break;
	case 'dev': script(); run('desktop', ['dev']); break;
	case 'dist': script(); run('desktop', ['build']); break;
	default: throw new Error('支持 setup / script / desktop / build / check / dev / dist');
}
