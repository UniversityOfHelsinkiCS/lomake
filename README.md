![Test and build staging-image](https://github.com/UniversityOfHelsinkiCS/lomake/workflows/Test%20and%20build%20staging-image/badge.svg)
[![Build production image](https://github.com/UniversityOfHelsinkiCS/lomake/actions/workflows/production.yml/badge.svg)](https://github.com/UniversityOfHelsinkiCS/lomake/actions/workflows/production.yml)

## Short tutorial

The project is split into 2 parts: client and server while index.js in root works as the main file. The project contains no database dependant parts.

### How to start development

1. git clone
2. run `npm install`
3. run `npm run dev`
4. run `docker exec -it lomake_dev bash -c "node index.js seed"` OR obtain a database dump and use that while developing (see [this page](https://www.postgresqltutorial.com/postgresql-restore-database/))
5. go to http://localhost:8000

### Changing logged in user while developing

Use setHeaders() to select user for development purposes.

### Accessing the database while developing

1. run `docker exec -it lomake_db bash`
2. enter with `psql -U postgres` 

### Seeding the database for production

When deploying Lomake to a production server for the first time, the database should be seeded.

The seeding should be performed only **once** by executing `docker exec -it lomake bash -c "node index.js seed"`

### Running Cypress tests

There's quite a lot of end-to-end tests in the cypress/integration folder.

To run these tests, simply execute `npm run cypress:open` and select _Run all specs_ from the GUI.

### ApiConnection

ApiConnection is a custom redux middleware that is used in most toska software. It is used to simplify redux usage by wrapping axios.

You can see redux example using apiConnection in client/components/MessageComponent.

## Questions
Tilannekuvalomake has various sets of questions in separate files. All question files are in the format of an array of `Section` objects and can be found under **client/questionData/**.

### Yearly assessment

The current questions of the yearly assessment (vuosiseuranta) form can be found in **yearlyQuestions.json**.

### Evaluation

The current questions of the evaluation (katselmus) form can be found in **evaluationQuestions.json**. 

### Degree reform

The current questions of the degree reform forms can be found in **degreeReformIndividualQuestions.json** and **degreeReformQuestions.json**.


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
| type        | enum      | Yes      | TEXTAREA, ENTITY, MEASURES, ACTIONS, CHOOSE-RADIO,CHOOSE-ADVANCED, SELECTION, ORDER, or TITLE |
| label       | Localized | Yes      | Label of the form field                                                   |
| required    | boolean   | No       | Is the form field required to be filled to submit the form                |
| description | Localized | No       | (ENTITY only) More detailed explanation                                   |
| no_color    | boolean   | No       | (ENTITY only) If `true` Entity doesn't contain a color form field         |
| relatedYearlyQuestions  | array | No| (Evaluation only) List of yearly assessment questions the evaluation question builds on |
| radio_options| Localized   | No        | (Reform only) Options for radio buttons                               |
| options     |  { Localized } | No       | (ORDER and SELECTION only) Options for selectiong and ordering, containing language versions, eg, norppa: { Localized }         |

**Localized**

| Property | Type   | Required | Description  |
| -------- | ------ | -------- | ------------ |
| fi       | string | Yes      | Finnish text |
| se       | string | Yes      | Swedish text |
| en       | string | Yes      | English text |




## IAMs

This project uses IAMs for access control. You can find the IAM-based access configs in ```config > IAMConfig.js```. In Lomake itself admins can find a table of different access types and corresponding IAM-groups (```OSPA > IAM-ryhmät```).
