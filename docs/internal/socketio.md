---
title: Socket.io Communication
shortTitle: Socket.io
---

## Rationale

In order to implement major portions of the architus app, there exists a need for a secure communication channel between the server and client that supports **server pushes** and differing levels of permission.

### Use Cases

- Front page interpreting messages
  - `interpret`
- Spectating certain servers (1 at a time)
  - A socket.io client spectates (receives updates for) a single guild at any time. This means that **relevant views need to re-request the data from the API upon guild switching in the UI**
- Permissions layer
  - Certain categories (i.e. administrator changes) of messages should only be available to those with permissions
    - Differentiate between architus admins and Discord admins?

Socket.io is used as a duplex communication engine, enabling us to support lower latency request => response patterns as well as server-initiated events, useful for updating spectating clients that an action ocurred in the current guild that requires an update on the UI.

## Authenticating

Uses JWT for authentication, similar to the REST API. JWT secret is shared between the socket.io server nodes and the API nodes to let the socket.io server verify the validity of JWT tokens as they come in, as needed. **This means that the auth token needs to be included in the payload of every request.**

## Patterns

1. Request-response
   1. Discord entity pools (members, emojis, channels, and roles)
      1. Request all emojis, channels, roles, online members
      2. Request single entity
      3. Request member search
         1. 3 steps:
            1. initial view of all displayed entities
            2. interact with relevant UI => request remainder of pool
            3. on search member
2. Server-push messages
   1. Live updates requiring data refresh (i.e. new auto-response token)
   2. Live log entry view

## Implementation Details

1. Single room per user
   - Use JWT to **encode permissions** for instant authentication
2. Use redux middleware in frontend to provide symmetry to traditional RESTful response handling
3. Payloads are strings (JSON-serialized)
4. Default unauthenticated room
5. Authenticated room
   - Websocket server manages what messages are received as server pushes and relevant req/res authorization based on JWT and other context

### Filtering/scalability

#### MQ Topics

Have MQ filter as many unneeded events out as possible (faster than WS server):

#### MQ topics

Have websocket servers subscribe to as many topics as they currently need (based on current connections/authenticated rooms and the guilds they need visibility to)

```
<guild_id>
<guild_id>_logs
```

## Message Types (Socket.io Events)

### Unauthenticated Room Events

`<SID>`

- `request_elevation`
  - Payload: token
  - Result in: successful or not
    - Success: server is going to
      - Make new authenticated room based off JWT credentials/permissions and SID
      - Places user into room
      - Websocket server manages what messages are received as server pushes and relevant req/res authorization based on JWT and other context

- `interpret`
  - Front page Discord mock interpreting
  - Directly calls discord bot mock response maker
  - Payload is traditional object

### Authenticated Room Events

`<SID>_auth` - Server manages what events are sent to this room

- `spectate`
  - Will remove previous spectating upon switching to new guild
  - payload:

```json
"payload": {
  "guild_id": "guild_id"
  "include_logs": true
}
```

- `pool`
  - **request/response**
    - Request single
    - Request all
      - Request online members??
    - Request search?
  - Discord entities
    - Guild-specific
      - Members -> Also update user pool
      - Channels
      - Roles
    - Guild-agnostic
      - Users
      - Emoji
      - Guilds
  - Architus entities
    - Auto responses
    - Settings values (not presentational schema)
  - *format TBD*

#### Server Push

- `log_pool`
  - Example motivating use case: someone updates auto response: push to other observable
  - Includes both architus and Discord entity updates
    - **for discord entities**: merge with
  - **server push**
  - *format TBD*

- `log_other`
  - server push
  - *format TBD*
