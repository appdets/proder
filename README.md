# Proder

Proder is a tiny DevOps tool to build a production version of development directory smartly. (less than 3 kb !)

Proder simply separates your production version of working directory without garbadge files, source files, modules and confidential files. Rename, move and exclude files using custom configuration file. You can compress your production into zip / tar too. 

All everything is in a single command!

## Installation

Use the package manager [npm](https://www.npmjs.com) to install Proder from your terminal

```bash
npm i -g Proder
```
*Install Proder globally to use CLI functionalities from your terminal*

## Commands

###### Show help
```bash
proder --help
# or
proder -h
```

###### Show version
```bash
proder --version
# or
proder -v
```

#### Build directory
```bash
proder --build
# or
proder -b
```

##### Compress
```bash
proder -b --compress
# or
proder -b -c       #will compress into zip
```

##### Compress custom format
```bash
proder -b --compress=tar       # zip|tar|false
```

## Configuration

##### Initialize configuration
```bash
proder --init
# or
proder -i
```
Initilizing proder will create the default configuration file in root directory

If your configuration file is *proder.config.js*, then you don't need to mention file path to CLI


##### Configuration explaination
```javascript
module.exports = {
    "src": "",                  // path to root working directory, "" means current directory; default is ""
    "build": "build",           // path to build directory or compressed file name; default is current directory name
    "compress": {               // set false to disable compressing; default is true
        "extension": "zip",     // zip | tar ; default is zip
        "level" : "high"        // high | low | medium; default is high
     },
    "exclude": [                // exclude files and directory from build; default is []
        "node_modules",
        ".git",
        "src/scss/*"            // supports regular expression
    ],          
    "move": [                   // move or rename directories or files; default is []
        [
            "from/path/block.js", "to/path/index.js"
        ] 
    ]              
}
```
#### Custom Configuration

Supports custom configuration, just mention new configuration file to cli
```bash
proder -b --config=path/to/config
``` 
You can use common_excludes list from Proder

```javascript
const { common_excludes } = require("proder) 

module.exports = { 
    "build": "build",
    "exclude": [...common_excludes]
}
```
You can try console.log(common_excludes) to show that exactly inside the list

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
Make a request at [Proder GIT](https://github.com/appdets/proder) on github public repository

Please make sure to update tests as appropriate.
##### Published by [Jafran Hasan](https://fb.com/IamJafran) 

## License
[MIT](https://choosealicense.com/licenses/mit/) Public