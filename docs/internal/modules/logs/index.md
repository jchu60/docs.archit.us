---
title: Logs
---

Logs are a major feature of Architus that expands on discord's audit log functionality in a variety of ways. In addition to a much longer history, Architus tracks many more actions than the built in log. It also provides the abilty to rollback most actions and an improved viewing interface.


### Log Event Object

###### Log Event Structure
| Field               | Type        | Description                                                             |
| ------------------- | ----------- | ----------------------------------------------------------------------- |
| id                  | hoar frost  | unique [hoar frost ID](../../api-reference/#hoar-frost) for the event         |
| reversible          | boolean     | can the action be reversed                                              |
| action_number       | integer     | number corresponding to the [action type](#action-type)       |
| agent_id            | ?snowflake  | snowflake of the user carrying out the action |
| subject_id          | ?snowflake (or [hoar frost](../../api-reference/#hoar-frost))  | id of the object being acted upon (if it still exists) |
| old_data            | ?mixed (any JSON value) | data required to reconstruct the object |

## Action Type

###### Action Type Table
| ACTION_NUMBER   | ACTION_TYPE         | Description                                                             |
| --------------- | ------------------- | ----------------------------------------------------------------------- |
| 1 | GUILD_UPDATE | guild was updated |
| 10 | CHANNEL_CREATE | new channel created |
| 11 | CHANNEL_UPDATE | channel was updated |
| 12 | CHANNEL_DELETE | channel was deleted |
| 13 | CHANNEL_OVERWRITE_CREATE ||
| 14 | CHANNEL_OVERWRITE_UPDATE ||
| 15 | CHANNEL_OVERWRITE_DELETE ||
| 20 | MEMBER_KICK ||
| 21 | MEMBER_PRUNE ||
| 22 | MEMBER_BAN_ADD ||
| 23 | MEMBER_BAN_REMOVE ||
| 24 | MEMBER_UPDATE ||
| 25 | MEMBER_ROLE_UPDATE ||
| 30 | ROLE_CREATE ||
| 31 | ROLE_UPDATE ||
| 32 | ROLE_DELETE ||
| 40 | INVITE_CREATE||
| 41 | INVITE_UPDATE ||
| 42 | INVITE_DELETE ||
| 50 | WEBHOOK_CREATE ||
| 51 |WEBHOOK_UPDATE ||
| 52 | WEBHOOK_DELETE ||
| 60 | EMOJI_CREATE ||
| 61 | EMOJI_UPDATE ||
| 62 | EMOJI_DELETE ||
| 72 | MESSAGE_DELETE ||
| ---- | ----------- | ---------------------- |
| 3001 | MESSAGE_SEND | |
| 3002 | MESSAGE_EDIT ||
| 3003 | MESSAGE_DELETE ||
| 3100 | REACTION_ADD||
| 3101 | REACTION_REMOVE||
| 3200 | AUTO_RESPONSE_ADD   ||
| 3201 | AUTO_RESPONSE_REMOVE    ||
| 3202 | AUTO_RESPONSE_EDIT  ||
| 3203 | AUTO_RESPONSE_TRIGGER   ||
| 3300 | LOG_REVERT  ||
| 3301 | LOG_ROLLBACK    ||
| 3400 | EMOJI_MANAGER_TRIGGER   ||
| 3401 | EMOJI_MANAGER_CREATE    ||
| 3402 | EMOJI_MANAGER_DELETE    ||
| 3403 | EMOJI_MANAGER_EXCHANGE  ||

<Alert type="info">

Action numbers below 3000 are native to discord while above 3000 are particular to Architus

</Alert>
