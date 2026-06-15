## Exercise 0.5 — Single page app diagram

```
browser->server: GET /exampleapp/spa
server-->browser: 200 HTML document
browser->server: GET /exampleapp/main.css
server-->browser: 200 CSS file
browser->server: GET /exampleapp/spa.js
server-->browser: 200 JavaScript file
note over browser: browser executes spa.js which fetches data
browser->server: GET /exampleapp/data.json
server-->browser: 200 JSON with all notes
note over browser: JavaScript renders notes on page without reload
```