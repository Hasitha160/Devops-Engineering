let tailwindCss;
try {
  // attempt to require tailwindcss if it's installed
  tailwindCss = require("tailwindcss");
} catch (err) {
  // tailwind is not installed — continue without it
  tailwindCss = null;
  // optional: log a small message to make debugging easier
  // console.warn("tailwindcss not found, PostCSS will run without Tailwind.");
}

const autoprefixer = (() => {
  try { return require("autoprefixer"); } catch { return null; }
})();

const plugins = {};
if (tailwindCss) plugins["tailwindcss"] = tailwindCss;
if (autoprefixer) plugins["autoprefixer"] = autoprefixer;

module.exports = { plugins };
