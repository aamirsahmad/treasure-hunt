# treasure-hunt
Universal Treasure Hunt webapp that uses NodeJS, ExpressJS and MongoDB for CSHUB's treasure hunt

![alt text](http://i.imgur.com/gsKdcJT.png "Treasure Hunt Landing Page")

## Installation

### Installing locally ###
----------
    1. git clone https://github.com/aamirsahmad/treasure-hunt.git
    2. cd treasure-hunt
    3. npm install
    4. Setup MongoDB
    5. Create '.env.primary' and put MongoDB & Google OAuth keys
    6. node app.js
    7. http://localhost:3000

### Deploying on Heroku ###
----------
    After following step 1 to 4 from above
    1. Create and configure "ProcFile"
    2. Setup and configure MongoDB in '.env.primary' or use the NODE.ENV variables in Heroku portal 
    3. Use git to push to heroku master 

## To Do

- Admin panel
- Catagories for challenges
- Add more challenges and levels
- Relative scoring
- Improve score representation (graphs)

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request

## License

MIT License

Copyright (c) 2017 Aamir Ahmad

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.