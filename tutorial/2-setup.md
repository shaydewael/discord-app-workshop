# Step 2: Setup credentials and interactivity

In this step you'll:
- Add credentials to your project
- Configure interactive endpoint for your app

---

## Fetch credentials

Back in your code, if you open `.sample.env`, you'll see the credentials we need to add for your Discord app before we can start running any code.

- `APP_ID` is the unique ID for your app
- `DISCORD_TOKEN` is the bot token you saved in step 1
- `PUBLIC_KEY` is used to verify requests coming from Discord.

Let's go ahead and get the credentials and add them to your `.env` file. If you are using Glitch, this will automatically be generated for you.

#### App ID

Get your app ID on the **General Information** page for your app in the [developer portal](https://discord.com/developers/applications).

> Example App ID: `1023428168414150746`

👉 **Add your App ID to `.env` file as `APP_ID`**

#### Public Key

The public key will be used to verify that requests are coming from Discord. You can get your public key on the **General Information** page for your app right under the App ID.

We're not going to touch on this much, but the code used to verify requests is in your project's `utils/requests.js` file.

> Example Public Key: `fa1232139ec5229e541762347caa907ca58bfd45983be9abcdef16470a14`

👉 **Add your Public Key to `.env` file as `PUBLIC_KEY`**

#### Authentication token

We'll need a token to authenticate some of the requests we send to Discord. While there are [multiple ways to get a token for your app](https://discord.com/developers/docs/topics/oauth2#oauth2), we'll just be using the bot user token from [Step 1](1-create-app.md).

If you didn't save your bot user token, you can regenerate it on the **Bot** page in your app settings.

> Example token: `MA1234yODE2ODQxNDE1MDc0Na.GDtok.zpretendthisisgibberishx-0wrr`

👉 **Add your bot user token to `.env` as `DISCORD_TOKEN`**

### Run project

After you setup your credentials, open **📝 Logs** at the bottom of your Glitch project.

You should see "Listening on port 3000" in the output if all was successful. If not, double check that you added your credentials to `.env` with names that match the ones in `.sample.env`.

## Setup interactive endpoint

With our project running, there's one more thing we need to configure in our app settings: the **Interactive Endpoint URL**. Since we won't be using the Gateway, this is a public endpoint where Discord will send interactive requests for our app, including when a user invokes a slash command or presses a button.

Our endpoint is going to be made up of two parts:
1. Our Glitch project URL
2. `/interactions`, which is a route set up in `app.js` where the code is set up to handle incoming Discord interaction requests.

### Glitch project URL

To get your project URL, click the **Share** button in the top left of your Glitch project. Copy the URL for your project's **Live site** (ex: `https://chrome-scintillating-punishment.glitch.me`).

> ⚠️ Your Glitch project URL is **not** just the URL where you edit your project. We specifically need the *public* URL for your project (make sure it ends in `.me`).

### Interactive Endpoint URL

The **Interactive Endpoint URL** can be set up in your app's settings on the **General Information** page.

1. Navigate to the Interactive Endpoint URL field
2. Paste your Glitch project URL 
3. Add `/interactions` to the end (ex: `https://chrome-scintillating-punishment.glitch.me/interactions`).
4. Click **Save Changes**

In the background, when you click **Save Changes**, Discord sends that URL a request to verify the endpoint is set up correctly and responding to events. If your endpoint successfully saves, that means it's all set up properly 🎉

If it doesn't save, open **📝 Logs** in your Glitch project and check to make sure your app is running without any errors

- If there is a `Error: Bad request signature`, make sure that your `.env`'s `PUBLIC_KEY` value matches the Public Key on your app's General Information page.
- Make sure that the `Listening on port 3000` output is in the logs. `3000` is the port Glitch uses so make sure that value is correct.
- Double check that your Glitch project URL ends in `.me` and matches the URL for *your* Glitch project (each project has a different URL).
- Make sure that `/interactions` is appended to your Glitch project URL in the **Interactive Endpoint URL** field.

### Next steps

With the app set up and ready to go, let's start adding logic by registering and handling a command.

#### Table of contents

- [x] [Step 0 - Project setup](0-remix.md)
- [x] [Step 1 - Create app](1-create-app.md)
- [x] [Step 2 - Setup credentials and interactivity](2-setup.md)
- [ ] 👉 **Next: [Step 3 - Register and handle slash command](3-command.md)**
- [ ] [Step 4 - Add message components](4-components.md)