# 401-midterm com

[![Build Status](https://travis-ci.org/401Midterm/CompeteMe.svg?branch=master)](https://travis-ci.org/401Midterm/CompeteMe)

##  **About This App**

This application is designed to allow users to form their own communities based on where they live. A user can sign up for a new account and post an activity that they would like their community to engage in, which then allows other users to view and interact with it. The activities are given a leaderboard for each location, so the community can see the fastest/highest scores for this event in their area.

### **Installing and How to Use**

To install this program as a developer, fork and clone this repo to your computer. 
Then from the terminal, install npm and httpie:
```sh
$ npm install npm@latest -g
$ brew install httpie
```

Once those have completed install package dependencies by typing.
```sh
$ npm install
```

Next include these scripts in your package.json file.
```js
 "scripts": {
    "start": "node index.js",
    "start:watch": "nodemon index.js",
    "start:debug": "DEBUG=http* nodemon index.js",
    "start:debug-win": "set DEBUG=serve* & nodemon index.js",
    "test": "jest -i",
    "test:watch": "jest -i --watchAll",
    "test:debug": "DEBUG=http* jest -i",
    "test:debug-win": "set DEBUG=serve* & jest -i",
    "lint": "eslint .",
    "lint:test": "npm run lint && npm test",
    "start-db": "mkdir -p ./data/db && mongod --dbpath ./data/db",
    "start-db-win": "mkdir -p ./data/db & mongod --dbpath ./data/db",
    "stop-db": "killall mongod"
  },
  ```

Next include these variables in your .env file:
```js
PORT=4000
MONGODB_URI='mongodb://localhost/competeMe'
APP_SECRET='<secret>'
ADMIN_CODE='<admin code>'
```


## **Getting Started**

### **Starting Server and Database**

Run the server start command in the terminal:
```sh
$ node run start
```

The terminal should output:
```sh
> Server running on <PORT>
```

Run the mongoDB database start commmand another terminal window:
```sh
$ node run start-db
```

## **User Commands**

### **Sign Up**

To sign up, enter the following command, with required parameters `username`, `email`, and `password`:
```sh
$ http POST https://competeme-deploy.herokuapp.com/api/v1/signup username=<username> password=<password> email=<email address>
```

If all the parameters are valid, the server will return a `token` and a `201` status code. This `token` is necessary to access all other functionality in the app.

The `token` should look something like this (example):
```sh
> eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjU2Mjg1YzIyZTg5MDA2YjM2ODEzMmI4MjI2YWNlNzczNmI0OTNkMjY1MTZlNmZiMTFlOWZhZTk2NDQ0ZTJkNDAiLCJpYXQiOjE1MTg2NDU5MjJ9.PS6BRlF49BebHGM-TiQ_gGczBbf-Ziq3DFTTtDfqRpY
```

### **Sign In**

If the `token` is lost, it can be retrieved by signing in with the same `username` and `password` used to signup. Use `-a` followed by the `<username>:<password>` to set the authorization header:

```sh
$ http -a <password>:<username> GET https://competeme-deploy.herokuapp.com/api/v1/signin
```

If the user exists and the authorization is valid, the server will return the user's `token` with a `200` status code.

### **Update User Info**

To change or update `username` or `email`, enter the following command, making sure to include a valid `token`:

```sh
$ http PUT https://competeme-deploy.herokuapp.com/api/v1/users/5a84b2a2fc36b3001492df2b [username=<username>] [email=<email>] 'Authorization:Bearer <token>'
```

The server will return a `204` status code if the update was successful.

###  **Create New Activity**

To create a new activity, provide a `name` and a `location` of the activity. The `name` should describe the challenge or event: e.g. `5k`. The location should describe the scope of the new activity `Seattle`.

Enter the following command to create a new event:
```sh
$ http POST https://competeme-deploy.herokuapp.com/api/v1/activity 'Authorization:Bearer <token>' name=<name> location=<location>
```

The server will respond with a `201` status code and a JSON object with the new activity, (example):
```js
{
   "__v": 0,
   "_id": "5a84b527fc36b3001492df2c",
   "display": "false",
   "leaderBoard": [],
   "location": "Seattle",
   "name": "5k",
   "users": []
}
```

Note that `"display"` is set to `"false"` by default. All newly created activities must be approved by an admin, (see _Admin Powers_ below).

###  **Add a Score for an Activity**

Once an activity is created and approved, any user can add their personal score in that activity. It is necessary to  include activity's `_id` in the url.

To add a score for an activity, enter the following code into the terminal:

```sh
$ http POST https://competeme-deploy.herokuapp.com/api/v1/activity/<activity _id> 'Authorization:Bearer <token>' score=<number>
```

If all parameters are valid, the server returns a `201` status code, and a JSON object in an array, containing the `user _id`. If the `score` entered is among the highest three scores entered, the `user _id` and `score` will be included on the `leaderBoard`:
```js
[
   {
       "__v": 1,
       "_id": <activity _id>,
       "display": "true",
       "leaderBoard": [
           {
               "id": <user _id>,
               "score": <score>
           }
       ],
       "location": <location>,
       "name": <name>,
       "users": [
           <user _id>
       ]
   }
]
```
### **Look Up All Displayed Activities**

To see all displayed activities, enter the following terminal command:
```sh
$ http GET https://competeme-deploy.herokuapp.com/api/v1/activity/ 'Authorization:Bearer <token>'
```

If successful, the server responds with a `200` status code and an array of all `activity _id`s whose activity has `display` set to `true`:
```js
[
   <activity _id>
]
```

### **Look Up ONE Activity**

To look up a specific activity, enter the following command, providing an `activity _id`:
```sh
$ http GET https://competeme-deploy.herokuapp.com/api/v1/activity/<activity _id> 'Authorization:Bearer <token>'
```

If the query is valid, and the activity's `display` is set `true`, the server will return with a `200` status and a JSON object in an array:
```js
[
   {
       "__v": 0,
       "_id": <activity _id>,
       "display": "true",
       "leaderBoard": [],
       "location": <location>,
       "name": <name>,
       "users": []
   }
]
```

### **Look Up All Users**

To look up all users, enter the following code into the terminal:
```sh
$ http GET https://competeme-deploy.herokuapp.com/api/v1/users 'Authorization:Bearer <token>'
```

If the token is valid, the server will return a `200` status and an array of `user _id`s, (example):

```js
[
   "5a84b127fc36b3001492df28",
   "5a84b2a2fc36b3001492df2b"
]
```

### **Look Up ONE User**

To look up one user, enter the following command, including the user's `user _id` in the url:
```sh
$ http GET https://competeme-deploy.herokuapp.com/api/v1/users/<user _id> 'Authorization:Bearer <token>'
```

If the query is valid, and the activity's `display` is set `true`, the server will return with a `200` status and a user as a JSON object, displaying only their `username` and an `activities` array, containing `activity _id`s and `score`s for each activity:
```javascript
{
   "activities": [{
          "id": <activity _id>,
          "score": <score>
      }],
   "name": <username>
}
```

###  **Looking Up a Leaderboard**

To look up an activity's leaderboard, enter the following command:
```sh
$ http GET https://competeme-deploy.herokuapp.com/api/v1/activity/<activity _id>/leaderboard 'Authorization:Bearer <token>'
```

If the query is valid, the server will respond with a `200` status code, and an array of the top three scores for the activity requested, (example):
```javascript
[
   {
       "id": "5a84b127fc36b3001492df29",
       "score": "50"
   }
{
       "id": "5a84b127fc36b3001492df28",
       "score": "30"
   }
{
       "id": "5a84b127fc36b3001492df30",
       "score": "15"
   }
]
```

## **Admin Access**

The admin is a special user with an `admin` property set to `true`. Currently, only one user, whose name upon creation matches a secret name in the environment variables, can be admin.
The admin is the only one authorized to make certain changes. An admin must approve an activity before it is posted. An admin also has a right to delete or update an existing activity. 

### **Admin: View Hidden Activities**

When a user creates an acitivity, it is hidden by default. An admin must approve each hidden activity.

To do so, enter the following command with an `admin token`:
```sh
http GET https://competeme-deploy.herokuapp.com/api/v1/admin 'Authorization:Bearer <admin token>'
```

A GET call (as admin) returns a `200` status code, and an array of activities pending approval (or an empty array if there are no activities to approve).
(example):

```javascript
[
   "5a84b141fc36b3001492df29",
   "5a84b527fc36b3001492df2c"
]
```

### **Admin: Update Activity**

To PUT (update) an activity, enter the following command with an `admin token`:

```sh
http PUT https://competeme-deploy.herokuapp.com/api/v1/activity/<activity _id> 'Authorization:Bearer <admin token>' [name=<string>] [location=<string>] [display=<true or false>]
```

A PUT call (as admin) returns "No Content" with a `204` status code indicating it was succesful.

### **Admin: Delete Activity**

To DELETE an activity, enter the following command with an `admin token`:

```shell
http DELETE https://competeme-deploy.herokuapp.com/api/v1/activity/<activity _id> 'Authorization:Bearer <admin token>'
```

A DELETE call (as admin) returns "No Content" with a `204` status code indicating it was succesful.


## Testing

Tests pass with >80% coverage of statements, branches, function and lines. Most uncovered lines are promise `catch()` functions, that will onnly be triggered if an error occurs in an outside API, (such as MongoDB).

```javascript
--------------------|----------|----------|----------|----------|----------------|
File                |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
--------------------|----------|----------|----------|----------|----------------|
All files           |    92.74 |    82.54 |    90.36 |    95.93 |                |
 lib                |    91.67 |    82.76 |    85.71 |    98.72 |                |
  admin-auth.js     |      100 |      100 |      100 |      100 |                |
  basic-auth.js     |      100 |      100 |      100 |      100 |                |
  bearer-auth.js    |    80.95 |     62.5 |       75 |    94.44 |             24 |
  error-handler.js  |      100 |      100 |      100 |      100 |                |
  server.js         |    90.91 |       50 |    85.71 |      100 |          23,35 |
 model              |    84.85 |    66.67 |    76.92 |       90 |                |
  activity.js       |      100 |      100 |      100 |      100 |                |
  user.js           |    83.33 |    66.67 |    76.92 |    88.89 |       23,40,46 |
 route              |    95.73 |    85.71 |    94.64 |    95.58 |                |
  route-activity.js |    98.21 |    81.25 |      100 |    98.18 |             32 |
  route-admin.js    |    90.91 |      100 |       80 |       90 |             17 |
  route-user.js     |       94 |    91.67 |     91.3 |    93.75 |       62,73,77 |
--------------------|----------|----------|----------|----------|----------------|
Test Suites: 9 passed, 9 total
Tests:       62 passed, 62 total
Snapshots:   0 total
Time:        6.713s, estimated 7s
```

### Data Structures

## **User Schema**

```html
user
+--"_id" <unique $oid generated by mongo upon creation>
|
+--"username" <string, unique to this user, input by user>
+--"password" <string, hashed password, input by user>
|
+--"admin" <boolean, gives admin authentication, only one user, undefined on other users>
|
+--"activities" <array of objects>
    |
    +--<object>
    |   +--"id" <matches many-to-one with an activity model "_id" property>
    |   +--"score" <personal best score in a given activity>
    |
    +--<object>
    |   +--"id"
    |   +--"score"
    |
    +--(...)
```

## **Activity Schema**

```html
activity
|
+--"_id" <unique $oid generated by mongo upon creation>
|
+--"name" <string, name of activity, input by a user upon creation, unique relative to location>
+--"location" <string, location name, input by a user upon creation, unique relative to location>
|
+--"leaderBoard" <array of top three high scores>
|   |
|   +--<object>
|   |   +--"id" <matches many-to-one with a user model "_id" property>
|   |   +--"score" <matches one-to-one with a user's "">
|   |
|   +--<object>
|   |   +--"id"
|   |   +--"score"
|   |
|   +--<object>
|       +--"id"
|       +--"score"
|
+--"users" <array of "_id"s>
    |
    +--<many-to-one id>
    +--<many-to-one id>
    +--(...)
```

## **MANY to MANY Relationship**

This app uses a many-to-many related database, where each user may refer to many activities, and each activity may refer to many users:

```
user:                                   activity:
+--------------+______<ref__       ref>   +----------------+
|         ._id  __________  |    \\\\\\\\\  ._id           |
|    .password |          | |    \\       | .name          |
|    .username |          | |    \\       | .location      |
|       .admin |          | |    \\       | .leaderBoard:  |
| .activities: |          | |    \\      +-------------+   |
| +-------------+         | |    \\      | 0:          |   |
| |             |         | |____\\_____+--------+     |   |
| |          0: |         |  ____\\_____  .id    |     |   |
| |      +--------+       | |    \\     | .score |     |   |
| |      |    .id  \\\\\\\\\\\\\\\\     +--------+     |   |
| |      | .score |       | |            | 1:          |   |
| |      +--------+       | |           +--------+     |   |
| |          1: |         | |           | .id    |     |   |
| |      +--------+       | |           | .score |     |   |
| |      |    .id |       | |           +--------+     |   |
| |      | .score |       | |            | 2:          |   |
| |      +--------+       | |           +--------+     |   |
| |             |         | |           | .id    |     |   |
| +-------------+         | |           | .score |     |   |
|              |          | |           +--------+     |   |
+--------------+          | |            |             |   |
                          | |            +-------------+   |
                          | |             | .users:        |
                          | |            +-------------+   |
                          | |_____<ref___| 0: id       |   |
                          |______________  1: id       |   |
                                         | 2: id       |   |
                                         | 3: id       |   |
                                         | 4: id       |   |
                                         +-------------+   |
                                          |                |
                                          +----------------+
```


## **About Us**

### [Koko Kassa](https://github.com/kowserk7)
[![][koko]](https://github.com/kowserk7)

JavaScript developer with strengths in problem solving by using my root-cause solutions. Advocate for diverse
perspectives to drive innovation. Fluent in both Arabic and Tigrinya.
[github.com/kowserk7](https://github.com/kowserk7)
[linkedin.com/in/kowser-kassa/](https://www.linkedin.com/in/kowser-kassa/)

### [Bill Odell](https://github.com/bpodell)
[![][bill]](https://github.com/bpodell) 

Acquiring my certificate as a Full Stack Javascript Developer. Trained with current industry practices including Node, HTML5, React and MongoDB. Experience working on multiple group projects based on GitHub, ultimately deploying live applications on Heroku.
[github.com/bpodell](https://github.com/bpodell)
[linkedin.com/in/bpodell]

### [Ender Smith](https://github.com/EnderSmith)
[![][ender]](https://github.com/EnderSmith)

Full-Stack JavaScript developer with background in music composition. Passionate about creating products that bring solutionts to real world problems and make life easier.
[github.com/EnderSmith](https://github.com/EnderSmith)
[linkedin.com/in/ender-smith/](https://www.linkedin.com/in/ender-smith/)

### [Heath Smith](https://github.com/Iamheathsmith)
[![][heath]](https://github.com/Iamheathsmith)

Full Stack Software developer with More than 12 years of DoD experience in aviation administration and transportation operations.
[github.com/Iamheathsmith](https://github.com/Iamheathsmith)
[linkedin.com/in/heath-smith/](https://www.linkedin.com/in/heath-smith/)


[koko]: https://github.com/401Midterm/CompeteMe/blob/dev/about/koko.jpg?raw=true
[bill]: https://github.com/401Midterm/CompeteMe/blob/dev/about/bill.jpg?raw=true
[ender]: https://github.com/401Midterm/CompeteMe/blob/dev/about/ender.jpg?raw=true
[heath]: https://github.com/401Midterm/CompeteMe/blob/dev/about/heath.jpg?raw=true
