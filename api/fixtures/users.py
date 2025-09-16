from datetime import date

# 20 deterministic demo users. Password for all is "Password123!" unless overridden.
# Keep data simple and readable; the seeding script will hash passwords.

USERS_FIXTURES: list[dict] = [
    {
        "user": {
            "name": "Ada Lovelace",
            "username": "ada",
            "email": "ada@example.com",
        },
        "profile": {
            "bio": "Mathematician and first programmer.",
            "location": "London, UK",
            "website": "https://en.wikipedia.org/wiki/Ada_Lovelace",
            "birthdate": date(1815, 12, 10),
        },
    },
    {
        "user": {
            "name": "Adam Test",
            "username": "adamtest",
            "email": "adamtest@example.com",
        },
        "profile": {
            "bio": "A simple test user.",
            "location": "Paris, France",
            "website": "https://en.wikipedia.org/wiki/Adam_Test",
            "birthdate": date(1992, 9, 24),
        },
    },
    {
        "user": {
            "name": "Alan Turing",
            "username": "turing",
            "email": "turing@example.com",
        },
        "profile": {
            "bio": "Computing pioneer and cryptanalyst.",
            "location": "London, UK",
            "website": "https://en.wikipedia.org/wiki/Alan_Turing",
            "birthdate": date(1912, 6, 23),
        },
    },
    {
        "user": {
            "name": "Grace Hopper",
            "username": "hopper",
            "email": "hopper@example.com",
        },
        "profile": {
            "bio": "Invented COBOL; coined 'debugging'.",
            "location": "New York, USA",
            "website": "https://en.wikipedia.org/wiki/Grace_Hopper",
            "birthdate": date(1906, 12, 9),
        },
    },
    {
        "user": {
            "name": "Linus Torvalds",
            "username": "linus",
            "email": "linus@example.com",
        },
        "profile": {
            "bio": "Creator of Linux and Git.",
            "location": "Portland, USA",
            "website": "https://en.wikipedia.org/wiki/Linus_Torvalds",
            "birthdate": date(1969, 12, 28),
        },
    },
    {
        "user": {
            "name": "Guido van Rossum",
            "username": "gvanrossum",
            "email": "guido@example.com",
        },
        "profile": {
            "bio": "BDFL of Python.",
            "location": "California, USA",
            "website": "https://en.wikipedia.org/wiki/Guido_van_Rossum",
            "birthdate": date(1956, 1, 31),
        },
    },
    {
        "user": {
            "name": "Margaret Hamilton",
            "username": "mhamilton",
            "email": "hamilton@example.com",
        },
        "profile": {
            "bio": "Led Apollo software engineering.",
            "location": "Cambridge, USA",
            "website": "https://en.wikipedia.org/wiki/Margaret_Hamilton_(software_engineer)",
            "birthdate": date(1936, 8, 17),
        },
    },
    {
        "user": {
            "name": "Donald Knuth",
            "username": "knuth",
            "email": "knuth@example.com",
        },
        "profile": {
            "bio": "Author of TAOCP.",
            "location": "Stanford, USA",
            "website": "https://en.wikipedia.org/wiki/Donald_Knuth",
            "birthdate": date(1938, 1, 10),
        },
    },
    {
        "user": {
            "name": "Tim Berners-Lee",
            "username": "timbl",
            "email": "timbl@example.com",
        },
        "profile": {
            "bio": "Invented the World Wide Web.",
            "location": "Boston, USA",
            "website": "https://en.wikipedia.org/wiki/Tim_Berners-Lee",
            "birthdate": date(1955, 6, 8),
        },
    },
    {
        "user": {
            "name": "Barbara Liskov",
            "username": "liskov",
            "email": "liskov@example.com",
        },
        "profile": {
            "bio": "LSP and programming languages pioneer.",
            "location": "MIT, USA",
            "website": "https://en.wikipedia.org/wiki/Barbara_Liskov",
            "birthdate": date(1939, 11, 7),
        },
    },
    {
        "user": {
            "name": "Ken Thompson",
            "username": "ken",
            "email": "ken@example.com",
        },
        "profile": {
            "bio": "Co-creator of Unix and Go.",
            "location": "New Jersey, USA",
            "website": "https://en.wikipedia.org/wiki/Ken_Thompson",
            "birthdate": date(1943, 2, 4),
        },
    },
    {
        "user": {
            "name": "Dennis Ritchie",
            "username": "dmr",
            "email": "dmr@example.com",
        },
        "profile": {
            "bio": "Created C and co-created Unix.",
            "location": "New Jersey, USA",
            "website": "https://en.wikipedia.org/wiki/Dennis_Ritchie",
            "birthdate": date(1941, 9, 9),
        },
    },
    {
        "user": {
            "name": "Brendan Eich",
            "username": "beich",
            "email": "eich@example.com",
        },
        "profile": {
            "bio": "Created JavaScript.",
            "location": "San Francisco, USA",
            "website": "https://en.wikipedia.org/wiki/Brendan_Eich",
            "birthdate": date(1961, 7, 4),
        },
    },
    {
        "user": {
            "name": "Bjarne Stroustrup",
            "username": "bjarne",
            "email": "bjarne@example.com",
        },
        "profile": {
            "bio": "Created C++.",
            "location": "Texas, USA",
            "website": "https://en.wikipedia.org/wiki/Bjarne_Stroustrup",
            "birthdate": date(1950, 12, 30),
        },
    },
    {
        "user": {
            "name": "Yukihiro Matsumoto",
            "username": "matz",
            "email": "matz@example.com",
        },
        "profile": {
            "bio": "Creator of Ruby.",
            "location": "Matsue, Japan",
            "website": "https://en.wikipedia.org/wiki/Yukihiro_Matsumoto",
            "birthdate": date(1965, 4, 14),
        },
    },
    {
        "user": {
            "name": "James Gosling",
            "username": "gosling",
            "email": "gosling@example.com",
        },
        "profile": {
            "bio": "Father of Java.",
            "location": "Calgary, Canada",
            "website": "https://en.wikipedia.org/wiki/James_Gosling",
            "birthdate": date(1955, 5, 19),
        },
    },
    {
        "user": {
            "name": "Anders Hejlsberg",
            "username": "anders",
            "email": "anders@example.com",
        },
        "profile": {
            "bio": "Created TypeScript, lead architect of C#.",
            "location": "Seattle, USA",
            "website": "https://en.wikipedia.org/wiki/Anders_Hejlsberg",
            "birthdate": date(1960, 12, 2),
        },
    },
    {
        "user": {
            "name": "Edsger W. Dijkstra",
            "username": "dijkstra",
            "email": "dijkstra@example.com",
        },
        "profile": {
            "bio": "Algorithm and software engineering pioneer.",
            "location": "Nuenen, NL",
            "website": "https://en.wikipedia.org/wiki/Edsger_W._Dijkstra",
            "birthdate": date(1930, 5, 11),
        },
    },
    {
        "user": {
            "name": "Hedy Lamarr",
            "username": "hedy",
            "email": "hedy@example.com",
        },
        "profile": {
            "bio": "Co-invented spread spectrum.",
            "location": "Vienna, AT",
            "website": "https://en.wikipedia.org/wiki/Hedy_Lamarr",
            "birthdate": date(1914, 11, 9),
        },
    },
    {
        "user": {
            "name": "Radia Perlman",
            "username": "radia",
            "email": "radia@example.com",
        },
        "profile": {
            "bio": "Mother of the Internet (STP).",
            "location": "Boston, USA",
            "website": "https://en.wikipedia.org/wiki/Radia_Perlman",
            "birthdate": date(1951, 12, 18),
        },
    },
    {
        "user": {
            "name": "Satoshi Nakamoto",
            "username": "satoshi",
            "email": "satoshi@example.com",
        },
        "profile": {
            "bio": "Invented Bitcoin (pseudonymous).",
            "location": "Cyberspace",
            "website": "https://bitcoin.org",
            "birthdate": date(1975, 4, 5),
        },
    },
]
