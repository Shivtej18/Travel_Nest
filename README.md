# Travel_Nest

#Authontication:
    -Used passport, which is authentication middleware for Node.js. 
    -Install npm package. npm i passport.
    -Firstly using it on my local server, therefore use local-strategy.
        install local liabrary => npm install passport-local
    -While using mongoose , we need passport-local-mongoose liabrary.
        For sql or other db above two are sufficient.
        npm install passport-local-mongoose

    -Setup User schema
        require passport
    -Use plugins
        To enhance Mongoose schema (i.e. User) with all the methods and properties that passport-local-mongoose provides. 
        Exaple:-
            - Adds fields like username, hash, and salt to your schema
            - Adds helper methods like Registering users (User.register())
              Authenticating users (User.authenticate())
              Serializing/deserializing users for sessions

        Why It's Useful ?
            Without this plugin, you'd have to manually:
            - Hash and salt passwords
            - Store them securely
            - Write custom logic for login and session handling
            With it, you get all that for free, and it's tightly integrated with Passport.js.
    -Export from models.
    -require in app.js to use passport.
    -Make sure that we have already used session code snippet. Because sessionId will be same  throughout single session, eventhough we change tab on browser.
    -Use passport.initialize middleware. (initializes Passport in your Express app.) 
    -Use passport.session middleware. (This enables session support for Passport.)
    -Make sure you’ve configured express-session before passport.session, or it won’t work properly.
    -passport.serializeUser(UserActivation.serializeUser());  =>When session starts then user don't need to login again and again.
    -passport.deserializeUser(UserActivation.deserializeUser()); => - This is called on every request after login, to retrieve the full user object from the sessionId.




 
    

