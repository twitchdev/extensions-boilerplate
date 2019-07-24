# Native React Boilerplate

## Requirements

There is only one requirement to use this template. 

* Node.JS LTS or greater. 

You may also find that using `yarn` is easier than `npm`, so we do recommend installing that as well by running: 
```
npm i -g yarn
``` 
in an elevated command line interface.

If you opt to use `npm`, simply replace all mentions of `yarn` below with `npm run`, such as `npm run start` or `npm run build`. 

## First time Usage

### [Developer Rig](https://dev.twitch.tv/docs/extensions/rig/) Usage

If you are using the developer rig and have used this as your basis for your extension, please ignore the below steps- the developer rig has taken care of it for you! 

### Please note that HTTPS only works with the Developer Rig version 1.1.4 and above. 

If you are using a version below that, please either upgrade or disable HTTP. To do so:

1. Go into `/webpack.config.js`
2. Update `config.devServer.https = true` to `config.devServer.https = false`
3. On the [Twitch Developer Console](https://dev.twitch.tv/console), make sure to update the Asset Hosting path for your extension to use http instead. 
4. Refresh your manifest in the Developer Rig and recreate your views. 

### Local Development

If you're wanting to develop this locally, use the below instructions. 
To use this, simply clone the repository into the folder of your choice. 

For example, to clone this into a `<repo name here>` folder, simply run the following in a commandline interface: 
```
git clone <repo name to be fixed later>
```

Next, do the following: 

1. Change directories into the cloned folder.
2. Run `yarn install` to install all prerequisite packages needed to run the template. 
3. Run `yarn start` to run the sample. If everything works, you should be be able to go to the developer rig, create a panel view, and see `Hello world!`

## Building Production Files

To build your finalized React JS files, simply run `yarn build` to build the various webpacked files. These files will use code splitting to only load in the libraries needed for that view, while still allowing you to reuse components. 

### Webpack Config

The Webpack config is stored under `/webpack.config.js`. Adjusting the config will allow you to disable building code for unneeded extension views. To do so, simply turn the `build` attribute on the path to `false`. 

Additionally, feel free to modify the code as needed to add either additional plugins (via modifying the plugins variable at the top) or simply adjusting/tuning the output from Webpack. 

### Authentication

There is a basic Authentication class included in this boilerplate to handle simple use-cases for tokens/JWTs. 

It is important to note that this class does not validate that the token is legitimate, and instead should only be used for presentational purposes. 

If you need to use the token for any logic/permissioning, please have your EBS validate the token on request using the `makeCall()` method as provided in the function. This will automatically pass the JWT to the endpoint provided. 

To initialize the class:  

```javascript
const Authentication = require('../Authentication/Authentication');
this.Authentication = new Authentication();
```

To set a token: 

```javascript
window.Twitch.ext.onAuthorized(auth=>{
    this.Authentication.setToken(auth.token,auth.userId)
})
```

This then enables you to call a number of functions based on the token. The other functions are blind to whether the token is actually signed by Twitch, however, and should be only used for presentational purposes. Any requests to the backend should validate that the token is signed correctly by comparing signatures. 

For a small demonstration of the class, see the App compoonent. 

## File Structure

The file structure in the template is laid out with the following: 

### dist

`/dist` holds the final JS files after building. You can simply zip up the contents of the folder to upload to Twitch to move to Hosted Test. 

### public

`/public` houses the static HTML files used for your code's entrypoint. If you need to add new entrypoints (for something custom), simply add it to the webpack config and add a new copy of the file here. 

### src

This folder houses all source code and relevant files (such as images). Each React class/component is given a folder to house all associated files (such as associated CSS).

Below this folder, the structure is much simpler.

This would be: 

```
components\
-\App\
--\App.js
--\App.test.js
--\App.css
-\Authentication\
--\Authentication.js
...
-\static\
--\images
---\sample_image.jpeg
```

Each component is under the `components` folder.
