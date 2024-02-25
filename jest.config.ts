import type { JestConfigWithTsJest } from "ts-jest";

export default {
  roots: ["<rootDir>/src/", "<rootDir>/__test__/"],
  preset: "ts-jest",
  testEnvironment: "node",
} satisfies JestConfigWithTsJest;
