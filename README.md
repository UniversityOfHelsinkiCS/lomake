![Test and build staging-image](https://github.com/UniversityOfHelsinkiCS/lomake/workflows/Test%20and%20build%20staging-image/badge.svg)
![Test and build production-image](https://github.com/UniversityOfHelsinkiCS/lomake/workflows/Test%20and%20build%20production-image/badge.svg)

## Short tutorial

The project is split into 2 parts: client and server while index.js in root works as the main file. The project contains no database dependant parts. 

### ApiConnection

ApiConnection is a custom redux middleware that is used in most toska software. It is used to simplify redux usage by wrapping axios.

You can see redux example using apiConnection in client/components/MessageComponent.

## How users can get started with Toskaboiler

Clone the repo, install node and run `npm install` to get started!

`npm start`
To start the project in production mode use this command. It builds the client and then the server.

`npm run dev`
To start the project in development mode use this command. It will start the server in hotloading mode.

`npm run lint`
To clean all the little style flaws around your code.

`npm run stats`
To create statistics on how big your project is.

Please note that npm test doesn't do anything, this is intentional: testing framework is all up to you. I recommend looking into jest, ava and/or superbara.

## questions.json

The current questions of the form can be found in [questions.json](https://github.com/UniversityOfHelsinkiCS/lomake/blob/master/client/questions.json). Its format is an array of `Section` objects:

**Section**

| Property   | Type                      | Required                 | Description                      |
| ---------- | ------------------------- | ------------------------ | -------------------------------- |
| title      | Localized                 | Yes                      | Title of the section             |
| link_title | Localized                 | No                       | Title of the link of the section |
| link_url   | string                    | Yes if link_title exists | URL of the link of the section   |
| parts      | Array of Question objects | Yes                      | Contains actual form fields      |

**Question**

| Property    | Type      | Required | Description                                                               |
| ----------- | --------- | -------- | ------------------------------------------------------------------------- |
| id          | string    | Yes      |
| type        | enum      | Yes      | TEXTAREA, ENTITY or MEASURES                                              |
| label       | Localized | Yes      | Label of the form field                                                   |
| required    | boolean   | Yes      | Is the form field required to be filled to submit the form                |
| description | Localized | No       | (ENTITY only) More detailed explanation                                   |
| no_light    | boolean   | No       | (ENTITY only) If `true` Entity doesn't contain a light (emoji) form field |

**Localized**

| Property | Type   | Required | Description  |
| -------- | ------ | -------- | ------------ |
| fi       | string | Yes      | Finnish text |
| se       | string | Yes      | Swedish text |
| en       | string | Yes      | English text |

![Example of an entity](https://raw.githubusercontent.com/UniversityOfHelsinkiCS/lomake/master/entity_example.png)
_Example of the ENTITY type containing title, description, text area and light form field (emoji selector)_

### How to start development:

- git clone
- npm install
- npm run dev
- localhost:8000
- use setHeaders() to select user for development purposes

