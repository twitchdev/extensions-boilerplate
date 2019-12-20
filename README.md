# Twitch Extension React Boilerplate
- [Twitch Extension React Boilerplate](#twitch-extension-react-boilerplate)
  - [Requirements](#requirements)
  - [First time Usage](#first-time-usage)
    - [Developer Rig Usage](#developer-rig-usage)
    - [Local Development](#local-development)
      - [Loading the Sample on Twitch](#loading-the-sample-on-twitch)
  - [Moving to Hosted Test (and beyond!)](#moving-to-hosted-test-and-beyond)
    - [Webpack Config](#webpack-config)
    - [Authentication](#authentication)
  - [File Structure](#file-structure)
    - [dist](#dist)
    - [public](#public)
    - [src](#src)

## Requirements

There is only one requirement to use this template. 

* Node.JS LTS or greater. 

## First time Usage

There are two ways to develop extensions- the first is the [Developer Rig](#developer-rig-usage), which is the preferred option. The second is to use [Local Test](#local-development) and test on Twitch on your channel page. 

### [Developer Rig](https://dev.twitch.tv/docs/extensions/rig/) Usage

If you are using the [Developer Rig](https://dev.twitch.tv/docs/extensions/rig/) and have used this as your basis for your extension, this is easy to start with. The full steps are: 

1.  Click on Add Project, then Create Project
2.  Either create a new extension or use an existing one and hit "Next"
3.  Choose "Use boilerplate code" under "Add Code to your Project" and hit "Next"
4.  Let the boilerplate code download, install dependencies, and complete. Once finished, hit "Get Started"
5.  Click on "Run Frontend" and add views in the "Extension Views" tab
6.  Accept any certificate errors, as the certificate is self-signed
7.  You can now make changes in real-time and it'll update in all views!

**Please note that HTTPS only works with the Developer Rig version 1.1.4 and above.** 

If you are using a version below that, please either upgrade the Developer Rig (by either auto-updating or reinstalling the Developer Rig) or disable HTTPS. To disable HTTPS:

1. Go into `/webpack.config.js`.
2. Update `config.devServer.https = true` to `config.devServer.https = false`.
3. On the [Twitch Developer Console](https://dev.twitch.tv/console), make sure to update the Asset Hosting path for your extension to use http instead. 
4. Refresh your manifest in the Developer Rig and recreate your views. 

### Local Development

If you're wanting to develop this locally, use the below instructions. 
To use this, simply clone the repository into the folder of your choice. 

For example, to clone this into a `extensions-boilerplate` folder, simply run the following in a command line interface: 
```
git clone https://github.com/twitchdev/extensions-boilerplate
```

Next, do the following: 

1. Change directories into the cloned folder.
2. Run `npm install` to install all prerequisite packages needed to run the template. 
3. Run `npm run start` to run the sample. By default, you should be be able to go to `https://localhost:8080/` and have the page show the instructions to get up and running. This README includes that same information. This sample requires it be run on https://twitch.tv/ or the Twitch Developer Rig to utilize the Twitch Extension Helper.  
   1. It should also give a certificate error- this is expected, as the sample uses a self-signed certificate to support HTTPS. 
   2. If you had to change the port (likely due to a port conflict), update the port in the URL above. 

#### Loading the Sample on Twitch

1.  Now that you have the boilerplate loaded and installed, you'll need two things first.
    *   Extension made on [the Twitch Developer Site](https://dev.twitch.tv/console).
    *   The extension installed on your own channel. This can be done in the "Invite Only" section of the Extension Store, where you'll find your extension listed.
2.  Once you've installed your extension, you'll need to activate the extension and add it to any of the available slots: Panel, Component, or Overlay. Do note that Component or Overlay extensions require you to be live when testing.
3.  Go to your channel on Twitch and you'll have to click on "Accept" on the extension. It should load.
4.  If it doesn't load, don't fret! Simply visit the URL for the view (https://localhost:8080/panel.html for a panel view, for example) and accept the certificate. Go back to your channel page on Twitch and you'll be good to go!

## Moving to Hosted Test (and beyond!)

When you are happy with how your extension looks locally, you can then move into Hosted Test on Twitch. 

1. Twitch will host your frontend assets for you. To upload your frontend files, zip the _contents_ of your `dist` directory after running `npm run build`. **Note that the contents of the `dist` directory must be at the root of your zip file. If you have trouble viewing your extension please make sure that your files are not wrapped in a parent folder at the root of the zip file.**
   1. For OSX, you can run `zip -r ../dist.zip dist/*` in the `dist` folder to generate a properly formatted zip file. 
   2. For Windows, you can select all files in the folder and add to compressed archive. 
2. From the [developer dashboard](https://dev.twitch.tv/console/extensions/) for your extension, navigate to the Files tab and upload your zip file. This could take a few minutes if your project is large.
3. Once your front end files are uploaded, go back to the Status tab and click on "Move To Hosted Test".
4. You should now be able to add your extension to your Twitch page and see what it looks like on your page. There is a handy link to do that in the dashboard using the "View on Twitch and Install" button! 

### Webpack Config

The Webpack config is stored under `/webpack.config.js`. Adjusting the config will allow you to disable building code for unneeded extension views. To do so, simply turn the `build` attribute on the path to `false`. 

One fairly important note is that the current configuration does not minimize the Webpack output. This is to help with the extension review policy, as turning this setting to minimize will guarantee that review will need full source to complete the review. 

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

For a small demonstration of the class, see the App component. 

## File Structure

The file structure in the template is laid out with the following: 

### dist

`/dist` holds the final JS files after building. You can simply zip up the contents of the folder to upload to Twitch to move to Hosted Test, as noted above.

### public

`/public` houses the static HTML files used for your code's entrypoint. If you need to add new entrypoints (for something custom, such as a specific view that's only for a subset of users), simply add it to the webpack config and add a new copy of the file here. 

### src

This folder houses all source code and relevant files (such as images). Each React class/component is given a folder under `components` to house all associated files (such as associated CSS).

Below this folder, the structure is much simpler.

This would be: 

```
components\
-\App\
--\App.js
--\App.test.js
--\App.css
...
-\util\
--\Authentication\
---\Authentication.js
---\Authentication.test.js
```
