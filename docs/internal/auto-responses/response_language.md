---
title: Auto Response Language
---

I wrote this page, give me credit

### Example

This should be updated to show a graphical tree instead of this garbage

```
hello [adj] [this is a list, with nested stuff [owl], [[member], [author]]]
```

```
(response
  hello
  (respObj [adj])
  (respObj
    (respList
      [
      (listElement
        (response this is a list)
        ,
      )
      (listElement
        (response
          with nested stuff
          (respObj [owl])
        )
        ,
      )
      (response
        (respObj
          (respList
            [
            (listElement
              (response
                (respObj [member])
              )
              ,
            )
            (response
              (respObj [author])
            )
            ]
          )
        )
      )
      ]
    )
  )
)
```
### Grammar
[this should link to develop once it's merged](https://github.com/architus/architus/blob/docker/lib/response_grammar/Response.g4)


### How to Update the Parser
`antlr4 -Dlanguage=Python3 Response.g4`
