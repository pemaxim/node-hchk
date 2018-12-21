# Nodejs API Client for healthchecks.io

The current API Client for healthchecks.io is Nodejs module. For more details see healthchecks.io [API Documentation](https://healthchecks.io/docs/api/)

## Get started

```
npm install hchk
```

```js
let client = require('hchk').Client( '{API_KEY}' );
```

## Documentation

### Get a list of existing checks

```js
client.listChecks( callback );
```

More details [here](https://healthchecks.io/docs/api/#list-checks)

### Create a new check

```js
client.createCheck( data, callback );
```

More details [here](https://healthchecks.io/docs/api/#create-check)

### Ping existing check

```js
client.pingCheck( uuid, callback );
```

### Update an existing check

```js
client.updateCheck( uuid, data, callback );
```

More details [here](https://healthchecks.io/docs/api/#update-check)

### Pause monitoring of a check

```js
client.pauseCheck( uuid, callback );
```

More details [here](https://healthchecks.io/docs/api/#pause-check)

### Delete check

```js
client.deleteCheck( uuid, callback );
```

More details [here](https://healthchecks.io/docs/api/#delete-check)

### Get a list of existing integrations

```js
client.listChannels( callback );
```

More details [here](https://healthchecks.io/docs/api/#list-channels)