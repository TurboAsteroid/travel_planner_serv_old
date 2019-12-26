// let DataBase = require('../routes/db');
//
// const mysql = require('mysql2/promise');
// const config = require('../config');

module.exports = {
    getAllStatuses : function () {
        return {
            "incidents": {
                title: 'Статусы инцидента',
                statuses: {
                    "green": {
                        text: 'Обработан',
                        key: 1
                    },
                    "red": {
                        text: 'Не обработан',
                        key: 0
                    }
                }
            },
            "groups": {
                title: 'Статусы группы',
                statuses: {
                    "green": {
                        text: 'Обработано',
                        key: 1
                    },
                    "red": {
                        text: 'Не обработано',
                        key: 0
                    }
                }
            },
            "notifications": {
                title: 'Статусы уведомлений',
                statuses: {
                    "gray": {text: 'Не отправлено'},
                    "orange": {text: 'Отправлено'},
                    "red": {text: 'Получено'},
                    "green": {text: 'Прочитано'}
                }
            }
        };
    }
};

