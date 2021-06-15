# Development

## Creating functions

```bash
yarn create:function -f myFunction --handler src/myFunction/index.handler
```

e.g.

```bash
yarn create:function -f api-extension --handler src/api-extension/index.handler
```

## Creating tests

```bash
yarn create:test -f myFunction -p src/myFunction
```

## Running tests

```bash
yarn test [--stage stage] [--region region] [-f function]
```

In case you wish to run the unit tests suite without any pre-configuration, you can use [`src/api-extension/mocks/env/.env.test`](../src/api-extension/mocks/env/.env.test) file as the `.env` by copying it to the repository root before running the tests:
```bash
# from repository root
cp src/api-extension/mocks/env/.env.test .env
# now run tests
yarn test
```

### Running unit tests only



## Deploying application

Deploy all (run only at the first time):

```bash
yarn deploy [--stage stage]
```

Then, after some changes, deploy the modified function:

```bash
yarn deploy -f myFunction
```

## Formatting and linting

```bash
yarn lint
yarn lint:fix
yarn format
```
