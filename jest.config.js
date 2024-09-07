/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  // Testing the in-browser functionality.
  testEnvironment: "jsdom",
  transform: {
    // Add TypeScript support to Jest.
    "^.+.tsx?$": ["ts-jest", {}],
  },
};