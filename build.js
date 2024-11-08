const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");
const archiver = require("archiver");

// Your functions (cleaning directories, building, etc.)
const srcDir = path.join(__dirname, "src");
const distDir = path.join(__dirname, "dist");
const zipDir = path.join(distDir, "zip");

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

// Main function to build the files
function build() {
  // Clean directories
  cleanDirectories(distDir, zipDir);

  const functions = fs
    .readdirSync(srcDir)
    .filter((file) => fs.lstatSync(path.join(srcDir, file)).isDirectory());

  const config = {};

  // Loop over all functions
  functions.forEach((func) => {
    const entryDir = path.join(srcDir, func);
    const methodFiles = fs
      .readdirSync(entryDir)
      .filter((file) => file.endsWith(".ts"));

    methodFiles.forEach((file) => {
      const method = path.basename(file, ".ts"); // Extract the method name (POST, GET, etc.)
      const entry = path.join(entryDir, file);
      const outFile = path.join(distDir, `${func}-${method}.js`);

      // Build TypeScript to JavaScript
      buildFunction(entry, outFile);

      // Create config entry
      createConfig(func, method, outFile, config);

      // Zip the output
      const zipFilePath = path.join(zipDir, `${func}-${method}.zip`);
      zipFunction(outFile, zipFilePath);

      console.log(`Built and zipped ${func}-${method}`);
    });
  });

  // Write the configuration to a JSON file
  const configFilePath = path.join(distDir, "lambda-config.json");
  fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
  console.log("Lambda configuration saved to lambda-config.json");
}

// Run the build process
build();
