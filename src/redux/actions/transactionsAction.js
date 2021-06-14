import 'react-native-gesture-handler';
import {
  ADD_TRANSACTION,
  GET_TRANSACTIONS,
  DELETE_TRANSACTION,
  UPDATE_TRANSACTION,
} from './actions';
import {
  Alert
} from 'react-native';

import { openDatabase } from 'react-native-sqlite-storage';
import { getAccount } from './accountAction';

const db = openDatabase({ name: 'fiance.db' });
const { DateTime } = require('luxon')

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

          // txn.executeSql(
          //   'INSERT INTO TRANSACTIONS(category_id, amount, description, date) VALUES(?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?);',
          //   [
          //     1, 5182000, 'Học phí', '2021-05-21',
          //     3, 160000, 'Mua thuốc nhỏ mắt', '2021-08-19',
          //     2, 50000, 'Trà sữa', '2021-08-19',
          //     9, 500000, 'Thưởng', '2021-10-15',
          //     10, 300000, 'Lãi', '2021-10-16',
          //     9, 10000, 'Thưởng gì đó', '2021-10-25',
          //     8, 1200000, 'Lương tháng', '2021-10-15',
          //     4, 22000, 'Tiền cơm', '2021-10-16',
          //     6, 50000, 'Về nhà', '2021-08-19',
          //     10, 200000, 'Lãi gì đó', '2021-10-25'
          //   ]
          // );
        }
      }
    )
  })
}

const goPreviousScreen = (navigation) => {
  navigation.goBack()
}

const convertData = (data) => (
  data.reduce((re, o) => {
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
)

export const getTransactions = () => {

  createTRANSACTIONS();

  return dispatch => {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT TRANSACTIONS.id, name, description, date, type, amount FROM TRANSACTIONS JOIN CATEGORY ON CATEGORY.id = TRANSACTIONS.category_id;",
        [],
        function (tx, res) {
          let transacItem = convertData(res.rows.raw())

          transacItem.sort((a, b) =>
            DateTime.fromFormat(a.date, 'yyyy-MM-dd').toMillis() <
            DateTime.fromFormat(b.date, 'yyyy-MM-dd').toMillis() && 1 || -1
          )

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
        'INSERT INTO TRANSACTIONS(category_id, amount, description, date) VALUES((SELECT id FROM CATEGORY WHERE name=?), ?, ?, ?);',
        [
          transaction.name,
          (transaction.type == 'income') ? transaction.amount : -transaction.amount,
          transaction.description,
          transaction.date,
        ],
        (tx, res) => {
          if (res.rowsAffected === 1) {
            txn.executeSql(
              'SELECT TRANSACTIONS.id, name, description, date, type, amount FROM TRANSACTIONS JOIN CATEGORY ON CATEGORY.id = TRANSACTIONS.category_id WHERE category_id=(SELECT id FROM CATEGORY WHERE name=?) and amount=? and description=? and date=?;',
              [
                transaction.name,
                transaction.amount,
                transaction.description,
                transaction.date,
              ],
              (tx, res) => {
                let temp = res.rows.item(0);

                Alert.alert(
                  'Thành công',
                  'Thêm giao dịch mới thành công',
                  [
                    { text: 'OK', onPress: () => goPreviousScreen(navigation) },
                  ],
                  { cancelable: false }
                )

                dispatch(getAccount())

                dispatch({
                  type: ADD_TRANSACTION,
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
        (err) => console.error(err.message)
      );
    }, (err) => { console.error(err.message) });
  }
}

export const deleteTransaction = (dataId, dataDate, navigation) => {
  return dispatch => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM TRANSACTIONS WHERE id=?',
        [dataId],
        (txn, result) => {
          if (result.rowsAffected === 1) {
            Alert.alert(
              'Thành công',
              'Xóa giao dịch thành công',
              [
                { text: 'OK', onPress: () => goPreviousScreen(navigation) },
              ],
              { cancelable: false }
            )

            dispatch(getAccount())

            dispatch({
              type: DELETE_TRANSACTION,
              payload: {
                id: dataId,
                date: dataDate
              }
            })
          } else {
            Alert.alert(
              'Thất bại',
              'Đã có vấn đề xảy ra. Xin hãy thử lại!',
            )
          }
        },
        (err) => console.error(err.message)
      )
    }, (err) => { console.error(err.message) })
  }
}

export const updateTransaction = (data, oldDate, navigation) => {
  return dispatch => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE TRANSACTIONS SET category_id=(SELECT id FROM CATEGORY WHERE name=?), description=?, date=?, amount=? WHERE id=?',
        [
          data.name,
          data.description,
          data.date,
          data.amount,
          data.id
        ],
        (txn, result) => {
          if (result.rowsAffected === 1) {
            Alert.alert(
              'Thành công',
              'Chỉnh sửa giao dịch thành công',
              [
                { text: 'OK', onPress: () => goPreviousScreen(navigation) },
              ],
              { cancelable: false }
            )

            dispatch(getAccount())

            dispatch({
              type: UPDATE_TRANSACTION,
              payload: {
                ...data,
                old_date: oldDate
              }
            })
          } else {
            Alert.alert(
              'Thất bại',
              'Đã có vấn đề xảy ra. Xin hãy thử lại!',
            )
          }
        }, (err) => console.error(err.message)
      )
    }, (err) => console.error(err.message))
  }
}