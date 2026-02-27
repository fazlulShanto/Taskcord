Task-waku is a sass app that tries to unify dev project task management flow for small or solo developer who use discord as their main communication channel. Task-waku is like trello but have seamless integration with discord.

this is a mono repo. which contains mainly 3 app (in /apps directory):

- an api
- a dashboard UI(react)
- a discord bot

there are 3 packages( in /packages directory):

- elsint config
- typescript config
- a database schema & DAL packages that is shared by both API & discord bot. using Drizzle as ORM

Pricing model of this sass is:

- Free tier: upto 2 Project, 2 Member
- Paid Tier: $3 per project, $1 Per member
