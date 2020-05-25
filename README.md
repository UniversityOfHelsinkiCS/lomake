![Test and build staging-image](https://github.com/UniversityOfHelsinkiCS/lomake/workflows/Test%20and%20build%20staging-image/badge.svg)
![Test and build production-image](https://github.com/UniversityOfHelsinkiCS/lomake/workflows/Test%20and%20build%20production-image/badge.svg)

## Short tutorial

The project is split into 2 parts: client and server while index.js in root works as the main file. The project contains no database dependant parts.

### How to start development

1. git clone
2. run `npm install`
3. run `npm run dev`
4. run `docker exec -it lomake_dev bash -c "node index.js seed"`
5. go to http://localhost:8000

### Changing logged in user while developing

Use setHeaders() to select user for development purposes.

### Seeding the database for production

When deploying Lomake to a production server for the first time, the database should be seeded.

The seeding should be performed only **once** by executing `docker exec -it lomake bash -c "node index.js seed"`

### Running Cypress tests

There's quite a lot of end-to-end tests in the cypress/integration folder.

To run these tests, simply execute `npm run cypress:open` and select _Run all specs_ from the GUI.

### ApiConnection

ApiConnection is a custom redux middleware that is used in most toska software. It is used to simplify redux usage by wrapping axios.

You can see redux example using apiConnection in client/components/MessageComponent.

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
| type        | enum      | Yes      | TEXTAREA, ENTITY, MEASURES or TITLE                                       |
| label       | Localized | Yes      | Label of the form field                                                   |
| required    | boolean   | No       | Is the form field required to be filled to submit the form                |
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
