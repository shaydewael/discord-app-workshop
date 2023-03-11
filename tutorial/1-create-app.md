# Step 1: Configure and install your app

## Create an app

First, we'll need to create an app.

1. Navigate to the [Developer Portal](https://discord.com/developers/applications)
2. Click **New Application** in the top-right corner
3. Enter a name for your app and click **Create**

After you create your app, you'll land on the **General Information** page. You can configure details about your app, like its name and icon. This page also includes information we'll use as we build a Discord app like the **Application ID** and **Public Key**.

The last thing to call out on this page is the URLs at the bottom. Specifically, we'll be using the **Interactions Endpoint URL** later on. We'll touch on this more later, but this is the URL where Discord will send you interactive events like command invocations and button clicks.

## Add a bot user

On the left-hand sidebar there is a **Bot** page. Go ahead and click on it.

The **Bot** page lets you add and configure a bot user for your app. Bot users allow your app to appear and perform user-like actions inside of Discord (like sending messages or managing channels).

Go ahead and click the **Add Bot** button.

> 💡 You may be required to enter 2FA info to add a bot user to your app

Once you add a bot user, you can configure basic information about how this bot appears in Discord. You'll also see your bot's token, which carries all of the permissions for your bot user.

Go ahead and get the token and store it somewhere safe (like in a password manager).

> 🔐 This token is *highly* sensitive and should never be shared with anyone or checked into any kind of version control

If you scroll down to the bottom of the **Bot** page, you'll see the different permissions that your bot user can have in Discord. These permissions determine what endpoints your app can call, and the Gateway events it can receive.

> 📖 This page also has a section for Privileged Intents. We're not going to be touching on these much, but they're a more restricted set of permissions that require approval for verified apps. You can read more about privileged intents in the [Gateway documentation](https://discord.com/developers/docs/topics/gateway#privileged-intents).

Alright, let's move ahead and install your app with some permissions.

## Install your app

To install your app, click on the **OAuth2** page on the left-hand sidebar.

There are a few different ways to install your app—we're going to be using an invite link, but other installation methods like the [authorization code grant](https://discord.com/developers/docs/topics/oauth2#authorization-code-grant) may become more important if you decide to grow your app into more servers.

For now, click on **URL Generator** on the left sidebar.

You'll be presented with a list of scopes you can request during installation. Each OAuth2 scope gives your app approval to do or access certain things in Discord. A full list of scopes and their descriptions are in the [OAuth2 documentation](https://discord.com/developers/docs/topics/oauth2#shared-resources-oauth2-scopes).

A scope that's worth calling out (and one we're about to use) is the `bot` scope. The `bot` scope is required to install the bot user with our app, along with any permissions we request. When you click on `bot`, a new table of bot permissions will appear. These are the user-like permissions talked about earlier which we'll also configure on this page.

1. Select `bot` in the scopes table
2. In the new Bot Permissions table, select the following scopes:
  - **Read Messages/View Channels** (under General Permissions): allows your app to see channels by default. Your bot user needs to be able to view the channel in order to send any messages in it.
  - **Send Messages** (under Text Permissions): allows your app to send messages in channels the bot user has access to
  - **Attach Files** (under Text Permissions): allows your app attach files when sending messages. we'll use this to send images.
3. Under the bot permissions table, copy the **Generated URL** and paste it in your browser
4. Select a server your app can be developed in (some sort of test server), and walk through the installation flow.

> 💡 You should always use a server dedicated for testing while you're developing an app. You'll be doing a lot of testing of functionality, and that would clutter and be intrusive for regular servers you're in.

If you're like me and need visual confirmation that your app was successfully installed, you can go over to the server you selected in the installation flow and make sure you can see your app in the member list.

<TODO: onwards and up to step 2>