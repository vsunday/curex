module.exports = {
  "globDirectory": "build/",
  "globPatterns": [
    "**/*.{css,svg,html}"
  ],
  "swDest": "build/sw.js",
  "swSrc": "src/sw.js",
  "globIgnores": [
    "../workbox-config.js"]
};