from datetime import date, datetime

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

"""Additional seed data for demo posts and likes.

Realistic posts from historical computer science figures to make local development
more engaging. Each post includes optional likes from other users. The seeding
script is idempotent and will skip anything that already exists.
"""

POSTS_FIXTURES: list[dict] = [
    # Ada Lovelace
    {
        "author_username": "ada",
        "content": (
            "The Analytical Engine has the potential to weave algebraic patterns "
            "just as the Jacquard loom weaves flowers and leaves."
        ),
        "likes": ["turing", "liskov", "knuth", "dijkstra"],
        "created_at": datetime(2025, 1, 5, 10, 30),
    },
    {
        "author_username": "ada",
        "content": (
            "Many consider it impossible that a machine should think. "
            "But who can foresee the consequences of what is now in progress?"
        ),
        "likes": ["linus", "hopper", "mhamilton"],
        "created_at": datetime(2025, 3, 12, 14, 15),
    },
    # Alan Turing
    {
        "author_username": "turing",
        "content": (
            "We can only see a short distance ahead, "
            "but we can see plenty there that needs to be done."
        ),
        "likes": ["ada", "hopper", "timbl"],
        "created_at": datetime(2025, 1, 8, 9, 45),
    },
    {
        "author_username": "turing",
        "content": (
            "Sometimes it is the people no one imagines anything of "
            "who do the things that no one can imagine."
        ),
        "likes": ["mhamilton", "liskov", "radia"],
        "created_at": datetime(2025, 2, 14, 16, 20),
    },
    {
        "author_username": "turing",
        "content": (
            "A computer would deserve to be called intelligent if it could deceive "
            "a human into believing that it was human."
        ),
        "likes": ["dijkstra", "knuth"],
        "created_at": datetime(2025, 5, 22, 11, 10),
    },
    # Grace Hopper
    {
        "author_username": "hopper",
        "content": "The most dangerous phrase in the language is 'We've always done it this way.'",
        "likes": ["linus", "gvanrossum", "timbl", "beich"],
        "created_at": datetime(2025, 1, 15, 13, 30),
    },
    {
        "author_username": "hopper",
        "content": "It's easier to ask forgiveness than it is to get permission. Ship it!",
        "likes": ["linus", "ken", "dmr"],
        "created_at": datetime(2025, 4, 3, 10, 0),
    },
    {
        "author_username": "hopper",
        "content": (
            "If it's a good idea, go ahead and do it. "
            "It's much easier to apologize than it is to get permission."
        ),
        "likes": ["turing", "mhamilton"],
        "created_at": datetime(2025, 7, 18, 15, 45),
    },
    # Linus Torvalds
    {
        "author_username": "linus",
        "content": "Talk is cheap. Show me the code.",
        "likes": ["ken", "dmr", "gvanrossum", "anders", "bjarne"],
        "created_at": datetime(2025, 1, 20, 8, 15),
    },
    {
        "author_username": "linus",
        "content": (
            "Most good programmers do programming not because they expect to get paid, "
            "but because it is fun to program."
        ),
        "likes": ["gvanrossum", "matz", "gosling"],
        "created_at": datetime(2025, 3, 25, 11, 40),
    },
    {
        "author_username": "linus",
        "content": (
            "Bad programmers worry about the code. "
            "Good programmers worry about data structures and their relationships."
        ),
        "likes": ["ken", "knuth", "liskov"],
        "created_at": datetime(2025, 6, 10, 9, 20),
    },
    # Guido van Rossum
    {
        "author_username": "gvanrossum",
        "content": (
            "Beautiful is better than ugly. Explicit is better than implicit. "
            "Simple is better than complex."
        ),
        "likes": ["linus", "matz", "timbl", "anders"],
        "created_at": datetime(2025, 1, 25, 10, 30),
    },
    {
        "author_username": "gvanrossum",
        "content": (
            "Python is an experiment in how much freedom programmers need. "
            "Too much freedom and nobody can read another's code."
        ),
        "likes": ["linus", "gosling", "beich"],
        "created_at": datetime(2025, 4, 15, 14, 20),
    },
    {
        "author_username": "gvanrossum",
        "content": (
            "If you decide that you're going to do only the things you know "
            "are going to work, you're going to leave a lot of opportunity on the table."
        ),
        "likes": ["hopper", "timbl"],
        "created_at": datetime(2025, 8, 5, 16, 10),
    },
    # Margaret Hamilton
    {
        "author_username": "mhamilton",
        "content": (
            "Looking back, we were the luckiest people in the world. "
            "There was no choice but to be pioneers."
        ),
        "likes": ["ada", "hopper", "radia", "liskov", "hedy"],
        "created_at": datetime(2025, 2, 1, 9, 0),
    },
    {
        "author_username": "mhamilton",
        "content": (
            "One of the things that we did was to define the concept of "
            "software engineering in order to build reliability into software."
        ),
        "likes": ["turing", "dijkstra", "knuth"],
        "created_at": datetime(2025, 5, 10, 11, 30),
    },
    # Donald Knuth
    {
        "author_username": "knuth",
        "content": (
            "Premature optimization is the root of all evil "
            "(or at least most of it) in programming."
        ),
        "likes": ["linus", "gvanrossum", "ken", "dmr", "dijkstra"],
        "created_at": datetime(2025, 2, 5, 8, 45),
    },
    {
        "author_username": "knuth",
        "content": (
            "Let us change our traditional attitude to the construction of programs: "
            "Instead of imagining that our main task is to instruct a computer what to do, "
            "let us concentrate rather on explaining to human beings what we want "
            "a computer to do."
        ),
        "likes": ["gvanrossum", "timbl", "liskov"],
        "created_at": datetime(2025, 6, 20, 13, 15),
    },
    # Tim Berners-Lee
    {
        "author_username": "timbl",
        "content": (
            "The Web as I envisaged it, we have not seen it yet. "
            "The future is still so much bigger than the past."
        ),
        "likes": ["gvanrossum", "beich", "gosling", "anders"],
        "created_at": datetime(2025, 2, 10, 10, 0),
    },
    {
        "author_username": "timbl",
        "content": "We need diversity of thought in the world to face the new challenges.",
        "likes": ["hopper", "mhamilton", "liskov", "radia"],
        "created_at": datetime(2025, 5, 28, 14, 40),
    },
    {
        "author_username": "timbl",
        "content": (
            "The Web is more a social creation than a technical one. "
            "I designed it for a social effect."
        ),
        "likes": ["ada", "turing", "dijkstra"],
        "created_at": datetime(2025, 9, 1, 11, 20),
    },
    # Barbara Liskov
    {
        "author_username": "liskov",
        "content": (
            "A good programming language is one that helps programmers "
            "think clearly about their programs."
        ),
        "likes": ["gvanrossum", "matz", "anders", "gosling"],
        "created_at": datetime(2025, 2, 18, 15, 10),
    },
    {
        "author_username": "liskov",
        "content": (
            "Data abstraction and hierarchy are the two fundamental "
            "organizing principles in computer science."
        ),
        "likes": ["knuth", "dijkstra", "mhamilton"],
        "created_at": datetime(2025, 7, 8, 9, 45),
    },
    # Ken Thompson & Dennis Ritchie
    {
        "author_username": "ken",
        "content": "One of my most productive days was throwing away 1000 lines of code.",
        "likes": ["linus", "dmr", "gvanrossum", "knuth"],
        "created_at": datetime(2025, 3, 2, 10, 15),
    },
    {
        "author_username": "ken",
        "content": "When in doubt, use brute force.",
        "likes": ["linus", "dmr"],
        "created_at": datetime(2025, 8, 12, 14, 30),
    },
    {
        "author_username": "dmr",
        "content": "C is quirky, flawed, and an enormous success.",
        "likes": ["ken", "linus", "bjarne", "gosling"],
        "created_at": datetime(2025, 3, 8, 9, 30),
    },
    {
        "author_username": "dmr",
        "content": "UNIX is simple. It just takes a genius to understand its simplicity.",
        "likes": ["ken", "linus", "gvanrossum"],
        "created_at": datetime(2025, 7, 25, 11, 0),
    },
    # Brendan Eich
    {
        "author_username": "beich",
        "content": (
            "Always bet on JS. It's the cockroach of programming languages - "
            "it will outlive us all."
        ),
        "likes": ["gvanrossum", "timbl", "anders"],
        "created_at": datetime(2025, 3, 15, 13, 45),
    },
    {
        "author_username": "beich",
        "content": "I created JavaScript in 10 days. I'm still paying for that technical debt.",
        "likes": ["linus", "gvanrossum", "anders", "gosling"],
        "created_at": datetime(2025, 9, 10, 10, 20),
    },
    # Bjarne Stroustrup
    {
        "author_username": "bjarne",
        "content": (
            "C makes it easy to shoot yourself in the foot; C++ makes it harder, "
            "but when you do it blows your whole leg off."
        ),
        "likes": ["linus", "ken", "dmr", "gvanrossum"],
        "created_at": datetime(2025, 3, 20, 15, 10),
    },
    {
        "author_username": "bjarne",
        "content": (
            "There are only two kinds of languages: the ones people complain about "
            "and the ones nobody uses."
        ),
        "likes": ["gvanrossum", "beich", "matz", "gosling", "anders"],
        "created_at": datetime(2025, 8, 18, 9, 0),
    },
    # Yukihiro Matsumoto
    {
        "author_username": "matz",
        "content": (
            "I hope to see Ruby help every programmer in the world to be productive, "
            "and to enjoy programming, and to be happy."
        ),
        "likes": ["gvanrossum", "linus", "anders"],
        "created_at": datetime(2025, 4, 5, 11, 45),
    },
    {
        "author_username": "matz",
        "content": (
            "Often people, especially computer engineers, focus on the machines. "
            "But in fact we need to focus on humans."
        ),
        "likes": ["timbl", "hopper", "liskov"],
        "created_at": datetime(2025, 9, 15, 14, 0),
    },
    # James Gosling
    {
        "author_username": "gosling",
        "content": "Write once, run anywhere. That was the dream of Java.",
        "likes": ["anders", "bjarne", "beich"],
        "created_at": datetime(2025, 4, 10, 10, 30),
    },
    {
        "author_username": "gosling",
        "content": (
            "The problem with object-oriented languages is they've got all this "
            "implicit environment that they carry around."
        ),
        "likes": ["linus", "ken"],
        "created_at": datetime(2025, 8, 28, 13, 20),
    },
    # Anders Hejlsberg
    {
        "author_username": "anders",
        "content": "TypeScript started with a simple idea: JavaScript that scales.",
        "likes": ["beich", "gvanrossum", "timbl", "gosling"],
        "created_at": datetime(2025, 4, 20, 9, 15),
    },
    {
        "author_username": "anders",
        "content": (
            "Type systems are about proving the absence of certain kinds of errors. "
            "They're not about proving correctness."
        ),
        "likes": ["liskov", "dijkstra", "knuth"],
        "created_at": datetime(2025, 9, 20, 16, 30),
    },
    # Edsger W. Dijkstra
    {
        "author_username": "dijkstra",
        "content": "Simplicity is prerequisite for reliability.",
        "likes": ["knuth", "liskov", "ken", "mhamilton", "turing"],
        "created_at": datetime(2025, 5, 5, 8, 30),
    },
    {
        "author_username": "dijkstra",
        "content": (
            "If debugging is the process of removing bugs, "
            "then programming must be the process of putting them in."
        ),
        "likes": ["linus", "hopper", "gvanrossum"],
        "created_at": datetime(2025, 7, 15, 10, 45),
    },
    {
        "author_username": "dijkstra",
        "content": (
            "Computer science is no more about computers than astronomy is about telescopes."
        ),
        "likes": ["ada", "turing", "knuth", "liskov"],
        "created_at": datetime(2025, 10, 1, 14, 20),
    },
    # Hedy Lamarr
    {
        "author_username": "hedy",
        "content": "All creative people want to do the unexpected. It's the thrill of invention.",
        "likes": ["ada", "hopper", "mhamilton", "turing"],
        "created_at": datetime(2025, 5, 15, 13, 0),
    },
    {
        "author_username": "hedy",
        "content": (
            "Hope and curiosity about the future seemed better than guarantees. "
            "That's the way I was."
        ),
        "likes": ["radia", "liskov"],
        "created_at": datetime(2025, 10, 5, 11, 30),
    },
    # Radia Perlman
    {
        "author_username": "radia",
        "content": (
            "The Spanning Tree Protocol might not be glamorous, "
            "but it keeps networks from melting down."
        ),
        "likes": ["timbl", "ken", "dmr"],
        "created_at": datetime(2025, 6, 1, 9, 15),
    },
    {
        "author_username": "radia",
        "content": (
            "I think of networks as living things. They need to heal themselves, adapt, and grow."
        ),
        "likes": ["mhamilton", "liskov", "hedy"],
        "created_at": datetime(2025, 10, 8, 15, 10),
    },
    # Satoshi Nakamoto
    {
        "author_username": "satoshi",
        "content": (
            "The root problem with conventional currency is all the trust "
            "that's required to make it work."
        ),
        "likes": ["linus", "ken"],
        "created_at": datetime(2025, 6, 15, 12, 0),
    },
    {
        "author_username": "satoshi",
        "content": (
            "I've moved on to other things. Bitcoin is in good hands with Gavin and everyone."
        ),
        "likes": [],
        "created_at": datetime(2025, 10, 10, 16, 45),
    },
    # Adam Test (testing account with mundane posts)
    {
        "author_username": "adamtest",
        "content": "Just testing this new feature. Looks pretty cool!",
        "likes": ["linus"],
        "created_at": datetime(2025, 10, 15, 10, 0),
    },
    {
        "author_username": "adamtest",
        "content": "Does anyone know a good tutorial for getting started with algorithms?",
        "likes": ["knuth", "dijkstra"],
        "created_at": datetime(2025, 10, 20, 13, 25),
    },
]

# Follow relationships - who follows whom
FOLLOWS_FIXTURES: list[dict] = [
    # Core programming language creators follow each other
    {"follower": "gvanrossum", "following": "linus"},
    {"follower": "linus", "following": "gvanrossum"},
    {"follower": "matz", "following": "gvanrossum"},
    {"follower": "gvanrossum", "following": "matz"},
    {"follower": "beich", "following": "gvanrossum"},
    {"follower": "anders", "following": "beich"},
    {"follower": "gosling", "following": "bjarne"},
    {"follower": "bjarne", "following": "dmr"},
    # Historical figures follow pioneers
    {"follower": "turing", "following": "ada"},
    {"follower": "hopper", "following": "ada"},
    {"follower": "mhamilton", "following": "hopper"},
    {"follower": "liskov", "following": "mhamilton"},
    {"follower": "radia", "following": "hopper"},
    {"follower": "hedy", "following": "ada"},
    # Unix/Linux creators
    {"follower": "linus", "following": "ken"},
    {"follower": "linus", "following": "dmr"},
    {"follower": "ken", "following": "dmr"},
    {"follower": "dmr", "following": "ken"},
    # Academic/theoretical CS figures
    {"follower": "knuth", "following": "dijkstra"},
    {"follower": "dijkstra", "following": "turing"},
    {"follower": "liskov", "following": "dijkstra"},
    {"follower": "dijkstra", "following": "knuth"},
    # Web/network pioneers
    {"follower": "timbl", "following": "radia"},
    {"follower": "radia", "following": "timbl"},
    {"follower": "timbl", "following": "beich"},
    # Cross-generational follows
    {"follower": "anders", "following": "knuth"},
    {"follower": "gosling", "following": "liskov"},
    {"follower": "matz", "following": "hopper"},
    {"follower": "beich", "following": "turing"},
    # Popular figures with many followers
    {"follower": "adamtest", "following": "linus"},
    {"follower": "adamtest", "following": "gvanrossum"},
    {"follower": "adamtest", "following": "knuth"},
    {"follower": "adamtest", "following": "dijkstra"},
    {"follower": "adamtest", "following": "timbl"},
    # Some asymmetric follows (realistic social patterns)
    {"follower": "satoshi", "following": "linus"},
    {"follower": "satoshi", "following": "ken"},
    {"follower": "hedy", "following": "mhamilton"},
    {"follower": "hedy", "following": "radia"},
    # Additional cross-connections for realistic network
    {"follower": "knuth", "following": "ada"},
    {"follower": "timbl", "following": "ada"},
    {"follower": "linus", "following": "hopper"},
    {"follower": "gvanrossum", "following": "turing"},
    {"follower": "matz", "following": "liskov"},
    {"follower": "anders", "following": "mhamilton"},
    {"follower": "gosling", "following": "radia"},
    {"follower": "bjarne", "following": "hopper"},
]

## Likes are embedded in POSTS_FIXTURES via the "likes" field above.
## Follow relationships are defined in FOLLOWS_FIXTURES above.
