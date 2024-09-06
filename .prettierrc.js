module.exports = {
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: "none",
  useTabs: false,
  bracketSpacing: true,
  allowParens: "avoid",
  overrides: [
    {
      files: ["*.sql"],
      options: {
        printWidth: 200,
      },
    },
    {
      files: ["*.prisma", "*.js", "*.ts"],
      options: {
        printWidth: 80,
      },
    },
  ],
};
