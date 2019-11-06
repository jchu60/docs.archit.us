---
title: Guilds List
---

## Guild Object
###### Json Params
| Field  | Type                                          | Description                                                                   |
| ------ | --------------------------------------------- | ----------------------------------------------------------------------------- |
| features | array of [guild feature](https://discordapp.com/developers/docs/resources/guild#guild-object-guild-features) strings | enabled guild features |
| name | string | name of the guild |
| owner? | boolean | whether or not the user is the owner of the guild |
| icon | ?string | [icon hash](https://discordapp.com/developers/docs/reference#image-formatting) of the guild |
| id | snowflake | the id of the guild |
| permissions? | integer | total permissions for the user in the guild (does not include channel overrides) |
| has_architus | boolean | whether Architus is a member of the guild |
| architus_admin | booloan | whether the user is an Architus admin in the guild |

###### Guild Example
```
{
  "features": [
    "ANIMATED_ICON",
    "BANNER",
    "VANITY_URL",
    "INVITE_SPLASH"
  ],
  "name": "discord.py",
  "owner": false,
  "icon": "3aa641b21acded468308a37eef43d7b3",
  "id": "336642139381301249",
  "permissions": 104189632,
  "has_architus": true,
  "architus_admin": false
}
```

## Get List of Guilds

<Route method="GET" path="/guilds" auth />

Returns a list of [guild](#guild-object) objects that the user is a member of.

