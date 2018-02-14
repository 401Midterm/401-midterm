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

###  **Looking up an leaderBoard**

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

part of this App is that we created a Admin power so they can update any activity and delete any activity as well. Part of there power is that when a new activity is made by a user, it goes into a admin queue that is waiting for them to then approve it. at that time, all users will be able to see the approved activity.


### **update an activity/approving activity**

if you want to update an activity so the name and location are correct, this is where you do this. ALSO, when you want to make this activity public and approved, this is where you do that also.

below is the code that you will use to update an activity with updated info OR approve it once you think its ready for public use. in the example below, we are setting the display to true.

```javascript
http PUT https://competeme-deploy.herokuapp.com/api/v1/activity/5a84b141fc36b3001492df29 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjBhNTE0MjY4OTcwZDM3ZjdjYWI5NTBjYjRiYzFiY2FiMjEzMTQyODk1MDkwYWE0MjQ2ZmRhMTU4ZDE1NzdjNTUiLCJpYXQiOjE1MTg2NDcyNjN9.34O6ZXEVEEy1wttaaBsgR-mUiOhFcEb9wyMH_X9UPVM' display=true
```
this command will return no content.

## **Admin queue look up**

when a use creates an acitivity, it is set to be hidden be default. it take a Admin to then go in and approve it. They will do that will a update call that is talked about above. to get your Admin Queue, they will type in the following code. 

```javascript
http GET https://competeme-deploy.herokuapp.com/api/v1/admin 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjBhNTE0MjY4OTcwZDM3ZjdjYWI5NTBjYjRiYzFiY2FiMjEzMTQyODk1MDkwYWE0MjQ2ZmRhMTU4ZDE1NzdjNTUiLCJpYXQiOjE1MTg2NDcyNjN9.34O6ZXEVEEy1wttaaBsgR-mUiOhFcEb9wyMH_X9UPVM'
```

this will return an array of ativities for them to approve or an empty array if there is nothing to approve. example code below.

```javascript
[
   "5a84b141fc36b3001492df29",
   "5a84b527fc36b3001492df2c"
]
```

## **Admin Delete for activity**

if you wish to delete an activity, you can do so with the admin power with this command below.

```javascript
http DELETE https://competeme-deploy.herokuapp.com/api/v1/activity/5a84b527fc36b3001492df2c 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjBhNTE0MjY4OTcwZDM3ZjdjYWI5NTBjYjRiYzFiY2FiMjEzMTQyODk1MDkwYWE0MjQ2ZmRhMTU4ZDE1NzdjNTUiLCJpYXQiOjE1MTg2NDcyNjN9.34O6ZXEVEEy1wttaaBsgR-mUiOhFcEb9wyMH_X9UPVM'
```

this will return no content but you will get a 204 status code to let you know it was succesful.


### Testing

We have completed testing for all functions and branches with the following coverage.

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


