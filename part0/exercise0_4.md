## Exercise 0.4 — New note diagram

```
browser->server: POST /exampleapp/new_note
note over server: server saves note to list
server-->browser: 302 redirect to /exampleapp/notes
browser->server: GET /exampleapp/notes
server-->browser: 200 HTML page
browser->server: GET /exampleapp/main.css
server-->browser: 200 CSS file
browser->server: GET /exampleapp/main.js
server-->browser: 200 JavaScript file
note over browser: browser executes JS which fetches data
browser->server: GET /exampleapp/data.json
server-->browser: 200 JSON with all notes
note over browser: browser renders notes on page
```