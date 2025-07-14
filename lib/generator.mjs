export function generatePm2PostDeployLine(options) {
  let line = "";

  let basePath = ``;
  let environment = options["environment"] || options["env"];
  let buildEnvironment = (options["buildEnvironment"]) ? (options["buildEnvironment"]) : environment;
  let packageManager = (options["packageManager"]) ? options["packageManager"] : "pnpm";
  let prependBeforeBuild = (options["prependBeforeBuild"]) ? options["prependBeforeBuild"] : null;
  let numOfKeptReleases = (options["numOfKeptReleases"]) ? (parseInt(options["numOfKeptReleases"], 10) + 2) : "4";

  if (options["skipSourceNvm"]) {
    line += ""
  } else {
    line += " source ~/.nvm/nvm.sh "
  }

  if (options["addSourceProfile"]) {
    line += " source ~/.profile "
  }

  // generate BUILD_TIMESTAMP
  line += "&& BUILD_TIMESTAMP=$(date +%Y%m%d%H%M) "

  if (options["projectSubDir"] && options["projectSubDir"] !== "" ) {
    basePath = `/home/${options["systemUser"]}/${options["projectSubDir"]}`;
  } else {
    basePath = `/home/${options["systemUser"]}`;
  }

  // mkdir first releases subdir
  line += `&& mkdir -p ${basePath}/releases/build-$BUILD_TIMESTAMP `

  // copy source to new release path
  line += `&& cp -a ${basePath}/source/. ${basePath}/releases/build-$BUILD_TIMESTAMP/ `

  // go to new release path
  line += `&& cd ${basePath}/releases/build-$BUILD_TIMESTAMP/ `

  // nvm install
  line += `&& nvm install `

  // nvm use
  line += `&& nvm use `

  // install packageManager
  line += `&& npm install -g ${packageManager} `

  // install pm2
  line += `&& npm install -g pm2 `

  // run ${packageManager} install
  line += `&& ${packageManager} install `

  if (prependBeforeBuild) {
    line += `&& ${prependBeforeBuild} `
  }

  // build stage
  line += `&& ${packageManager} build:${buildEnvironment} `

  // switch symlink
  line += `&& rm ${basePath}/current && ln -sfn ${basePath}/releases/build-$BUILD_TIMESTAMP ${basePath}/current `

  // go to current
  line += `&& cd ${basePath}/current `

  // pm2 reload
  line += `&& pm2 reload ecosystem.config.js --env ${environment} --cwd ${basePath}/current `

  // remove old releases and keep last n releases
  line += `&& ls -dt ${basePath}/releases/* | tail -n +${numOfKeptReleases} | xargs rm -rf `

  return line;
}
