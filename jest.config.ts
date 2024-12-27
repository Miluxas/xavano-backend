import type { Config } from "jest";

const config: Config = {
  extensionsToTreatAsEsm: [".ts"],
  verbose: true,
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  testRegex: ".e2e-spec.ts$",
  transform: {
    "^.+\\.(ts|tsx)?$": ["ts-jest", { useESM: true }]
  },
  testPathIgnorePatterns: ["./dist"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  } 
};
export default config;
