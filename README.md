# Project: tecnica-react

This project is a React application configured with TypeScript, SCSS, and various plugins and tools for development and production builds. Below are the steps to get started with the project, including how to run it in development mode, build it for production, and the default login credentials.

## Table of Contents

- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Building for Production](#building-for-production)
- [Default Login Credentials](#default-login-credentials)
- [Environment Variables](#environment-variables)

## Installation

1. **Clone the repository:**

git clone <repository-url>
cd tecnica-react

## Install the dependencies
```npm install  ```


## Running the Project
To start the development server and open the project in your default browser, run:

```npm start```

This command runs webpack serve --mode development --open, which will start the development server, open the project in your default browser, and enable hot module replacement.

## Building for Production
To create a production build of the project, run:

```npm run build```

This command runs webpack --mode production, which will bundle and optimize the application for production, placing the output in the dist directory.

## Default Login Credentials
For a successful login, use the following default credentials in .env file:


```REACT_APP_PASSWORD=Str0ng!Pass```

```REACT_APP_USERNAME=test@gmail.com ```

## Environment Variables
This project uses the dotenv-webpack plugin to manage environment variables. You can set your environment variables in a .env file in the root of your project. 

For example:
``` REACT_APP_SECRET_KEY=test```

These variables can be accessed in your code using process.env.VARIABLE_NAME.This key is used to decrypt user login data.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
