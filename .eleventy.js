const rollupPlugin = require("eleventy-plugin-rollup");
const resolve = require("@rollup/plugin-node-resolve");
const replace = require("@rollup/plugin-replace");
const terser = require("@rollup/plugin-terser");
const format = require("date-fns/format");

const REPLACE_PREFIX = "ELEVENTY_REPLACE_";

function extractEnvMap() {
  const result = {};

  Object.keys(process.env).forEach(function (key) {
    if (key.startsWith(REPLACE_PREFIX)) {
      result[key] = process.env[key];
    }
  });

  return result;
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(rollupPlugin, {
    rollupOptions: {
      output: {
        format: "es",
        dir: "_site/js",
      },
      plugins: [
        replace({
          preventAssignment: true,
          values: extractEnvMap(),
        }),
        resolve(),
      ],
    },
  });

  eleventyConfig.addFilter("dateformat", function (value) {
    if (value instanceof Date) {
      return format(value, "yyyy-MM-dd");
    } else {
      return value;
    }
  });

  return {
    templateFormats: ["html", "njk", "md"],

    dir: {
      input: "content",
      includes: "../_includes",
      data: "../_data",
      output: "_site",
    },
  };
};
