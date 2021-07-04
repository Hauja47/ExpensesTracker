import 'react-native-gesture-handler';
import { GET_ACCOUNT, UPDATE_ACCOUNT } from './actions';

import { openDatabase } from 'react-native-sqlite-storage';
const db = openDatabase({ name: 'fiance.db' });

const createACCOUNT = () => {
    db.transaction(txn => {
        txn.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='ACCOUNT'",
            [],
            (tx, res) => {
                if (res.rows.length == 0) {
                    txn.executeSql(
                        'DROP TABLE IF EXISTS ACCOUNT',
                        []
                    );
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS ACCOUNT( id INTEGER PRIMARY KEY AUTOINCREMENT, amount INTEGER NOT NULL DEFAULT 0);',
                        []
                    );
                    txn.executeSql(
                        'INSERT INTO ACCOUNT(amount) VALUES (?);',
                        [0]
                    );
                    txn.executeSql(
                        'CREATE TRIGGER add_transaction AFTER INSERT ON TRANSACTIONS BEGIN UPDATE ACCOUNT SET amount=amount+new.amount WHERE id=1;END;',
                        []
                    )
                    txn.executeSql(
                        'CREATE TRIGGER delete_transaction AFTER DELETE ON TRANSACTIONS BEGIN UPDATE ACCOUNT SET amount=amount-old.amount WHERE id=1;END;',
                        []
                    )
                    txn.executeSql(
                        'CREATE TRIGGER update_transaction AFTER UPDATE ON TRANSACTIONS BEGIN UPDATE ACCOUNT SET amount=amount-old.amount+new.amount WHERE id=1; END;',
                        []
                    )
                }
            }
        );
    }, err => console.error(err.message));
}

export const getAccount = () => {
    createACCOUNT();
    
    return dispatch => {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM ACCOUNT',
                [],
                (txn, result) => {
                    let temp = result.rows.item(0);

                    dispatch({
                        type: GET_ACCOUNT,
                        payload: temp
                    })
                }
            )
        }, err => console.error(err.message))
    }
}

export const updateAccount = (account) => {
    return dispatch => {
        db.transaction((tx) => {
            tx.executeSql(
                'UPDATE ACCOUNT SET amount=? WHERE id=?',
                [
                    account.amount,
                    account.id
                ],
                (txn, result) => {
                    dispatch({
                        type: UPDATE_ACCOUNT,
                        payload: account
                    })
                }
            )
        })
    }
}