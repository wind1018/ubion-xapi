# ubion-xapi-profile

## Contents
1. Package Structure
2. Required node Package

### 1. Package Structure
+ \ubion-xapi-profile
    + \example
    + \json-samples
    + \src
        + \config
            + config.ts
        + \xapi-profile
            + mediaProfile.ts
            + navigationProfile.ts
            + sessionProfile.ts
            + XapiProfile.ts
        + xapi-Builder.ts
    + 시퀀스다이어그램.drawio
    + 클래스다이어그램.drawio
    + package.json
    + README.md
    + tsconfig.json
    + webpack.config.js

### 2. Required node Package
```
npm install

webpack이 설치되어있지 않다면

npm install webpack webpack-cli -g

dependencies
    "awesome-typescript-loader": "^5.2.1", // webpack
    "source-map-loader": "^2.0.1", // webpack
    "tslint": "^6.1.3", // webpack
    "tslint-loader": "^3.5.4", // webpack
    "typescript": "^4.2.4", // typescript
    "uuid": "^8.3.2" // generate UUID
devDependencies
    "@types/node": "^14.14.39"
```