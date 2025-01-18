### Token Of Trust - Trial

- A set of trials to integrate Trello API via Node scripts

### Requirements

- [Node v20.10.0](https://nodejs.org/en)
- NPM
- .env

### Installation

- install dependencies, make sure in directory with package.json, package-lock.json

```
  npm install
```

- create a .env in the main dir and copy paste the KEYs in .env.example
- provide the neccesary keys

### Description

- masked via npm commands to shorten node commands e.g node scr/scripts/...
- all scripts were inside src/scripts

### Answers

1. Step 1: Setup Trello Integration

```
  npm run get-boards
```

2. Step 2: Fetch Card Data

```
  npm run get-card-history <board_id>
```

3. Step 3: Generate CSV File

```
  npm run export-card-history <board_id>
```

- Generated under src/tmp/card_movements.csv

4. Step 4: Code Quality & Testing

```
  npm run test
```

- Running in Jest
- Created test scripts for services that was used by scripts, most functionalities are in services rather in actual scripts.

5. Step 5: Caching

```
  npm run cached-export-card-history <board_id>
```

- Checking if last log was older than 24, if yes retrieve new data and save under src/tmp/cached_card_movements.csv

6. Step 6: Google Sheets Integration

```
  npm run export-card-history-sheets <board_id>
```

- When executed it will update the google sheet provided with new value instead of saving in sheets
- [Viewable here](https://docs.google.com/spreadsheets/d/16ujg-jDSlPYG6t7ic7kiGCoGSOoPzeXAFj9mJRMaQRA/edit?usp=sharing)

7. Step 7: Incremental CSV Updates

```
  npm run event-card-history <board_id> <cardName> <oldId> <newId> <timeStamp>
```

- Will get or create src/tmp/even_card_movements.csv
- Append the new event in that file.

### Screenshots and Outputs

- Uploaded here in [Gdrive](https://drive.google.com/drive/folders/1Ww6_E1A5NDja5rQiNeewrsbVGjH7tE17?usp=sharing)
