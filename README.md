## Introduction

This repository is a demo project showcasing API testing using [Playwright](https://playwright.dev/). It includes a collection of automated tests designed to interact with and validate responses from the [Airport Gap API](https://airportgap.com), an API that provides information about various airports around the world.

## Getting Started

1. Clone this repository:

```shell
    git clone https://github.com/AlexKalyna/airportgap-api-playwright-demo.git
```

2. Install the dependencies:

```shell
    npm install
```

3. Install Playwright:

```shell
    npm install playwright
```

4. Create a `.env.<environment name>` files in `envs` folder of the project ( ideally by copying `.env.localhost.example` ).


5. Run all tests in production environment:

```shell
    npm run test
```
For other environments see `scripts` in the package.json file

6. Show report:

 ```shell
    npm run report
```

## Test Scenarios

The scenarios for API tests can be found [here](./test_scenarios.txt)


## License

This project is licensed under the [MIT License](./LICENSE).