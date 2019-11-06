---
title: Auto Responses
---

## Auto Responses

- 3 types of autoresponses:
  1. No punctuation: ignores whitespace and punctuation in trigger
  2. Some punctuation: ignores all whitespace and punctuation except what appears in the original trigger
  3. Begins with `^` and ends with `$`: matches a regex
     - Implement in future release?
     - How to prevent catastrophic backtracking/ReDoS?
       - Look into implementing with [rure library](https://pypi.org/project/rure/)
     - `^.*aba.*$`
       - Makes it opt-in to have "glue" instead of opt-out for better default performance
     - Don't really need to escape anything

### Modes

**Important to retain original trigger for frontend to display**

1. Punctuation insensitive (legacy functionality)
   - Strips all whitespace and punctuation from **matching trigger** and **matching text**
2. Punctuation sensitive (only used punctuation)
   - Strips all whitespace from **matching trigger** and **matching text**, but not punctuation that is used in original trigger (excluding mention and emoji fragments)
   - Need to add regex escaping for everything

#### Fragments

Fragment string: `<@54435432534524423> dsfadfsddfdsaf` becomes:

```json
[ 
   { 
      "type": "mention",
      "text": "<@54435432534524423>"
   },
   { 
      "type": "fragment",
      "text": " dsfadfsddfdsaf"
   }
]
```

Only `text` fragments will be used for the mode assignment heuristic and the sensitive punctuation pool.

### Auto Response Object

*Consider lexing & parsing response and including AST in object*

###### Auto Response Structure

| Field    | Type   | Description                                                                |
| -------- | ------ | -------------------------------------------------------------------------- |
| id      | hoar frost | unique [hoar frost ID](../general/#hoar-frost) for the auto response          |
| trigger | string | **original** trigger from command/added response |
| trigger_regex | regex | derived regular expression from (escaped) trigger text |
| trigger_punctuation | tuple | list of punctuation that a sensitive trigger cares about |
| response | string | response text to use upon invokation |
| response_ast | json string | lexed and parsed response |
| mode | string enum          | type of matching mode to use. One of `["naive", "punctuated", "regex"]`              |
| author_id | snowflake | user id of the author |
| guild_id | snowflake | guild id of the owning guild |
| count | integer | number of times the auto response has been invoked |

**Somehow display priority on the frontend**

### Quotas

Quota setting for each non-admin user to have maximum number of auto-response to be able to use.

Use roles to assign more specific quota amounts within settings?

- Add in future version

### Length Restrictions

Settings for minimum length for trigger and maximum length of response

Consider implementing internal maximum length of trigger restriction to prevent extremely long regular expressions.

### Trigger Priority

Have priority be a function of mode and author (admin or not)

### UI Context view

Include info about previous conflicts & previous triggers (integration with logs)

### Command Conflicting

Include alert on website; link to commands that were overshadowed by the current command (directed graph). Can't use attribute on auto response object. Consider using another table?

**Todo: determine this**
