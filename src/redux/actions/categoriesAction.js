import { ADD_CATEGORIES, GET_CATEGORIES } from './actions';

import { openDatabase } from 'react-native-sqlite-storage';
const db = openDatabase({ name: 'fiance.db' });

const createCATEGORY = () => {
    db.transaction(function (txn) {
        txn.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='CATEGORY'",
            [],
            function (tx, res) {
                if (res.rows.length == 0) {
                    txn.executeSql(
                        'DROP TABLE IF EXISTS CATEGORY',
                        []
                    );
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS CATEGORY( id INTEGER PRIMARY KEY AUTOINCREMENT, name text NOT NULL UNIQUE, type text NOT NULL);',
                        []
                    );
                    txn.executeSql(
                        'INSERT INTO CATEGORY(name, type) VALUES (?, ?), (?, ?), (?, ?), (?, ?), (?, ?), (?, ?), (?, ?);',
                        [
                            'Giáo dục', 'expense',
                            'Hóa đơn', 'expense',
                            'Sức khỏe', 'expense',
                            'Ăn uống', 'expense',
                            'Mua sắm', 'expense',
                            'Di chuyển', 'expense',
                            'Giải trí', 'expense'
                        ]
                    );
                    txn.executeSql(
                        'INSERT INTO CATEGORY(name, type) VALUES (?, ?), (?, ?), (?, ?);',
                        [
                            'Tiền lương', 'income',
                            'Tiền thưởng', 'income',
                            'Cổ tức', 'income'
                        ]
                    );
                }
            }
        );
    });
}

export const getCategories = () => {
    createCATEGORY();

    return dispatch => {
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT * FROM CATEGORY",
                [],
                function (tx, res) {
                    let temp = []
                    for (let i = 0; i < res.rows.length; i++) {
                        temp.push(res.rows.item(i))
                    }

                    dispatch({
                        type: GET_CATEGORIES,
                        payload: temp
                    })
                }
            );
        });
    }
}

export const addCategory = ({ navigation }, category) => dispatch => {
    db.transaction(function (txn) {
        txn.executeSql(
            'INSERT INTO CATEGORY(name, type) VALUES (?,?)',
            [category.name, category.type],
            (tx, results) => {
                console.log('Results', results.rowsAffected);
                txn.executeSql(
                    'SELECT * FROM CATEGORY WHERE name=?',
                    [category.name],
                    (txn, res) => {
                        let temp = res.rows.item(0);
                        dispatch({
                            type: ADD_CATEGORIES,
                            payload: temp
                        })
                    }
                )
            }
        );
    }, (err) => { console.log('fail', err) }, () => { console.log('success') });
}