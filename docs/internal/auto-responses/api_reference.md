---
title: API Reference
---

Restful endpoints for viewing and modifying auto responses.

## Get Responses for a Guild

<Route method="GET" path="/responses/{guild_id}" auth />

Returns a list of [auto response](../#auto-response-object) objects.

## Create a New Auto Response

<Route method="POST" path="/responses/{guild_id}" auth />

Returns an [auto response](../#auto-response-object) object on success.  Will fire some type of gateway event.

###### Json Params
| Field  | Type                                          | Description                                                                   |
| ------ | --------------------------------------------- | ----------------------------------------------------------------------------- |
| trigger | string                                        | Trigger portion of the auto response |
| response | string                                        | Response portion of the auto response |

## Delete an Auto Response

<Route method="DELETE" path="/responses/{guild_id}/{auto_response.id}" auth />

Returns `204 No Content` on success. Requires ownership or admin.  Will fire some type of gateway event.

## Modify an Existing Auto Response

<Route method="PATCH" path="/responses/{guild_id}/{auto_response.id}" auth />

Modify the given auto response. Requires ownership or an admin. Returns the updated [auto response](../#auto-response-object) object on success.  Will fire some type of gateway event.

###### Json Params
| Field  | Type                                          | Description                                                                   |
| ------ | --------------------------------------------- | ----------------------------------------------------------------------------- |
| trigger | string                                        | New trigger portion of the auto response |
| response | string                                        | New response portion of the auto response |
