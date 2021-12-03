# NicerJS

NicerJS is a tiny DevOps tool to build a production version of development directory smartly. (less than 3 kb !)

NicerJS simply separates your production version of working directory without garbadge files, source files, modules and confidential files. Rename, move and exclude files using custom configuration file. You can compress your production into zip / tar too. 

All everything is in a single command!

## Installation

Use the package manager [npm](https://www.npmjs.com) to install NicerJS from your terminal

```bash
npm install -g nicerjs
```
*Install nicerjs globally to use CLI functionalities*

## Commands

###### Show help
```bash
nicer --help
```
or
```bash
nicer -h
```

###### Show version
```bash
nicer --version
```
or 
```bash
nicer -v
```

#### Build directory
```bash
nicer --build
```
or 
```bash
nicer -b
```

##### Compress
```bash
nicer -b --compress
```
or
```bash
nicer -b -c       #will compress into zip
```

##### Compress custom format
```bash
nicer -b --compress=tar       # zip|tar|false
```

## Configuration

##### Initialize configuration
```bash
nicer --init
``` 
or 
```bash
nicer -i
```
Initilizing nicer will create the default configuration file in root directory

If your configuration file is *nicer.config.js*, then you don't need to mention file path to CLI


##### Default configuration
```javascript
module.exports = {
    "src": "",              // path/to/src
    "build": "build",       // path/to/build
    "compress": {           // set false to disable compressing
        "extension": "zip", // zip | tar
        "level" : "high"    // high | low | medium
     },
    "exclude": [],          // supports regular express
    "move": []              // move or rename directories or files from a two dimensional array
}
```
#### Custom Configuration

Supports custom configuration, just mention new configuration file to cli
```bash
nicer -b --config=path/to/config
``` 
You can use common_excludes list from NicerJS

```javascript
const { common_excludes } = require("nicerjs) 

module.exports = { 
    "build": "build",
    "exclude": [...common_excludes]
}
```
You can try console.log(common_excludes) to show that exactly inside the list

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
Make a request at [nicerjs](https://github.com/appdets/nicer) on github public repository

Please make sure to update tests as appropriate.
##### Published by [Jafran Hasan](https://fb.com/IamJafran) 

## License
[MIT](https://choosealicense.com/licenses/mit/) Public