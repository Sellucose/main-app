# Main REST API server for Sellucose
This is the main REST API server, it includes these several modules:
1. Auth
2. Profile
3. Saved Books
4. Rated Books

This project is using Node.js **v18.20.3**.

## Directory structure
```
├── config/
│   └── firestoreConfig.js
├── controllers/
│   ├── authUsersController.js
│   ├── profileController.js
│   ├── ratingBookController.js
│   └── savedBooksController.js
├── middlewares/
│   └── auth.js
├── models/
│   ├── bookModel.js
│   ├── ratingBook.js
│   ├── savedBookModel.js
│   └── userModel.js
├── routes/
│   ├── route.js
│   ├── authRoute.js
│   ├── profileRoute.js
│   ├── rateBookRoute.js
│   └── savedBookRoute.js
└── server.js
```

### config
This directory is used for storing any **third-party client/library** initializer or configuration. In this current project we are using Firestore to store our data, so we put the Firestore object and it's configuration in the ``firestoreConfig.js``.

### controllers
As it's named, this directory is used to store the controller files. Controllers must be only handle the validation and business logics.

### middlewares
Same as its name, this directory will store all middlewares needed, currently this project only has one ``auth.js`` middleware to validate the JWT token and save the payload data to the request object.

### models
This directory is used to store the models. Model files contain functions that do the CRUD actions and their logics.

### routes
In the ``routes`` directory, the ``route.js`` file collects all the routes from each module routes. So that file must import each of all route module files as been written in the ``route.js``.

### server.js
As like the common standard for Express or any REST API app, this ``server.js`` is used to initialize the server, it includes initialize the routes and the port.

## Environment variables
As been written in the ``.env`` file, there are 7 variables that needed to be set up.
1. PORT, the port that server will be listening on.
2. PROJECT_ID, the **Google Cloud Platform** project id.
3. SERVICE_ACCOUNT_PATH, this is the path of the service account json file that should be downloaded from the IAM service and only for the local environment (your PC). In this current development, we save the service account json file in the ``config`` directory.
4. SERVICE_ACCOUNT, this variable only be set up in the Cloud Run container's variables and secrets settings, as we stored the service account json in **Google Secret Manager**.
5. JWT_KEY_PATH, same as ``SERVICE_ACCOUNT_PATH``, this variable is just needed in local environment (your PC). The JWT secret file is just a ``.txt`` file that contains your JWT secret key.
6. JWT_SECRET_KEY, same as ``SERVICE_ACCOUNT``, this variable only be set up in the Cloud Run container's variables and secrets settings, as we stored the JWT secret key in **Google Secret Manager**.