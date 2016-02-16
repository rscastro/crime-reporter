# Crime Reporter

React application where users can report and categorize crimes they encounter on a map interface. Other users can see areas with high criminal activity.

This application was developed/forked from [skepticaltheramin](https://github.com/skepticaltheremin/skepticaltheremin)

## Team

  - __Product Owner__: Richard Castro
  - __Scrum Master__: Hahnbi Sun
  - __Development Team Members__: Suya Xu, Ian Bulmer


## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Team](#team)
1. [Contributing](#contributing)

## Usage

- For development, run node (or nodemon) "server.js" to begin running the server. From there, it is a good idea to run "webpack --watch" while making changes to the client-side (React.js) code, so that it re-compiles as changes are saved. If you opt not to run "webpack --watch", you will still need to run "webpack" at least once, the first time, to compile the JavaScript into a file that will be called "bundle.js".

> You will also need to have Mongo installed. Mongod needs to be running locally. Alternatively, a MongoLab account

## Requirements

- "babel": "^6.3.26",
- "babel-core": "^6.4.0",
- "babel-loader": "^6.2.1",
- "babel-preset-es2015": "^6.3.13",
- "babel-preset-react": "^6.3.13",
- "body-parser": "^1.14.2",
- "express": "^4.13.3",
- "history": "^1.17.0",
- "moment": "^2.11.0",
- "mongoose": "^4.3.5",
- "react": "^0.14.6",
- "react-dom": "^0.14.6",
- "react-router": "^1.0.3",
- "webpack": "^1.12.10",
- "webpack-dev-server": "^1.14.0"

## Development

### Installing Dependencies

From within the root directory:

```sh
npm install
```

### Roadmap

- Improve UI
- Create mobile version


## Contributing

Please see the [Contributing](CONTRIBUTING.md)
