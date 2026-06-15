## Exercise 0.6 — New note in Single page app diagram

```
note over browser: user types note and clicks Save
browser->server: POST /exampleapp/new_note_spa
note over server: server saves note, returns 201
server-->browser: 201 JSON confirmation
note over browser: spa.js adds note to list and re-renders page
note over browser: NO page reload — DOM updated by JavaScript
```