# AronaBot

A Blue Archive themed Discord bot.

## Requirements

- Node.js v18 or higher
- A Discord bot token
- Redis (optional)

## Getting Started

1. Clone the repo:

```sh
git clone git@github.com:jozsefsallai/aronabot.git
cd aronabot
```

2. Configure the env:

```sh
cp .env.example .env
vim .env
```

3. Install dependencies:

```sh
npm i -g pnpm
pnpm install
```

You may use a different package manager if you'd like, but if you plan on
submitting contributions, please use `pnpm` or don't check out any lockfiles
generated by other package managers.

4. Build the bot:

```sh
pnpm run build
```

5. Start the bot:

```sh
pnpm run start
```

> [!NOTE]
> Alongside the bot, a web server will also be started on port 3000 (which can
> be changed using the `PORT` environment variable). This web server is meant
> for internal use by the bot and is not meant to be exposed to the public.

## Useful Commands

**Scrape student data from [the Blue Archive wiki][miraheze-wiki-url]:**

```sh
node bin/scrapeStudents
```

**Scrape mission data from [the Blue Archive wiki][miraheze-wiki-url]:**

```sh
node bin/scrapeMissions
```

**Scrape student skill data from [the Blue Archive wiki][miraheze-wiki-url]:**

```sh
node bin/scrapeSkills
```

## Credits

- [Discord.js][discordjs-url].
- [Blue Archive Wiki][miraheze-wiki-url] for student, skill, and mission data.
- [bluearchive.page][bluearchive-page-url] for student icons and the foundations
  of the gacha user interface.
- [SchaleDB][schaledb-url].

## License

The project is licensed under MIT. See [LICENSE](LICENSE) for more information.

> [!NOTE]
> AronaBot is in no way affiliated or endorsed by NEXON Games Co., Ltd. or
> Yostar, Inc. Blue Archive, as well as all related images and content, are
> registered trademarks of NEXON Games Co., Ltd. and Yostar, Inc.

[discordjs-url]: https://discord.js.org
[miraheze-wiki-url]: https://bluearchive.wiki
[bluearchive-page-url]: https://bluearchive.page
[schaledb-url]: https://schale.gg
