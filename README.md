# NicerJS

A tiny lightweight DevOps tool for building a production version of development directory smartly

## Installation

Use the package manager [npm](https://www.npmjs.com) to install NicerJS from your terminal

```bash
$ npm i -g nicerjs
```
*Install nicerjs globally to use CLI functionalities*

## Usages

###### Show help
```bash
$ nicer -h
```
###### Show version
```bash
$ nicer -v
```
#### Build directory
```bash
$ nicer -b
```
###### Compress
```bash
$ nicer -b -compress
```
###### Compress custom format
```bash
$ nicer -b -compress=tar #zip|tar|false
```

## Configuration
default file name should be *nicer.json*
```json
{
    "src": "",              # path/to/src
    "build": "build",       # path/to/build
    "compress": {           # set false to disable compressing
        "extension": "zip", # zip | tar
        "level" : "high"    # high | low | medium
     },
    "exclude": []           # supports regular express
}
```
#### Custom Configuration

Supports custom configuration, just mention new configuration file to cli
```bash
$ nicer -b --config=path/to/config
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.
##### Published by [Jafran Hasan](https://fb.com/IamJafran)

## License
[MIT](https://choosealicense.com/licenses/mit/)