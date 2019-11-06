---
title: Authentication
---

Architus implements OAuth2 using discord's developer application.

## Get Authorization Token

<Route method="GET" path="/login"/>

Redirects to Discord's authorization page for Architus. Optionally takes a query string if the return url is different from [https://archit.us/app](https://archit.us/app)

###### Example Url
```
https://api.archit.us/login?return=https%3A%2F%2Fdevelop.archit.us%2Fapp
```
This example redirects to [https://develop.archit.us/app](https://develop.archit.us/app) instead of the main app after the login chain is completed.

When the browser arrives back at the app the URL includes the authorization code provided by discord.

###### Example Url
```
https://archit.us/app?code=fKhB9VoUHR8CtZM3XOUnNRS9wSTOrt
```

## Get Architus API Token

<Route method="POST" path="/token_exchange"/>

Exchange discord user token, retrieved from [login](get-authorization-token) for an Architus API token.

###### Json Params
| Field  | Type                                          | Description                                                                   |
| ------ | --------------------------------------------- | ----------------------------------------------------------------------------- |
| code | string                                        | [Discord Authorization Token](https://discordapp.com/developers/docs/topics/oauth2#authorization-code-grant) |
