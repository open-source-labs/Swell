# Check formatting workflow

This is a fully-ready GitHub Actions worflow for verifying whether a
new PR has been formatted with Prettier before the PR can go through.

There are just some complications, explaining why it's an MD file right now:

1. The moment the file gets added as a `.yml` file, it's going to make GitHub reject every single existing file in the codebase that has not been formatted yet. Unfortunately, not every iteration group has followed best practices, so there's a lot to clean up still.
2. This can't be added as a commented-out `.yml` file because GitHub will try to run every single `.yml` file in the `workflows` directory, even if the file has no code to run. If GitHub can't run anything, it's going to spam your emails until you change something.

The `package.json` file has a `format:check`command and`format:fix`command, both of which use Prettier. I would recommend these steps for rolling this feature:

1. Create a separate branch
2. Run `prettier:format`, which will run Prettier repo-wide and update any stray files.
3. Copy the below code into a file named something like `check-formatting.yml`
4. Commit the changes and create a new pull request. Make sure nothing has
   been done other than running the formatting, so that in the off chance that something goes wrong, it'll be easy to roll things back.
5. Merge the PR
6. Start working on new features!

With the file in place, you will need to make sure your code is formatted before being able to merge into main. Everybody has different preferences for how their code is set up, but with the large number of developers who've been involved with Swell, there need to be some ground rules.

```yml
name: Validate Code Formatting

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  format:
    runs-on: ubuntu-latest
    steps:
      - name: Check Out Repo
        uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
      - name: Install NPM Modules
        run: npm ci
      - name: Check Prettier Formatting
        run: npm run format:check
```

