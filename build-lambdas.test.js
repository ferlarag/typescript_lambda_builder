const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const esbuild = require("esbuild");

const {
  cleanDirectories,
  buildFunction,
  zipFunction,
  createConfig,
} = require("./build-lambdas");

jest.mock("fs");
jest.mock("archiver");
jest.mock("esbuild");

// Test for cleaning directories
describe("cleanDirectories", () => {
  it("should clean and recreate dist and zip directories", () => {
    // Mock fs.existsSync to return true (i.e., directories exist)
    fs.existsSync.mockReturnValueOnce(true).mockReturnValueOnce(true);

    // Mock fs.rmSync to do nothing (since we're testing the logic)
    fs.rmSync.mockImplementation(() => {});

    // Mock fs.mkdirSync to do nothing
    fs.mkdirSync.mockImplementation(() => {});

    const distDir = path.join(__dirname, "dist");
    const zipDir = path.join(__dirname, "dist", "zip");

    cleanDirectories(distDir, zipDir);

    expect(fs.rmSync).toHaveBeenCalledWith(distDir, {
      recursive: true,
      force: true,
    });
    expect(fs.mkdirSync).toHaveBeenCalledTimes(2);
    expect(fs.mkdirSync).toHaveBeenCalledWith(distDir, {recursive: true});
    expect(fs.mkdirSync).toHaveBeenCalledWith(zipDir, {recursive: true});
  });
});

// Test for buildFunction (esbuild logic)
describe("buildFunction", () => {
  it("should call esbuild.buildSync with the correct parameters", () => {
    const entry = "src/functionA/GET.ts";
    const outFile = "dist/functionA-GET.js";

    // Mock esbuild.buildSync to track its calls
    esbuild.buildSync.mockImplementation(() => {});

    buildFunction(entry, outFile);

    expect(esbuild.buildSync).toHaveBeenCalledWith({
      entryPoints: [entry],
      outfile: outFile,
      bundle: true,
      platform: "node",
      target: "node16",
    });
  });
});

// Test for zipFunction
describe("zipFunction", () => {
  it("should call archiver to create a zip file", () => {
    const outFile = "dist/functionA-GET.js";
    const zipFilePath = "dist/zip/functionA-GET.zip";

    const mockArchive = {
      pipe: jest.fn(),
      append: jest.fn(),
      finalize: jest.fn(),
    };
    archiver.mockReturnValue(mockArchive);

    zipFunction(outFile, zipFilePath);

    expect(archiver).toHaveBeenCalledWith("zip", {zlib: {level: 9}});
    expect(mockArchive.pipe).toHaveBeenCalled();
    expect(mockArchive.append).toHaveBeenCalledWith(
      fs.createReadStream(outFile),
      {
        name: "functionA-GET.js",
      }
    );
    expect(mockArchive.finalize).toHaveBeenCalled();
  });
});

// Test for createConfig
describe("createConfig", () => {
  it("should correctly update the config object", () => {
    const config = {};
    const func = "functionA";
    const method = "GET";
    const outFile = "dist/functionA-GET.js";

    const updatedConfig = createConfig(func, method, outFile, config);

    expect(updatedConfig).toEqual({
      [`${func}-${method}`]: {path: outFile, method},
    });
  });
});
