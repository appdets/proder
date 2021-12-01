# NicerJS

A tiny lightweight DevOps tool for building a production version of development directory smartly

NicerJS simply separates your production version of working directory without garbadge files, source files, modules and confidential files. Rename, move and exclude files 

## Installation

Use the package manager [npm](https://www.npmjs.com) to install NicerJS from your terminal

```bash
$ npm install -g nicerjs
```
*Install nicerjs globally to use CLI functionalities*

## Commands

###### Show help
```bash
$ nicer --help
```
or
```bash
$ nicer -h
```
###### Show version
```bash
$ nicer --version
```
or 
```bash
$ nicer -v
```
#### Build directory
```bash
$ nicer --build
```
or 
```bash
$ nicer -b
```
##### Compress
```bash
$ nicer -b -compress
```
or
```bash
$ nicer -b -c # will compress into zip
```
##### Compress custom format
```bash
$ nicer -b -compress=tar  # zip|tar|false
```

## Configuration

##### Initialize configuration
```bash
$ nicer --init
```
Initilizing nicer will create the default configuration JSON file in root directory

If your configuration file is *nicer.json*, then you don't need to mention file path to CLI


##### Default configuration
```json
{
    "src": "",              // path/to/src
    "build": "build",       // path/to/build
    "compress": {           // set false to disable compressing
        "extension": "zip", // zip | tar
        "level" : "high"    // high | low | medium
     },
    "exclude": []           // supports regular express
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
##### Published by [Jafran Hasan](https://fb.com/IamJafran), 

## License
[MIT](https://choosealicense.com/licenses/mit/)