---
title: Identify
---

## User Object
Same as discord [user](https://discordapp.com/developers/docs/resources/user#user-object-user-structure) object.

###### User Example
```
{
  "username": "johnyburd",
  "locale": "en-US",
  "mfa_enabled": true,
  "flags": 0,
  "avatar": "9ce5a006548f1ae3e5c8fb91a4d677e4",
  "discriminator": "1022",
  "id": "214037134477230080"
}
```

## Identify User

<Route method="GET" path="/identify" auth />

Return a [user](#user-object) object.
