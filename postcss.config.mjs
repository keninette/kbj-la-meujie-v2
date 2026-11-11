import bemLinter from "postcss-bem-linter";
import postCssReporter from "postcss-reporter";

const postcssConfig = {
  plugins: [
    bemLinter({
      preset: "bem",
      implicitComponents: "app/**/*.module.scss",
      // Only block, block__element, block--modifier or block__element--modifier:
      // - no element in an element (block__a__b), no modifier of a modifier
      // - modifiers start with '--', not '_' (allowed by BEM, but harder to read)
      componentSelectors:
        "^\\.{componentName}(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$",
      // Keyframes of the animations
      ignoreSelectors: [/^\d+%$/, /^(from|to)$/],
    }),
    postCssReporter({
      plugins: ["postcss-bem-linter"],
      clearReportedMessages: true,
      throwError: true,
    }),
  ],
};

export default postcssConfig;
