# Hit Point Manager

Hit Point Manager is a proof of concept API that loads a simple character,
calculates its starting hit points (using the rounded-up average method),
and manages its hit points.

Before building and running the application, you may modify the `characters.json`
file found in the `DDB.HitPointManager.Data/data` folder.
Available characters in the file are `Briv`, `Jonas`, and `Artemis`.

## Running Hit Point Manager in Docker

Open a command prompt from the folder with the Dockerfile
and run the following commands to build and launch the app:

```
docker build -t hpmanager .
docker run --rm -d -p 8080:8080 --name ctxhpmanager hpmanager
```

Once the app is running, open a browser and navigate to
`http://localhost:8080/api/v1/character/briv`
in order to verify the app is running.

## Assumptions

- There is no indicator for which class is the character's starting class (used to determine max HP at level 1).
  A 'starting class' indicator could be added to the classes or the max HD could be used. For purposes of this demo,
  the first class in the list is used to determine level 1 HP.
- Assumed vulnerability should also be considered along with immunity and resistance.
- Assumed handling damage modifiers was out of scope. (adding/subtracting values isn't supported by current `defenses` model)
- Assumed that stat bonuses stack and that multiple copies of an item are not included on a character.
- Assumed that handling character death was out of scope (excessive damage, no healing if dead).
- Resistances granted by items will be reflected in the `defenses` object.

## Testing the App

The various endpoints are documented below.
For your convenience, you may import the `DDB.postman_collection.json` file into Postman to use as a starting point.
You may also browse to `http://localhost:8080/swagger` to view the Swagger docs or test from the web interface.

Please note that exceptions are surfaced in this demo app. It is assumed they would be handled
appropriately by the UI in a production environment.

### Get Character - GET

`http://localhost:8080/api/v1/character/briv`

Gets json for the given character to review stats and defenses.
Character name is not case sensitive.

### Status - GET

`http://localhost:8080/api/v1/character/briv/status`

Shows the `CharacterHealth` object in its current state. This object is also returned by
the Deal Damage, Heal, and Temp HP endpoints.

### Heal - PUT

`http://localhost:8080/api/v1/character/briv/heal?value=5`

Heals hit points up to the character's maxHp amount.
Negative values will raise an error.

### Add Temporary Hit Points - PUT

`http://localhost:8080/api/v1/character/briv/temp?value=1`

Adds temporary hit points, replacing the old value only if the new value is greater.
This endpoint allows for negative numbers to subtract any temporary hit points added by mistake.

### Deal Damage - PUT

`http://localhost:8080/api/v1/character/briv/damage`

The damage endpoint request body should contain an array of damage objects, each with its damage type
and the amount of damage dealt:

```
[
    {
        "type" : "fire",
        "value" : 6
    },
        {
        "type" : "slashing",
        "value" : 9
    }
]
```

In the example attack above, made with a [Flame Tongue Greatsword](https://www.dndbeyond.com/magic-items/flame-tongue), Briv should only receive 4 damage because he is immune to fire damage and has resistance to slashing damage.

Other damage notes:

- Negative damage values are ignored.
- Only standard [Damage Types](https://www.dndbeyond.com/sources/basic-rules/combat#DamageTypes) are allowed (case insensitive)
- Character defenses are applied in the following order: immunity to the damage type, modifiers (out of scope for this demo), one resistance for the damage type, one vulnerability for the damage type

## Misc Notes, Areas for Improvement

- Enums - Some properties such as damage types, and defense types (vulnerability, etc) were made into enums to
  assist with strongly typing things. However, it could be argued this reduces flexibility
  in the event new types are introduced, so those properties could be easily changed back to strings.
  Modifer.AffectedValue was left as a string since it could potentially target various fields other than a character stat.
- CharacterHealth responses could be improved to include other stats like Status (Alive, Unconscious, Dead),
  death saves, conditions, etc.
- Damage endpoint could check for excessive damage (character HP max) that causes character death.
- Add considerations for magic/nonmagic damage
- Add considerations for defense allowing damage modifiers (eg reduce all damage by 5)
