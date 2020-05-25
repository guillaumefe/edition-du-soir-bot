# edition-du-soir-bot

## Quick start
```
npm install
npm start
```

## Documentation

### main entry point : processing.js
```
 What you will find:
 - db creation (currently it creates only a list of experts, in db.expert
 - comparaison fonction : used to find out if the given question match one of our pre-recorded question
 - main : import dialogs from components folder and generate a bit of documentation at start
 - main returns the payload that is used to actually look for an ansxer
```

```
##  If you wish to add question
 1. create and cd in a folder in components or cd into one existing
 2. create a file index.js if there is no such file in the folder you are
 3. create a file my_command.js
 4. add content to my_command.js (a simple module.export = { question: 'my question', answer: 'my answer'} does the trick, but there is many other way since the currenc code undestands : arrays, functions)
 5. reference my_command.js in index.js
 6. reference your folder (if you have created it) in components/index.js
 7. start the app (should be ok)

In case of error from your component, edition-bot will tell ya
```
