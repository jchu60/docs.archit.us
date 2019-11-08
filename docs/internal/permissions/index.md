---
title: Permissions
---

Architus implements a permission schema that naturally extends discord's native functionality. A set of permissions can be applied to each role or member of a server.

###### Bitwise Permission Flags

| Permission                 | Value                  | Description                                                 |
| -------------------------- | ---------------------- | ----------------------------------------------------------- |
| ADMINISTRATOR              | 0x0001                 | Grants all permissons |
| VIEW_PUBLIC_LOGS           | 0x0002                 | Allows viewing any action logged in a public channel |
| VIEW_PRIVATE_LOGS          | 0x0004                 | Allows viewing any action logged in the guild |
| REVERT_LOG_ACTIONS         | 0x0008                 | Allows reverting any reversible action logged |
| ADD_AUTO_RESPONSE          | 0x0010                 | Allows adding auto responses to the guild |
| IGNORE_AUTO_RESPONSE_QUOTA | 0x0020                 | Allows adding auto responses, even if the quota has been reached  |
| EDIT_ANY_AUTO_RESPONSE     | 0x0040                 | Allows editing any user's auto responeses |
| DELETE_ANY_AUTO_RESPONSE   | 0x0080                 | Allows deleting any user's auto responses |
| VIEW_SETTINGS              | 0x0100                 | Allows viewing architus settings for the guild |
| MANAGE_SETTINGS            | 0x0200                 | Allows modifying architus settings for the guild |
| EXEC_PURGE_CMD             | 0x0400                 | Allows executing the purge command |
