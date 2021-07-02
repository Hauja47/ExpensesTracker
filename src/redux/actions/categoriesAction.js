import 'react-native-gesture-handler';
import { ADD_CATEGORIES, GET_CATEGORIES, UPDATE_CATEGORIES } from './actions';
import {
  Alert,
  ToastAndroid
} from 'react-native'

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
            'CREATE TABLE IF NOT EXISTS CATEGORY( id INTEGER PRIMARY KEY AUTOINCREMENT, name text NOT NULL, type text NOT NULL);',
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
  }, (err) => { console.log(err.message) });
}

export const getCategories = () => {
  createCATEGORY();

  return dispatch => {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT * FROM CATEGORY",
        [],
        function (tx, res) {
          let temp = res.rows.raw()

          dispatch({
            type: GET_CATEGORIES,
            payload: temp
          })
        }
      );
    });
  }
}

export const addCategory = (navigation, category) => {
  return dispatch => {
    db.transaction(function (txn) {
      txn.executeSql(
        'INSERT INTO CATEGORY(name, type) VALUES (?,?)',
        [category.name, category.type],
        (tx, results) => {
          if (results.rowsAffected === 1) {
            txn.executeSql(
              'SELECT * FROM CATEGORY WHERE name=? and type=?',
              [category.name, category.type],
              (tx, res) => {
                let temp = res.rows.item(0);

                Alert.alert(
                  'Thành công',
                  'Thêm danh mục mới thành công',
                  [
                    { text: 'OK', onPress: () => { navigation.goBack() } },
                  ],
                  { cancelable: false }
                )

                dispatch({
                  type: ADD_CATEGORIES,
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
        }
      );
    }, (err) => { console.error('fail', err) }, () => { console.log('success') });
  }
}

export const updateCategory = (navigation, category) => {
  return dispatch => {
    db.transaction((txn) => {
      txn.executeSql(
        'UPDATE CATEGORY SET name=?, type=? WHERE id=?;',
        [category.name, category.type, category.id],
        (tx, results) => {
          if (results.rowsAffected === 1) {
            txn.executeSql(
              'SELECT * FROM CATEGORY WHERE id=?',
              [category.id],
              (tx, res) => {
                let temp = res.rows.item(0);

                Alert.alert(
                  'Thành công',
                  'Chỉnh sửa danh mục thành công',
                  [
                    { text: 'OK', onPress: () => { navigation.goBack() } },
                  ],
                  { cancelable: false }
                )

                ToastAndroid.show(
                  'Thay đổi có hiệu lực sau khi khởi động lại ứng dụng',
                  ToastAndroid.SHORT,
                )

                dispatch({
                  type: UPDATE_CATEGORIES,
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
        }
      );
    }, (err) => { console.error('fail', err) }, () => { console.log('success') });
  }
}

export const deleteCategory = (id) => {
  return dispatch => {
    db.transaction((txn) => {
      txn.executeSql(
        'DELETE FROM CATEGORY WHERE id=?;',
        [id],
        (tx, results) => {
          if (results.rowsAffected === 1) {

            dispatch({
              type: UPDATE_CATEGORIES,
              payload: id
            })
          } else {
            Alert.alert(
              'Thất bại',
              'Đã có vấn đề xảy ra. Xin hãy thử lại!',
            )
          }
        }
      );
    }, (err) => { console.error('fail', err) }, () => { console.log('success') });
  }
}