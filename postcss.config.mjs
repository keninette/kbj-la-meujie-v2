import bemLinter from "postcss-bem-linter";
import postCssReporter from "postcss-reporter";

export default {
  plugins: [
    bemLinter({
      preset: "bem",
      implicitComponents: "app/**/*.module.scss",
      // Custom selector to forbid modifiers starting with '_' instead of '--'  // '_' is allowed by BEM, but we chose '--' because it's easier to read
      componentSelectors: "^.{componentName}(([_]{2}|[-]{2})[a-z-]+)*$", // ignore animations selectors
      ignoreSelectors: [/^\d+%$/, /^from|to$/],
    }),
    postCssReporter({
      plugins: ["postcss-bem-linter"],
      clearReportedMessages: true,
      throwError: true,
    }),
  ],
};
