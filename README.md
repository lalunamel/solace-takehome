# Cody's Solace Takehome

This app implements simple note taking functionality. You can list, view, edit, and delete notes.

## Design decisions

- I decided to shy away from explicit save interactions because I really enjoy autosave and think it's a step up from the old days. In this app, create and delete are fired off immediately. Update operations are debounced for 500 ms because an update is requested every time any note text changes.
- To keep things simple, I decided to display the index of notes, search, and single note view all in the same window.
- I chose not to use any fancy JS framework because I haven't had the chance to work with those yet, at least not at a level where I'd feel comfortable talking about them in an interview setting.
- In that vein, I used a very barebones express implementation on the backend. It doesn't even have a persistent database (notes will be lost if the server or process reboots). Obviously, given more time, I'd set up something more robust (e.g. a real database or some sort of external store), but given the nature of this project I figured my simple choice would suffice.

## Running Locally

(In separate terminal windows)
`npm run start-frontend`
`npm run start-backend`

## Deploying

This is out on fly.io.
The frontend is built into the `./build` folder and the backend serves that folder up as a bunch of static assets.

`npm run build`
`npm run start-production`