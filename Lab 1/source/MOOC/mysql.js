const assert = require('assert');
const bodyParser = require("body-parser");
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var mysql = require('mysql');
var sensitive = {
    "host": "127.0.0.1",
    "user": "root",
    "password": "admin123!",
    "database": "mooc"
};

app.get('/getOrders', function (req, res) {
    var connection = mysql.createConnection({
        host: sensitive.host,
        user: sensitive.user,
        password: sensitive.password,
        database: sensitive.database
    })

    connection.connect(function(err) {
        if (err) throw err

        connection.query('select * from course where CourseStatus = \'enrolled\'', function (error, result, fields) {
            if (error) {
                res.write("get Failed");
                res.end();

            } else {
                let orders = [];
                orders.push(result);

                connection.query('select * from course where CourseStatus = \'completed\'', function (error, compResult, fields) {
                    if (error) {
                        res.write("get Failed");
                        res.end();

                    } else {
                        orders.push(compResult);
                        res.send(JSON.stringify(orders));
                    }

                    connection.end()
                })
            }
        })
    })
});

app.get('/getSubjects', function (req, res) {
    var connection = mysql.createConnection({
        host: sensitive.host,
        user: sensitive.user,
        password: sensitive.password,
        database: sensitive.database
    })

    connection.connect(function(err) {
        if (err) throw err

        connection.query('select * from subject order by Name', function (error, result, fields) {
            if (error) {
                res.write("get Failed");
                res.end();

            } else {
                res.send(JSON.stringify(result));
            }

            connection.end()
        })
    })
});

app.get('/getSubject/:id', function (req, res) {
    var connection = mysql.createConnection({
        host: sensitive.host,
        user: sensitive.user,
        password: sensitive.password,
        database: sensitive.database
    })

    connection.connect(function(err) {
        if (err) throw err

        let sql = 'select * from focus where SubjectID=? order by Name';

        connection.query(sql, [req.params.id], function (error, result) {
            if (error) {
                res.write("get Failed");
                res.end();

            } else {
                res.send(JSON.stringify(result));
            }

            connection.end()
        })
    })
});

app.get('/getFocus/:id', function (req, res) {
    var connection = mysql.createConnection({
        host: sensitive.host,
        user: sensitive.user,
        password: sensitive.password,
        database: sensitive.database
    })

    connection.connect(function(err) {
        if (err) throw err

        let sql = 'select * from course where FocusID=? order by Name';

        connection.query(sql, [req.params.id], function (error, result) {
            if (error) {
                res.write("get Failed");
                res.end();

            } else {
                res.send(JSON.stringify(result));
            }

            connection.end()
        })
    })
});

app.get('/getCourse/:id', function (req, res) {
    var connection = mysql.createConnection({
        host: sensitive.host,
        user: sensitive.user,
        password: sensitive.password,
        database: sensitive.database
    })

    connection.connect(function(err) {
        if (err) throw err

        let sql = 'select * from course where CourseID=?';

        connection.query(sql, [req.params.id], function (error, result) {
            if (error) {
                res.write("get Failed");
                res.end();

            } else {

                sql = "select C.Name, C.Description, C.CourseStatus, C.CourseID, C.FocusID from pre_requisite as P " +
                    "join course as C on P.PreReqCourseID=C.CourseID where P.CourseID=?"
                connection.query(sql, [req.params.id], function (error, reqResult) {
                    if (error) {
                        res.write("get Failed");
                        res.end();

                    } else {
                        result[0].preReqs = reqResult;
                        let canEnroll = true;
                        reqResult.forEach(function (item) {
                            if (item.CourseStatus !== "completed") {
                                canEnroll = false;
                            }
                        })
                        result[0].CanEnroll = canEnroll;
                        res.send(JSON.stringify(result[0]));
                    }

                    connection.end()
                })
            }
        })
    })
});

app.post('/enroll/:id', function (req, res) {
    var connection = mysql.createConnection({
        host: sensitive.host,
        user: sensitive.user,
        password: sensitive.password,
        database: sensitive.database
    })

    connection.connect(function(err) {
        if (err) throw err

        let sql = "UPDATE course SET CourseStatus='enrolled' WHERE CourseID=?";

        connection.query(sql, [req.params.id], function (error, result) {
            if (error) {
                res.write("enrollment Failed");
                res.end();

            } else {
                res.send(JSON.stringify(result));
            }

            connection.end()
        })
    })
});

app.post('/drop/:id', function (req, res) {
    var connection = mysql.createConnection({
        host: sensitive.host,
        user: sensitive.user,
        password: sensitive.password,
        database: sensitive.database
    })

    connection.connect(function(err) {
        if (err) throw err

        let sql = "UPDATE course SET CourseStatus='none' WHERE CourseID=?";

        connection.query(sql, [req.params.id], function (error, result) {
            if (error) {
                res.write("enrollment Failed");
                res.end();

            } else {
                res.send(JSON.stringify(result));
            }

            connection.end()
        })
    })
});

const server = app.listen(8081, function () {
    const host = server.address().address;
    const port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port)
});