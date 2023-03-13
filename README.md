# Building a Discord App workshop

This repo is all of the code and resources used in the Building a Discord App workshop. The app is a simple magic 8-style app:

![Demo of app](/assets/demo.gif?raw=true)

> ⚙️ [Jimp](https://github.com/jimp-dev/jimp) is used to layer text on top of images. 

## Project overview

Below is a basic overview of the project structure:

```
├── examples        -> additional code examples
│   ├── app.js      -> finished app.js file
├── utils
│   ├── fortune.js  -> code to create fortunes
│   ├── images.js   -> logic to generate images
│   ├── register.js -> register commands wih Discord
│   ├── requests.js -> code specific to Discord requests
├── app.js          -> main entrypoint for the app
├── commands.js     -> command payloads to register
├── package.json
├── README.md
├── .env.sample     -> sample .env file
└── .gitignore
```

## Guided tutorial

This repo also contains a guided tutorial that follows the steps of the workshop so that you have something to reference during and after.

👉 **[Go to the guided tutorial](tutorial/0-remix.md)**

## Additional Resources
- Read **[the documentation](https://discord.com/developers/docs/intro)** for in-depth information about API features.
- Browse the `examples/` folder in this project for smaller, feature-specific code examples
- Join the **[Discord Developers server](https://discord.gg/discord-developers)** to ask questions about the API, attend events hosted by the Discord API team, and interact with other devs.
- Check out **[community resources](https://discord.com/developers/docs/topics/community-resources#community-resources)** for language-specific tools maintained by community members.