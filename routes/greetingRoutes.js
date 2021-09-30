module.exports = function routesGreeting(greeting) {
    var regex = /[0-9`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/`]/;

    async function index(req, res) {
        res.render("index", {
            display1: greeting.getGreetings(),
            count: await greeting.getCount(),
        });
        console.log("greeting: " + greeting.getGreetings());
        
    }

    async function greet(req, res) {
        try {

            console.log(req.body.user)
            const name = req.body.user;
            const lang = req.body.langRadioBtn;

            if (name === "" && !lang) {
                req.flash('error', 'Please enter name and choose language');
            }

            else if (name === null || name == Number(name)) {
                req.flash('error', 'Please enter a valid name');
            }

            else if (!lang) {
                req.flash('error', 'Please choose a language');
            }

            await greeting.greetings(req.body.user, req.body.langRadioBtn);
            
            
            res.redirect("/");

        } catch (error) {
            console.log(error);
        }
       
    }

    async function reset(req, res) {
        console.log("reset: " + req.body.resetButton);

        try {
            const reset = req.body.resetButton;
            if (reset) {
                req.flash('msg', 'You have resetted successfully');
            }
            await greeting.deleteUsers();
             greeting.clearGreetingArea();
            //  greeting.resetMessage()
             res.redirect("/");

        } catch (error) {
            console.log(error)
        }
    }

    async function listOfNames(req, res) {
        res.render("nameList", {
            displayNames: await greeting.all(),
        });

        console.log('hectic: ' + JSON.stringify(await greeting.all()));
    }

    async function numberUserHasBeenGreeted(req, res) {
        const username = req.params.user;
        console.log('name link :' + username);
        const namesList = await greeting.howManyTimesGreeted(username);
        console.log('name list :' + JSON.stringify(namesList));

        res.render("nameAndTimesGreeted", {
            userName: username,
            personsCounter: namesList,
            personsCounterFor1: namesList.count == 1,
        });
    };

    return {
        index,
        greet,
        reset,
        listOfNames,
        numberUserHasBeenGreeted
    }
}