const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

// Function to clean directories
function cleanDirectories(distDir, zipDir) {
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, {recursive: true, force: true});
  }
  fs.mkdirSync(distDir, {recursive: true});
  fs.mkdirSync(zipDir, {recursive: true});
}

// Function to build a single TypeScript file to JavaScript
function buildFunction(entry, outFile) {
  esbuild.buildSync({
    entryPoints: [entry],
    outfile: outFile,
    bundle: true,
    platform: "node",
    target: "node16",
  });
}

// Function to zip the output file
function zipFunction(outFile, zipFilePath) {
  const output = fs.createWriteStream(zipFilePath);
  const archive = archiver("zip", {zlib: {level: 9}});

  archive.pipe(output);
  archive.append(fs.createReadStream(outFile), {name: path.basename(outFile)});
  archive.finalize();
}

// Function to create the configuration
function createConfig(func, method, outFile, config) {
  config[`${func}-${method}`] = {path: outFile, method};
  return config;
}

module.exports = {
  cleanDirectories,
  buildFunction,
  zipFunction,
  createConfig,
};
