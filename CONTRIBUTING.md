# Contributing to `React Hook Form`

As the creators and maintainers of this project, we want to ensure that `@basestacks/schema-form` lives and continues to grow and evolve. We would like to encourage everyone to help and support this library by contributing.

## Code contributions

Here is a quick guide to doing code contributions to the library.

1. Fork and clone the repo to your local machine `git clone https://github.com/basestacks/schema-form`

2. Create a new branch from `master` with a meaningful name for a new feature or an issue you want to work on: `git checkout -b your-meaningful-branch-name`

3. Install packages by running:

   ```shellscript
   pnpm install
   ```

Pay attention that we use pnpm v9 along with Node.js 20.

4. If you've added a code that should be tested, ensure the test suite still passes.

   ```shellscript
   pnpm test
   ```

5. Try to write some unit tests to cover as much of your code as possible.

6. Ensure your code lints without errors.

   ```shellscript
   pnpm lint
   ```

7. Ensure the automation suite passes by running two following commands in parallel:

   ```shellscript
   pnpm start
   # In another terminal, while 'start' runs:
   pnpm test:e2e
   ```

8. Ensure build passes.

   ```shellscript
   pnpm build
   ```

9. Ensure exports are documented. (requires build)

   ```shellscript
   pnpm api-extractor
   ```

10. Push your branch: `git push -u origin your-meaningful-branch-name`

11. Submit a pull request to the upstream react-hook-form repository.

12. Choose a descriptive title and describe your changes briefly.

## Coding style

Please follow the coding style of the project. React Hook Form uses **eslint**. If possible, enable their respective plugins in your editor to get real-time feedback. The linting can be run manually with the following command: `pnpm lint:fix`

## License

By contributing your code to the `@basestacks/schema-form` GitHub repository, you agree to license your contribution under the MIT license.
