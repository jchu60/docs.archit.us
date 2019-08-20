---
title: Socket.io Communication
shortTitle: Socket.io
---

## Rationale

Socket.io is used as a duplex communication engine, enabling us to support lower latency request=>response patterns as well as server-initiated events, useful for updating spectating clients that an action ocurred in the current guild that requires an update on the UI.

## Authenticating

Uses JWT for authentication, similar to the REST API. JWT secret is shared between the socket.io server nodes and the API nodes to let the socket.io server verify the validity of JWT tokens as they come in, as needed. **This means that the auth token needs to be included in the payload of every request.

**Todo**: figure out JWT authorization window as an alternative to the approach described above

## Patterns

1. Request-response
   1. Discord entity pools (members, emotes, channels, and roles)
   2. Discord entity search auto-complete (only for members)
2. Server-push notifications
   1. Live updates requiring data refresh (i.e. new auto-response token)
   2. Live log entry view

## Spectating

A socket.io client spectates (receives updates for) a single guild at any time. This means that **relevant views need to re-request the data from the API upon guild switching in the UI**. To accomplish single-guild updates, [socket.io rooms](https://socket.io/docs/rooms-and-namespaces/#Rooms) are automatically generated for each guild:

- `updates-<guild_id>` - Used to post live updates that trigger a data refresh on the frontend
- `logs-<guild_id>` - Used to provide live log entries

> These are separated as to avoid the relatively high-volume log entry stream when the user isn't viewing the logs screen

**Todo**: req/reply room
