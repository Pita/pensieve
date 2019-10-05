# Herald LP

A landingpage for a secret project. More details can be found in each sections README.md

## Structure

- backend: It is build on the top of AWS Infrastructure using serverless framework.
- frontend: Static website with webpack as build tool.
- cloudfront: It consists of AWS cloudfront configurations which is required to setup the project. Please make sure that backend and frontend was deployed before run the cloudfront.

## URLs

## Development

### Runtime

The application is running under the DPM DEV account in AWS.

### Setup / Tools

- Written in TypeScript (?!)
- Yarn for installation

### Start

NOTE: You have to start backend and frontend manually

1. Got to your section, e.g. frontend
2. Install dependencies

```shell
  yarn install
```

3. Start the project

```shell
  yarn start
```
