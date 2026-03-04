const originalWarn = console.warn;

console.warn = (...args) => {
  const message = args.map((arg) => String(arg)).join(" ");

  if (
    message.includes("[baseline-browser-mapping]") &&
    message.includes("over two months old")
  ) {
    return;
  }

  originalWarn(...args);
};
