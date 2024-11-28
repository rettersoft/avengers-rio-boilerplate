# Avengers Rio Boilerplate

This document defines a set of rules for standardizing software development in Retter’s Avengers team.

## Project Structure

All projects should follow Rio v2.x documentation for more suitable structure.

- .github
  - workflows
    - on-deploy-{STAGE}.yml
    - on-deploy-docs-{STAGE}.yml
    - on-pull-request.yml (runs linter and tests)
- classes
  - SampleClass
    - tests/
    - utils/
    - models/
      - common
      - input
      - output
    authorizer.ts
    index.ts
    template.yml
- dependencies
  - custom-dependency
    - index.ts
- package.json
- tsconfig.json

### Classes

All classes are stored in the classes folder by their UpperCamelCase name.
For each class, there might be at least three different folders: *tests*, *models* and *utils*.
Utils folder is for storing various sets of helper functions.
Models folder is for storing state models as well as input and output models.
Last but not least, the tests folder is for unit tests.

> Unlike the classes, methods and variables are named by camelCase strategy.

### Custom Dependencies

Since Rio v2.0, all classes are deployed together.
That means, they can access each other’s codebase.
Because of that, instead of using custom dependencies for common code blocks, they should be used for creating isolated reusable components such as wrapper client implementations for api calls outside of the Rio ecosystem.

### CI / CD Workflows

All CI / CD workflows run on Github Actions.
There are separate flows for deploying each project as well as the pull requests and documentations.

### Repository & Branch Management

The project lives in a private repository inside a Github account held by Retter and only team members can have write access to it.

The root branch is always called “main” and no one can send a commit directly to it. Instead of that, the developers should create a feature branch for each task and ask for a merge via a pull request.

The project should have at least 5 branches: main, dev, staging, uat and prod. As we mentioned earlier, main is the “main” branch. Everything starts from it. Besides that, dev is for development, staging is for internal acceptance tests, uat is for customer approval tests and then prod is for the production.

All developers create their feature branches from the main branch and develop their solutions inside them. To be able to test their feature branches, they should merge them to the development branch. If everything is OK within the development environment, then, they should merge their feature branches to the staging branch. The Avengers should make sure that every feature branch in the staging environment is stable before creating a pull request against the uat branch.

> Pull requests should have at least 3 reviewers and 1 assignee and they should merge by “Squash and Merge” strategy.

After the review processes, accepted PRs merge to the uat branch. Our and customers’ tester teams evaluate the final stage of uat environment according to the tasks. At the end, if everything is OK in uat, team can create another pull request from uat to the production branch. If there are branches merged to uat which are not going to be released into production yet, then, the developers should create pull requests from their features branches to the production.
