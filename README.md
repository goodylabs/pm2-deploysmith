# 🛠️ pm2-deploysmith

CLI tool to generate a PM2 `post-deploy` command using the standard `releases/` + `current/` symlink pattern.

Built for Node.js environments using `pnpm`, `pm2`, and optionally `nvm`.

![CI](https://github.com/goodylabs/pm2-deploysmith/actions/workflows/ci.yml/badge.svg)
[![npm version](https://img.shields.io/npm/v/pm2-deploysmith.svg)](https://www.npmjs.com/package/pm2-deploysmith)
[![npm downloads](https://img.shields.io/npm/dm/pm2-deploysmith.svg)](https://www.npmjs.com/package/pm2-deploysmith)
![license](https://img.shields.io/npm/l/pm2-deploysmith.svg)
![node](https://img.shields.io/node/v/pm2-deploysmith)
![built with pnpm](https://img.shields.io/badge/built%20with-pnpm-ff69b4.svg)
[![open issues](https://img.shields.io/github/issues/goodylabs/pm2-deploysmith.svg)](https://github.com/goodylabs/pm2-deploysmith/issues)
[![codecov](https://codecov.io/gh/goodylabs/pm2-deploysmith/branch/main/graph/badge.svg)](https://codecov.io/gh/goodylabs/pm2-deploysmith)

---

## 🚀 What It Does

Generates a one-liner `post-deploy` command for your `ecosystem.config.js`, which:

- creates a timestamped release folder (e.g., `releases/build-202507111402`)
- copies code from `source/` to new release directory
- installs dependencies using `pnpm`
- compiles your code using a `build:staging` or `build:production` script from package.json
- sets `current/` symlink
- reloads `pm2`
- deletes old builds (keeps last `n`, default: 4)

---

## 🧑‍💻 Installation

```bash
pnpm add -g pm2-deploysmith
```


## 🏃 Usage

Interactive mode:

```bash
pm2-deploysmith
```

This will prompt you to enter:

* system user (e.g., ubuntu)
* project sub-directory (e.g., my-app)
* environment (e.g., production)

With CLI flags (no prompts):
```bash
pm2-deploysmith --systemUser ubuntu --projectSubDir my-app --environment production
```

Additional optional flags:

--numOfKeptReleases - how many old releases to keep (default: 4)

--skipSourceNvm - if you don't want to run `source ~/.nvm/nvm.sh` first

--addSourceProfile - if you want to run `source ~/.profile` first


### Example:

```bash
pm2-deploysmith \
  --systemUser ubuntu \
  --projectSubDir my-app \
  --environment production \
  --numOfKeptReleases 6 \
  --skipSourceNvm \
  --addSourceProfile
```

🧪 Output

You wiil get a full post-deploy command like this:

```bash

source ~/.profile \
&& BUILD_TIMESTAMP=$(date +%Y%m%d%H%M) \
&& mkdir -p /home/ubuntu/my-app/releases/build-$BUILD_TIMESTAMP \
&& cp -a /home/ubuntu/my-app/source/. /home/ubuntu/my-app/releases/build-$BUILD_TIMESTAMP/ \
&& cd /home/ubuntu/my-app/releases/build-$BUILD_TIMESTAMP/ \
&& nvm install \
&& nvm use \
&& npm install -g pnpm \
&& npm install -g pm2 \
&& pnpm install \
&& pnpm build:production \
&& rm /home/ubuntu/my-app/current \
&& ln -sfn /home/ubuntu/my-app/releases/build-$BUILD_TIMESTAMP /home/ubuntu/my-app/current \
&& cd /home/ubuntu/my-app/current \
&& pm2 reload ecosystem.config.js --env production --cwd /home/ubuntu/my-app/current \
&& ls -dt /home/ubuntu/my-app/releases/* | tail -n +4 | xargs rm -rf

```

Copy-paste that into your ecosystem.config.js:

```js
module.exports = {
  apps: [...],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'your-server',
      ref: 'origin/master',
      repo: 'git@github.com:you/your-repo.git',
      path: '/home/ubuntu/my-app',
      'post-deploy': '<< PASTE OUTPUT HERE >>'
    }
  }
}
```

📄 License
MIT © 2025 goodylabs
