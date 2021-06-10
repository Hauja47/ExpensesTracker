import 'react-native-gesture-handler';
import { ADD_TRANSACTIONS, GET_TRANSACTIONS } from './actions';
import {
  Alert
} from 'react-native';

import { openDatabase } from 'react-native-sqlite-storage';

const db = openDatabase({ name: 'fiance.db' });

const createTRANSACTIONS = () => {
  db.transaction((txn) => {
    txn.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='TRANSACTIONS'",
      [],
      (tx, res) => {
        // console.log('TRANSACTIONS\'s is:', res.rows.length);
        if (res.rows.length == 0) {
          txn.executeSql(
            'DROP TABLE IF EXISTS TRANSACTIONS',
            [],
            () => { },
            (err) => { console.log(err.message) }
          );

          txn.executeSql(
            'CREATE TABLE TRANSACTIONS ( id INTEGER PRIMARY KEY AUTOINCREMENT, category_id INTERGER NOT NULL, description TEXT NOT NULL, date text NOT NULL, amount INTERGER NOT NULL, FOREIGN KEY (category_id) REFERENCES CATEGORY(id) )',
            [],
            {},
            (err) => console.error(err)
          );

          txn.executeSql(
            'INSERT INTO TRANSACTIONS(category_id, amount, description, date) VALUES(?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?);',
            [
              1, 5182000, 'Học phí', '2021-05-21',
              3, 160000, 'Mua thuốc nhỏ mắt', '2021-08-19',
              2, 50000, 'Trà sữa', '2021-08-19',
              9, 500000, 'Thưởng', '2021-10-15',
              10, 300000, 'Lãi', '2021-10-16',
              9, 10000, 'Thưởng gì đó', '2021-10-25',
              8, 1200000, 'Lương tháng', '2021-10-15',
              4, 22000, 'Tiền cơm', '2021-10-16',
              6, 50000, 'Về nhà', '2021-08-19',
              10, 200000, 'Lãi gì đó', '2021-10-25'
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
        "SELECT TRANSACTIONS.id, name, description, date, type, amount FROM TRANSACTIONS JOIN CATEGORY ON CATEGORY.id = TRANSACTIONS.category_id;",
        [],
        function (tx, res) {
          let result = []
          for (let i = 0; i < res.rows.length; i++) {
            result.push(res.rows.item(i))
            // console.log(res.rows.item(i))
          }

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
    }, (err) => { console.err(err.message) });
  }
}

export const addTransaction = (transaction, navigation) => {

  return dispatch => {
    db.transaction((txn) => {
      txn.executeSql(
        'INSERT INTO TRANSACTIONS(category_id, amount, description, date) VALUES(?, ?, ?, ?);',
        [
          transaction.category_id,
          transaction.amount,
          transaction.description,
          transaction.date,
        ],
        (tx, res) => {
          if (res.rowsAffected === 1) {
            txn.executeSql(
              'SELECT TRANSACTIONS.id, name, description, date, type, amount FROM TRANSACTIONS JOIN CATEGORY ON CATEGORY.id = TRANSACTIONS.category_id WHERE category_id=? and amount=? and description=? and date=?;',
              [
                transaction.category_id,
                transaction.amount,
                transaction.description,
                transaction.date,
              ],
              (tx, res) => {
                let temp = res.rows.item(0);
                console.log('temp:', temp)

                Alert.alert(
                  'Thành công',
                  'Thêm giao dịch mới thành công',
                  [
                    { text: 'OK', onPress: () => { navigation.goBack() } },
                  ],
                  { cancelable: false }
                )

                dispatch({
                  type: ADD_TRANSACTIONS,
                  payload: temp
                })
              }
            )
          } else {
            Alert.alert(
              'Thất bại',
              'Đã có vấn đề xảy ra. Xin hãy thử lại!',
            )
          }
        },
        (err) => console.err(err.message)
      );
    }, (err) => { console.log(err.message) });
  }
}