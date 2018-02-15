# 401-midterm com

[![Build Status](https://travis-ci.org/401Midterm/CompeteMe.svg?branch=master)](https://travis-ci.org/401Midterm/CompeteMe)

##  **About this App.**

This app is a basic leader board for different acticities. We let you build a user account that you can add different types of activities to your account and when you do that, you add your personal best score to that event. We keep track of the top 3 best scores for anyone to see.

### **Installing and How to use.**

To install this program, place fork and 'git clone' this repo to your computer. From the terminal, navigate to the branch that you set it as. once there, install NPM but typing in , `nmp install` and httpie(done with homeBrew) after that you will need to install all the dependencies. to do that, juse type in `npm i`. You also need to have HTTPIE installed via homebrew `brew install httpie` in the terminal. this will let you do the helpful commands inside of the terminal.



next you need to have these scripts adjusted in your package.json file.

```javascript
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

## **Getting started.**

### starting your server and dataBase

from there, you can go to your terminal and type,

```javascript
node run start
```
and this will start up your server


you will also need to start up your mongoDB dataBase with the code below on a diffferent termail

```javascript
node run start-db
```

## **Commands to sign up.**

to sign up for our App, you need to enter in the following code with your own `username`, `email` and `password`.


to sign up to the database
```javascript
http POST https://competeme-deploy.herokuapp.com/api/v1/signup username=Tim password=123 email=Tim@gmail.com
```
once you have submitted this code, you will get a token back that you will use to then create activities.

this token should look like this. make sure to hold on to this and keep it for different commands.

```javascript
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjU2Mjg1YzIyZTg5MDA2YjM2ODEzMmI4MjI2YWNlNzczNmI0OTNkMjY1MTZlNmZiMTFlOWZhZTk2NDQ0ZTJkNDAiLCJpYXQiOjE1MTg2NDU5MjJ9.PS6BRlF49BebHGM-TiQ_gGczBbf-Ziq3DFTTtDfqRpY"

```

### **sign in to our database.**

if you lost your Token, you can simple just sign back into out app by typing in the following command

```javascript
http -a Tim:123 GET https://competeme-deploy.herokuapp.com/api/v1/signin
```

when the code above is submitted, you should have a new token that looks like this.
```javascript
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImNiOWU4Nzc4NzAxY2UwMDU0ZTI5NjRiMTc1MDEzOTAyZjE1ZjNmZWJjZDgzMmQ0YjE1NGEzYTg3MjBlYjE4MTUiLCJpYXQiOjE1MTg2NDYxMTF9.knGRwcyTvBFTCIRqWuaBEd_hfDfN8vRWpZwmGrpIzEk"
```

### **update your user info.**

if you want to change or update your `username` or `email` you can do that but you will need to have your token along with the updated info. example code below of what your submit should look like.

```javascript
http PUT https://competeme-deploy.herokuapp.com/api/v1/users/5a84b2a2fc36b3001492df2b username=Heath
```
you will also need to have your token to do so. only your token will let you update your data. it should look like this.
```javascript
'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImNiOWU4Nzc4NzAxY2UwMDU0ZTI5NjRiMTc1MDEzOTAyZjE1ZjNmZWJjZDgzMmQ0YjE1NGEzYTg3MjBlYjE4MTUiLCJpYXQiOjE1MTg2NDYxMTF9.knGRwcyTvBFTCIRqWuaBEd_hfDfN8vRWpZwmGrpIzEk'
```
you will not get a response back but it will update your info and give you a 204 status code.

###  **Adding a new activity**

to add a activity, you need to have a few different things to do so. 1st, you need to have your token. this lets you have access to our app. with out it, you will not be allowed to enter. 2nd, you need to have a name and a location of this activity. something like `5k` and `seattle`.  Below is a example of what the code should look like when you enter it into the terminal.

```javascript
http POST https://competeme-deploy.herokuapp.com/api/v1/activity 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImNiOWU4Nzc4NzAxY2UwMDU0ZTI5NjRiMTc1MDEzOTAyZjE1ZjNmZWJjZDgzMmQ0YjE1NGEzYTg3MjBlYjE4MTUiLCJpYXQiOjE1MTg2NDYxMTF9.knGRwcyTvBFTCIRqWuaBEd_hfDfN8vRWpZwmGrpIzEk' name=Bench_Press location=Seattle
```
once you have enter the code, you should get something like this below.
```javascript
{
   "__v": 0,
   "_id": "5a84b527fc36b3001492df2c",
   "display": "false",
   "leaderBoard": [],
   "location": "Seattle",
   "name": "Bench_Press",
   "users": []
}
```
###  **Adding a score to an activity**

once you have added an activity, you can then added your score to it. it should look like this.

```javascript
http POST https://competeme-deploy.herokuapp.com/api/v1/activity/5a84b141fc36b3001492df29 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjBhNTE0MjY4OTcwZDM3ZjdjYWI5NTBjYjRiYzFiY2FiMjEzMTQyODk1MDkwYWE0MjQ2ZmRhMTU4ZDE1NzdjNTUiLCJpYXQiOjE1MTg2NDcyNjN9.34O6ZXEVEEy1wttaaBsgR-mUiOhFcEb9wyMH_X9UPVM' score=50
```

you will get a retrun with some data. it should look like this below.

```javascript
[
   {
       "__v": 1,
       "_id": "5a84b141fc36b3001492df29",
       "display": "true",
       "leaderBoard": [
           {
               "id": "5a84b127fc36b3001492df28",
               "score": "50"
           }
       ],
       "location": "portland",
       "name": "10k",
       "users": [
           "5a84b127fc36b3001492df28"
       ]
   }
]
```
### **look up all Activities**

if you want to look up all activities to see which ones you want to join, just simple enter the code below into your terminal.
```javascript
http GET https://competeme-deploy.herokuapp.com/api/v1/activity/ 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImNiOWU4Nzc4NzAxY2UwMDU0ZTI5NjRiMTc1MDEzOTAyZjE1ZjNmZWJjZDgzMmQ0YjE1NGEzYTg3MjBlYjE4MTUiLCJpYXQiOjE1MTg2NDYxMTF9.knGRwcyTvBFTCIRqWuaBEd_hfDfN8vRWpZwmGrpIzEk'
```
this should return an array of activities for you to pick from. example below.

```javascript
[
   "5a84b141fc36b3001492df29"
]
```

### **look up ONE Activity**

if you want to look up just one activity. you need to know the ID of the activity(which you can get from the find all from above). you will just add that onto the same code for the get ALL activities. code example below.
```javascript
http GET https://competeme-deploy.herokuapp.com/api/v1/activity/5a84b527fc36b3001492df2c 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImNiOWU4Nzc4NzAxY2UwMDU0ZTI5NjRiMTc1MDEzOTAyZjE1ZjNmZWJjZDgzMmQ0YjE1NGEzYTg3MjBlYjE4MTUiLCJpYXQiOjE1MTg2NDYxMTF9.knGRwcyTvBFTCIRqWuaBEd_hfDfN8vRWpZwmGrpIzEk'
```
this should return an a single acitivty with all the info about that activity like location, name, leaderboard, and users

```javascript
[
   {
       "__v": 0,
       "_id": "5a84b141fc36b3001492df29",
       "display": "true",
       "leaderBoard": [],
       "location": "portland",
       "name": "10k",
       "users": []
   }
]
```

### **look up all users**

if you want to look up all users, just simple enter the code below into your terminal.
```javascript
http GET https://competeme-deploy.herokuapp.com/api/v1/users 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImNiOWU4Nzc4NzAxY2UwMDU0ZTI5NjRiMTc1MDEzOTAyZjE1ZjNmZWJjZDgzMmQ0YjE1NGEzYTg3MjBlYjE4MTUiLCJpYXQiOjE1MTg2NDYxMTF9.knGRwcyTvBFTCIRqWuaBEd_hfDfN8vRWpZwmGrpIzEk'
```
this should return an array of users. example below.

```javascript
[
   "5a84b127fc36b3001492df28",
   "5a84b2a2fc36b3001492df2b"
]
```

### **look up ONE user**

if you want to look up just one user. you need to know the ID of the user(which you can get from the find all from above). you will just add that onto the same code for the get ALL users. code example below.
```javascript
http GET https://competeme-deploy.herokuapp.com/api/v1/users/5a84b2a2fc36b3001492df2b 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImNiOWU4Nzc4NzAxY2UwMDU0ZTI5NjRiMTc1MDEzOTAyZjE1ZjNmZWJjZDgzMmQ0YjE1NGEzYTg3MjBlYjE4MTUiLCJpYXQiOjE1MTg2NDYxMTF9.knGRwcyTvBFTCIRqWuaBEd_hfDfN8vRWpZwmGrpIzEk'
```
this should return an a single user with all the info about that user like name, activities. if they have any activities, there activity id and score will be in the activites block. example below.

```javascript
{
   "activities": [{
          "id": "5a84b141fc36b3001492df29",
          "score": "50"
      }],
   "name": "Tim"
}
```

###  **Looking up a leaderBoard**

if you wish to look up the leaderboard for a given activity, type in the code below.

```javascript
http GET https://competeme-deploy.herokuapp.com/api/v1/activity/5a84b141fc36b3001492df29/leaderboard 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjBhNTE0MjY4OTcwZDM3ZjdjYWI5NTBjYjRiYzFiY2FiMjEzMTQyODk1MDkwYWE0MjQ2ZmRhMTU4ZDE1NzdjNTUiLCJpYXQiOjE1MTg2NDcyNjN9.34O6ZXEVEEy1wttaaBsgR-mUiOhFcEb9wyMH_X9UPVM'
```

you will be given the top 3 in that said activity. it should look like this.

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

## **ADMIN POWER**

The admin is a special user with an `admin` property set to `true`. Currently, only one user, whose name upon creation matches a secret name in the environment variables, can be admin.

### **Admin: View Hidden Activities**

When a user creates an acitivity, it is hidden by default. An admin must approve each hidden activity.

To GET all hidden activities (admin required):

```sh
http GET https://competeme-deploy.herokuapp.com/api/v1/admin 'Authorization:Bearer <admin token>'
```

A GET call (as admin) returns an array of activities pending approval (or an empty array if there are no activities to approve).
(example):

```javascript
[
   "5a84b141fc36b3001492df29",
   "5a84b527fc36b3001492df2c"
]
```

### **Admin: Update Activity**

To PUT (update) an activity (admin required):

```sh
http PUT https://competeme-deploy.herokuapp.com/api/v1/activity/<activity _id> 'Authorization:Bearer <admin token>' [name=<string>] [location=<string>] [display=<true or false>]
```

A PUT call (as admin) returns "No Content" with a 204 status code indicating it was succesful.

### **Admin: Delete Activity**

To DELETE an activity (admin required):

```shell
http DELETE https://competeme-deploy.herokuapp.com/api/v1/activity/<activity _id> 'Authorization:Bearer <admin token>'
```

A DELETE call (as admin) returns "No Content" with a 204 status code indicating it was succesful.


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

## **user**

the user model is stuctured like this:

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

## **activity**

the activity model is stuctured like this:

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

## **MANY to MANY**

this is a many to many data structure. the schemas in the api are related like so:

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
![koko][koko]


![bill][bill]


![ender][ender]


![heath][heath]


[koko]: https://github.com/401Midterm/CompeteMe/tree/dev/about/koko.jpeg
[bill]: https://github.com/401Midterm/CompeteMe/tree/dev/about/bill.jpeg
[ender]: https://github.com/401Midterm/CompeteMe/tree/dev/about/ender.jpeg
[heath]: https://github.com/401Midterm/CompeteMe/tree/dev/about/heath.jpeg
