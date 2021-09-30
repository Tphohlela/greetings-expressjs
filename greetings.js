module.exports = function greetings(pool) {
    var greet;
    var regex = /[0-9`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/`]/;

    async function add(name) {
        try {
            var checkName = await pool.query(`select name from users where name = $1`, [name])
            if (checkName.rowCount == 0) {
                await pool.query(`insert into users (name,count) values ($1,$2)`, [name, 1])
            }
            else {
                await pool.query(`update users set count = count + 1 where name = $1`, [name])
            }

        } catch (error) {
            console.log(error);
        }
    }

    async function all() {
        try {
            let categories = await pool.query('SELECT * from users');
            return categories.rows;

        } catch (error) {
            console.log(error);
        }
    }

    async function greetings(name, langValue) {      
     try {
        if (name.match(regex) || name == "") {
            greet = null;
            return null;
        }
        else {
            var name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

            await add(name);
            if (langValue === "English") {
                greet = 'Hello, ' + name;

            } else if (langValue === "Afrikaans") {
                greet = 'Hallo, ' + name;

            } else if (langValue === "isiXhosa") {
                greet = 'Molo, ' + name;
            }
        }
     } catch (error) {
         console.log(error);
     }
    }

    function getGreetings() {
        return greet;
    }

    async function getCount() {
        try {
            let categories = await pool.query('SELECT * from users');
            return categories.rowCount;

        } catch (error) {
            console.log(error);
        }
    }

    async function deleteUsers() {
        try {
            await pool.query('DELETE FROM users');

        } catch (error) {
            console.log(error);
        }
    }

    async function clearGreetingArea() {
        try {
            greet = null;
        } catch (error) {
            console.log(error);
        }
    }

    async function howManyTimesGreeted(name) {
        try {
            var result = await pool.query(`select count from users where name = $1`, [name]);
            if (result.rowCount > 0) {
                return result.rows[0];
            }
            return null;
        } catch (error) {
            console.log(error)
        }
    }

    return {
        greetings,
        getGreetings,
        getCount,
        add,
        all,
        deleteUsers,
        clearGreetingArea,
        howManyTimesGreeted,
    }
}