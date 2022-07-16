# mcserverbot
A little dockerized discord bot to give minecraft server status.

Its main functionality is to create an embed that the bot will edit every 5 minutes showing the current server status:
![image](https://user-images.githubusercontent.com/39732448/179361470-6e1c9491-736e-4588-b88e-97bb4d239655.png)

# How to run:
This is not particularly well designed, so to get it working probably will take long enough that by the end you will be able to create your own. But, roughly:
1. Install prerequisites: node, docker and docker-compose 
2. Create a discord bot using the [discord developer portal](https://discord.com/login?redirect_to=%2Fdevelopers%2Fapplications)
3. Clone this repo, 
4. run `npm install`
5. create a file named `.env` and add your discord bot token and app id
    ```
    APP_ID=
    TOKEN=
    ```
6. Run `npm register`. This will register all the slash comands with discord.
7. run `docker compose up`

# How to use
Use `/help` to see the list of commands. The status embed is started with the `/runstat` command
