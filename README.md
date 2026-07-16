# AronaBot

A Blue Archive themed Discord bot.

**INVITE LINK:** https://discord.com/oauth2/authorize?client_id=1155234220906647646

## Requirements

- Rust 1.80+ (edition 2021)
- PostgreSQL (read-only access; schema managed externally)
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

3. Build and run:

```sh
cargo run --release
```

For development:

```sh
cargo run
```

## Environment

| Variable | Required | Description |
|----------|----------|-------------|
| `BOT_TOKEN` | yes | Discord bot token |
| `BOT_CLIENT_ID` | yes | Discord application client id |
| `OWNER_ID` | yes | Bot owner user id |
| `DATABASE_URL` | yes | Postgres connection string |
| `STAFF_IDS` | no | Comma-separated staff user ids |
| `BOT_DEFAULT_ACTIVITY` | no | Playing status text |
| `IS_MAINTENANCE` | no | Set to `true` to block commands |
| `REDIS_URL` | no | Redis for recruitment points |
| `R2_PUBLIC_ACCESS_URL` | no | CDN base for student portraits |

## Commands

**Fun:** `/gacha`, `/spark`, `/cafe`, `/studentoftheday`
**Utility:** `/student`, `/skills`, `/mission`, `/birthdays`, `/gifts`
**Staff:** `/reload`, `/rrp`, `/quick-gacha`, `/simulate-gacha`

Gacha result images are rendered with [Takumi](https://github.com/kane50613/takumi).

## Credits

- [poise][poise-url] / [serenity][serenity-url] - Discord library/framework.
- [Takumi][takumi-url] - Gacha result image renderer.
- [Blue Archive Wiki][miraheze-wiki-url] / [SchaleDB][schaledb-url] - Game data.

## License

The project is licensed under MIT. See [LICENSE](LICENSE) for more information.

> [!NOTE]
> AronaBot is in no way affiliated or endorsed by NEXON Games Co., Ltd. or
> Yostar, Inc. Blue Archive, as well as all related images and content, are
> registered trademarks of NEXON Games Co., Ltd. and Yostar, Inc.

[poise-url]: https://github.com/serenity-rs/poise
[serenity-url]: https://github.com/serenity-rs/serenity
[takumi-url]: https://github.com/kane50613/takumi
[miraheze-wiki-url]: https://bluearchive.wiki
[schaledb-url]: https://schaledb.com
