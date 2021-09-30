let assert = require("assert");
let greetings = require("../greetings");
const pg = require("pg");
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/greet_test';

const pool = new Pool({
    connectionString
});

describe('Test for Greeting factory function', function () {
    beforeEach(async function () {
        await pool.query("delete from users;");
    });
   
    describe('For errors', function () {
        it('should not greet numbers as name', async function () {
            let greeting = greetings(pool);

            await greeting.greetings("99");

            let error = await greeting.getGreetings();

            assert.equal(null, error);
        });

        it('should not greet empty string as name', async function () {
            let greeting = greetings(pool);

            await greeting.greetings("");

            let error = await greeting.getGreetings();

            assert.equal(null, error);
        });
    });

    describe('For storing names in database', function () {

        it('should be able to insert a name into a table and have 1 row', async function () {
            let greeting = greetings(pool);
            await greeting.add({
                name: "Ncebakazi"
            });
            let users = await greeting.all();
            assert.equal(1, users.length);
        });

        it('should be able to insert three names into a table and have 3 rows', async function () {
            let greeting = greetings(pool);
            await greeting.add({
                name: "Ncebakazi"
            });
            await greeting.add({
                name: "Thato"
            });
            await greeting.add({
                name: "Andiswa"
            });
            let users = await greeting.all();
            assert.equal(3, users.length);
        });

        it('should be able to not add duplicate name as another row', async function () {
            let greeting = greetings(pool);
            await greeting.add({
                name: "Thato"
            });

            await greeting.add({
                name: "Thato"
            });
            await greeting.add({
                name: "Andiswa"
            });
            let users = await greeting.all();
            assert.equal(2, users.length);
        });

        it('should take names spelt with different uppercase and lowercase letters as one name and add it as one row', async function () {
            let greeting = greetings(pool);

            await greeting.greetings("thaTo");
            await greeting.greetings("ThatO");

            let users = await greeting.all();
            assert.equal(1, users.length);
        });
    });

    describe('For Counter', function () {

        it('if one name is entered, count should be 1', async function () {
            let greeting = greetings(pool);

            await greeting.greetings("thaTo");

            let count = await greeting.getCount();

            assert.equal(1, count);
        });

        it('if three names are entered, count should be 3', async function () {
            let greeting = greetings(pool);

            await greeting.greetings("thaTo");
            await greeting.greetings('ncebakazi');
            await greeting.greetings('andiswa');


            let count = await greeting.getCount();

            assert.equal(3, count);
        });

        it('if a name is entered more than once, counter should not increase', async function () {
            let greeting = greetings(pool);


            await greeting.greetings("thaTo");
            await greeting.greetings('ncebakazi');
            await greeting.greetings('andiswa');
            await greeting.greetings('andiswa');

            let count = await greeting.getCount();

            assert.equal(3, count);
        });
    });

    describe('For reset ', function () {

        it('should delete database content', async function () {
            let greeting = greetings(pool);
            await greeting.add({
                name: "Ncebakazi"
            });
            await greeting.add({
                name: "Thato"
            });
            await greeting.add({
                name: "Andiswa"
            });
            await greeting.add({
                name: "Andiswa"
            });

            let deleteDB = await greeting.deleteUsers();

            assert.equal(null, deleteDB);
        });

        it('once database is cleared, counter should start at 0 again', async function () {
            let greeting = greetings(pool);
            await greeting.add({
                name: "Ncebakazi"
            });
            await greeting.add({
                name: "Thato"
            });
            await greeting.add({
                name: "Andiswa"
            });
            await greeting.add({
                name: "Andiswa"
            });

            await greeting.deleteUsers();
            let count = await greeting.getCount();

            assert.equal(0, count);
        });
    });

    describe('For checking how many times user has been greeted', function () {
        it('if name has been entered twice, count should say 2', async function () {
            let greeting = greetings(pool);

            await greeting.greetings("andiswa");
            await greeting.greetings("AnDisWa");

            let howManyTimes = await greeting.howManyTimesGreeted('Andiswa');

            assert.equal(2, howManyTimes.count);
        });

        it('if name has been entered four times, count should say 4', async function () {
            let greeting = greetings(pool);

            await greeting.greetings("andiswa");
            await greeting.greetings("AnDisWa");
            await greeting.greetings("andiswa");
            await greeting.greetings("AnDisWa");
      
           let howManyTimes = await greeting.howManyTimesGreeted('Andiswa')

            assert.equal(4, howManyTimes.count);
        });
    });
})