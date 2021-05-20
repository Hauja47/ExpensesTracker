import { ADD_TRANSACTIONS, GET_TRANSACTIONS } from './actions';

import {
    Alert
} from 'react-native';

import { openDatabase } from 'react-native-sqlite-storage';

const { DateTime } = require("luxon");
const db = openDatabase({ name: 'fiance.db' });

function convertDate(date) {
    const converDate = DateTime.fromSeconds(Number(date))
    return converDate.toISODate();
}

const createTRANSACTIONS = () => {
    db.transaction((txn) => {
        txn.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='TRANSACTIONS'",
            [],
            function (tx, res) {
                // console.log('TRANSACTIONS\'s is:', res.rows.length);
                if (res.rows.length == 0) {
                    txn.executeSql(
                        'DROP TABLE IF EXISTS TRANSACTIONS',
                        [],
                        () => { },
                        (err) => { console.log(err.message) }
                    );

                    txn.executeSql(
                        'CREATE TABLE TRANSACTIONS ( id INTEGER PRIMARY KEY AUTOINCREMENT, category_id INTERGER NOT NULL, description TEXT NOT NULL, date_id INTERGER NOT NULL, amount INTERGER NOT NULL, FOREIGN KEY (category_id) REFERENCES CATEGORY(id), FOREIGN KEY (date_id) REFERENCES TRANSACDATE(id));',
                        []
                    );

                    txn.executeSql(
                        'INSERT INTO TRANSACTIONS(category_id, amount, description, date_id) VALUES(?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?);',
                        [
                            1, -5182000, 'Học phí', 1,
                            3, -160000, 'Mua thuốc nhỏ mắt', 2,
                            2, -50000, 'Trà sữa', 2,
                            9, 500000, 'Thưởng', 3,
                            10, 300000, 'Lãi', 4,
                            9, 10000, 'Thưởng gì đó', 5,
                            8, 1200000, 'Lương tháng', 3,
                            4, -22000, 'Tiền cơm', 4,
                            6, -50000, 'Về nhà', 2,
                            10, 200000, 'Lãi gì đó', 5
                        ]
                    );
                }
            }
        )
    })
}

export const getTransactions = () => {
    createTRANSACTIONS();

    return dispatch => {
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT TRANSACTIONS.id, name, description, date, type, amount FROM (TRANSACTIONS JOIN CATEGORY ON CATEGORY.id = TRANSACTIONS.category_id) JOIN TRANSACDATE ON TRANSACTIONS.date_id = TRANSACDATE.id;",
                [],
                function (tx, res) {
                    console.log('TRANSACTIONS\'s item:', res.rows.length);
                    let result = []
                    for (let i = 0; i < res.rows.length; i++) {
                        result.push(res.rows.item(i))
                    }
                    console.log(result);

                    let transacItem = result.reduce((re, o) => {
                        let existObj = re.find(
                            obj => obj.date == o.date
                        )

                        if (existObj) {
                            existObj.data.push(o)
                        } else {
                            re.push({
                                date: o.date,
                                data: [o]
                            })
                        }
                        return re
                    }, [])

                    dispatch({
                        type: GET_TRANSACTIONS,
                        payload: transacItem
                    })
                }
            );
        }, (err) => { console.log(err.message) });
    }
}