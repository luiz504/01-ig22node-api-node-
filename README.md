# Transaction API

This repository provides an API for a web service that offers various features
related to managing transactions. The API is designed to run on the
[API URL](https://zero2-ig22-api-nodejs.onrender.com).

To test the API, you can import the Insomnia_XXXX-XX-XX.json file into your preferred tool, such as Insomnia or Postman, to easily perform test scenarios.

## SRS - Software Requirements Specification

### FR - Functional Requirement

- [x] The user should be able to create a new transaction;
- [x] The user should be able to get a resume of their account;
- [x] The user should be able to list all transactions previously created;
- [x] The user should be able to get unique transaction data;

### BR - Business Rules

- [x] The transaction can be of type `credit` that will add to the total amount or `debit` that will subtract from the total amount;
- [x] The system should identify the user in API requests;
- [x] The users must have access only to their own transactions.
