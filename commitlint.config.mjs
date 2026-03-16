export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "style",
        "api",
        "refactor",
        "chore",
        "deploy",
        "test",
        "rename",
        "remove",
        "docs",
        "!HOTFIX",
        "!BREAKING CHANGE",
        "init",
      ],
    ],
    "scope-enum": [2, "always", ["web", "admin", "api", "ui", "shared", "root"]],
    "scope-empty": [2, "never"],
  },
};
