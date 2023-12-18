# Taskify

Visit the website on `https://cc221005-10055.node.fhstp.io/`


## Setup

After downloading the folder, make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install
```

## Start Server

Start the development server on `http://localhost:3000`

```bash
npm run dev
```

## Folder Structure

### Assets

The assets folder contains the css folder with the main.css file for all the main styles which appear the same throughout the entire application. TailwindCSS is used for the styles. (`https://tailwindcss.com/`) 

### Components

All components like user item, task item, group item, icons and buttons are inside the components folder. They represent the basic structure of each item so that it appears the same way throughout the entire website.

### Composables

The composables folder contains global functions like markComleted() and verifyAuthentication(). All functions that are used more often insdie the application should be placed inside the composables folder.

### Layouts

This folder includes files, which represent the basic structure of the website. Default.vue represents the structure of the basic views with a header and a body. Login.vue represents the basic website structure of the login pages. So basically no header, just the body.

### Pages

The pages folder contains all page files which illustrate the frontend. The index.vue file inside the root directory of this folder is the first page the user sees when first visiting the website. It represents the login screen. The other files and folders (register.vue, groups, tasks, users) represent further main- and subpages of the website

### Public
The public folder contains a folder named images, which includes all images that are used throughout the app.

### Server

This folder contains all the backend code. Basic files like db.js for database connection and auth.js for authentication are located inside the root directory of this folder. All API requests are located inside the api folder and all database query-files are located inside the model folder.

### app.vue

App.vue is the entry point of the website which directly shows the index.vue page from the root directory of the page folder.