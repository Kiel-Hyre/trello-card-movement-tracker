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

- List all boards

2. Step 2: Fetch Card Data

```
  npm run get-cards-history <board_id>
```

- Get Cards history base on Board Id

3. Step 3: Generate CSV File

```
  npm run export-cards-history
```

- Get Cards from all boards
- List down Cards history
- Export to CSV
- Generated under src/tmp/card_movements.csv

4. Step 4: Code Quality & Testing

```
  npm run test
```

- Running in Jest
- Created test scripts for services that was used by scripts, most functionalities are in services rather in actual scripts.
- All test scripts under test\scripts\

5. Step 5: Caching

```
  npm run cached-export-cards-history
```

- Check if existing src/tmp/cache_timelog.txt
- If not create new one
- Check if existing src/tmp/cache_card_movements.csv
- If not create new one, fetch data
- If timelog exists, check if outdated
- If outdated, fetch from timelog to today
- Update src/tmp/cache_card_movements.csv

6. Step 6: Google Sheets Integration

```
  npm run export-cards-history-sheets
```

- When executed it will update the google sheet provided with new value instead of saving in sheets
- [Viewable here](https://docs.google.com/spreadsheets/d/16ujg-jDSlPYG6t7ic7kiGCoGSOoPzeXAFj9mJRMaQRA/edit?usp=sharing)

7. Step 7: Incremental CSV Updates

```
  npm run append-card-history <cardId> <startDateTime || null> <endDateTime || null>
```

- Will get or create src/tmp/even_card_movements.csv
- Accepting cardId startDateTime endDateTime
- cardId - card ID
- startDateTime (optional) - put a dt formatted string if filled e.g 2024-01-01 2024-01-01T00:00:00Z
- endDateTime (optional) - put a dt formatted string if filled e.g 2024-01-01 2024-01-01T00:00:00Z
- if no startDate or no endDate specified, will get all possible history of that card
- Append the new event in that file.

8. Step 8: Status Cards CSV

```
  npm run update-cards-status
```

- Fetch all rows in src/tmp/card_status.csv
- Fetch all new rows in all boards
- Get the corresponding details
- If row doesnt exist update it as Deleted
- Update src/tmp/card_status.csv

### Screenshots and Outputs

- Uploaded here in [Gdrive](https://drive.google.com/drive/folders/1txVZhR8oMEgHtob9l5ndJWF_R6LS7a_f?usp=sharing)
- env keys are here also for the sake of demonstration
- For CSV file [search here](https://github.com/Kiel-Hyre/trello-card-movement-tracker/tree/main/src/tmp)

### Additional Dockerfile

- there is this dockerfile, in case that you want to enclose in a container
- Build the Dockerfile

```
docker build -t node-app .
```

- Run the image

```
docker run -p 3000:3000 --name node-app-container node-app
```
