let mysql2 = require("mysql2")
const env = require("./config/env")

let conn = mysql2.createConnection({
    host: env.host,
    user: env.user,
    password: env.password
})

conn.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");

    conn.query("DROP DATABASE IF EXISTS " + env.testDatabase, function (err, result) {
        if (err) throw err;
        console.log("Database dropped");
    });

    conn.query("CREATE DATABASE " + env.testDatabase, function (err, result) {
        if (err) throw err;
        console.log("Database " + env.testDatabase +  " created");
        conn = mysql2.createConnection({
            host: env.host,
            user: env.user,
            password: env.password,
            database: env.testDatabase
        })

        conn.query("CREATE TABLE `user` (\n" +
            "        `id` int NOT NULL AUTO_INCREMENT,\n" +
            "        `name` varchar(255) NOT NULL,\n" +
            "        `email` varchar(255) NOT NULL,\n" +
            "        `password` varchar(255) NOT NULL,\n" +
            "        `phone` varchar(255) DEFAULT NULL,\n" +
            "        PRIMARY KEY (`id`),\n" +
            "        UNIQUE KEY `email` (`email`),\n" +
            "        UNIQUE KEY `phone` (`phone`)\n" +
            ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;", function (err, result) {
            if (err) throw err;
            console.log("User created");
        });

        conn.query("CREATE TABLE `item` (\n" +
            "  `id` int NOT NULL AUTO_INCREMENT,\n" +
            "  `title` varchar(255) NOT NULL,\n" +
            "  `price` int NOT NULL,\n" +
            "  `image` varchar(255) DEFAULT NULL,\n" +
            "  `created_at` int NOT NULL,\n" +
            "  `userId` int NOT NULL,\n" +
            "  PRIMARY KEY (`id`),\n" +
            "  KEY `userId` (`userId`),\n" +
            "  CONSTRAINT `item_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE\n" +
            ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;", function (err, result) {
            if (err) throw err;
            console.log("Item created");
        });

        conn.query("CREATE TABLE `session` (\n" +
            "  `token` varchar(255) NOT NULL,\n" +
            "  `userId` int NOT NULL,\n" +
            "  PRIMARY KEY (`token`),\n" +
            "  UNIQUE KEY `token` (`token`),\n" +
            "  KEY `userId` (`userId`),\n" +
            "  CONSTRAINT `session_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE\n" +
            ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;", function (err, result) {
            if (err) throw err;
            console.log("Session created");
        });

        conn.query("INSERT INTO `" + env.testDatabase + "`.`user`\n" +
            "        (`name`,\n" +
            "            `email`,\n" +
            "            `password`,\n" +
            "            `phone`)\n" +
            "        VALUES\n" +
            "        ('test',\n" +
            "            'test@mail.com',\n" +
            "            '12345678',\n" +
            "            380509041987);", function (err, result) {
            if (err) throw err;
            console.log("User inserted");
        });

        conn.query("INSERT INTO `" + env.testDatabase + "`.`user`\n" +
            "        (`name`,\n" +
            "            `email`,\n" +
            "            `password`,\n" +
            "            `phone`)\n" +
            "        VALUES\n" +
            "        ('test',\n" +
            "            'test2@mail.com',\n" +
            "            '12345678',\n" +
            "            380509041917);", function (err, result) {
            if (err) throw err;
            console.log("User inserted");
        });

        conn.query("INSERT INTO `" + env.testDatabase + "`.`session`\n" +
            "(`token`,\n" +
            "`userId`)\n" +
            "VALUES\n" +
            "('test_token',\n" +
            "1);", function (err, result) {
            if (err) throw err;
            console.log("Session inserted");
        });

        conn.query("INSERT INTO `" + env.testDatabase + "`.`item`\n" +
            "(`title`,\n" +
            "    `price`,\n" +
            "    `created_at`,\n" +
            "    `userId`)\n" +
            "VALUES(\n" +
            "    'test title',\n" +
            "    222,\n" +
            (new Date().getTime() / 1000) + ",\n" +
            "1);", function (err, result) {
            if (err) throw err;
            console.log("Item inserted");
        });

        conn.query("INSERT INTO `" + env.testDatabase + "`.`item`\n" +
            "(`title`,\n" +
            "    `price`,\n" +
            "    `created_at`,\n" +
            "    `userId`)\n" +
            "VALUES(\n" +
            "    'test title 23',\n" +
            "    222,\n" +
            (new Date().getTime() / 1000) + ",\n" +
            "1);", function (err, result) {
            if (err) throw err;
            console.log("Item inserted");
        });

        conn.query("INSERT INTO `" + env.testDatabase + "`.`item`\n" +
            "(`title`,\n" +
            "    `price`,\n" +
            "    `created_at`,\n" +
            "    `userId`)\n" +
            "VALUES(\n" +
            "    'test title 2',\n" +
            "    222,\n" +
            (new Date().getTime() / 1000) + ",\n" +
            "2);", function (err, result) {
            if (err) throw err;
            console.log("Item inserted");
            process.exit(1)
        });

    });

});

