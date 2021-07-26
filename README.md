# instant-chat-socket.io

#### [DEPRECIATE] This preject is depreciated, please check the new version at https://github.com/SmaugDev/instant-chat

This project is an exemple of realtime chat using socket.io and express server. 

## How to install
1. Clone the repo
2. Clone config.template.js into the main directory and rename it to config.js
3. Install the dependencies: npm install
4. Start the server: node main.js

## Routes

### Get
  URL : `/messages` <br>
  Return the latest messages (limit 200 messages) <br>
  Exemple : <br>
#### Success Response
  Code : 200 OK
  Content examples
  ```js
  [
  RowDataPacket { id: 1, name: 'username', message: 'message content' },
  RowDataPacket { id: 2, name: 'username', message: 'message content' },
  ]
  ```
  ### Post
  URL : `/messages` <br>
  Return the latest messages (limit 200 messages) <br>
  Exemple : <br>
#### Success Response
  Code : 201 Created
  Content examples
  ```js
{ 
name: 'username', 
message: 'message content' 
}
  ```
### Licence

This project have an MIT licence
