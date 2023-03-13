# Step 0: Setup project

#### In this step
- Set up your Glitch project

---

Before we dive in, we'll need to set up our actual project. If you prefer developing locally, you're more than welcome to do so but to make setup a bit easier, I recommend using an online IDE like [Glitch](https://glitch.com) or [Replit](https://replit.com). Both of these give you a public environment where you can develop and run your app.

> 💡 That "public" part of public environment is important because Discord needs a public URL where it can send interactive events that are relevant to your app (like when a user invokes your app's slash command). If you're developing locally, you'll need to tunnel requests using a tool like [ngrok](https://ngrok.com/).

## Remix Glitch project

This guide uses Glitch, but feel free to use whichever environment you prefer.

1. [Login to Glitch](https://glitch.com/signin) (or if you don't have an account, you can [sign up for one](https://glitch.com/signup)).
2. [🎏 Remix the project](https://glitch.com/edit/#!/import/git?url=https://github.com/shaydewael/discord-app-workshop.git)

After you remix the project you'll see your project:

![Demo of app](/assets/glitch-screenshot.png?raw=true)

> 💡 `.env` is where all of your app's credentials will go (we'll get these soon)

### Next steps

With project setup complete, let's move forward and [create a Discord app](1-create-app.md).

#### Table of contents

- [x] Step 0: Project setup
- [ ] 👉 [Step 1: Create app](1-create-app.md)
- [ ] Step 2: Next
- [ ] Step 3: Okay again
- [ ] Step 4: oki