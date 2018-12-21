# API Client for healthchecks.io

The current API Client for healthchecks.io is Nodejs module 

## Get started

```
npm install hchk
```

```js
let client = require('hchk').Client( '{API_KEY}' );
```

## Documentation

See healthchecks.io API Documentation [here](https://healthchecks.io/docs/api/)

### Get a list of existing checks

```js
client.listChecks( callback );
```

### Create a new check

```js
client.createCheck( data, callback );
```

### Update an existing check

```js
client.updateCheck( uuid, data, callback );
```

### Pause monitoring of a check

```js
client.pauseCheck( uuid, callback );
```

### Delete check

```js
client.deleteCheck( uuid, callback );
```

### Get a list of existing integrations

```js
client.listChannels( callback );
```