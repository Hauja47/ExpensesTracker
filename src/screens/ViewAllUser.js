import React, { useState, useEffect } from 'react';
import {
  FlatList,
  Text,
  View,
  SafeAreaView,
  StyleSheet
} from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';

const { DateTime } = require("luxon");

var db = openDatabase({ name: 'fiance.db' });

const ViewAllUser = () => {
  let [flatListItems, setFlatListItems] = useState([]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT TRANSACTIONS.id, name, description, date, amount FROM (TRANSACTIONS JOIN CATEGORY ON CATEGORY.id = TRANSACTIONS.category_id) JOIN TRANSACDATE ON TRANSACTIONS.date_id = TRANSACDATE.id;',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          setFlatListItems(temp);
        }
      );
    });
  }, []);

  let listViewItemSeparator = () => {
    return (
      <View
        style={{
          height: 0.2,
          width: '100%',
          backgroundColor: '#808080'
        }}
      />
    );
  };

  const convertDate = (date) => {
    const converDate = DateTime.fromSeconds(Number(date))
    return converDate.toISODate();
  }

  let listItemView = (item) => {
    return (
      <View
        key={item.user_id}
        style={{ backgroundColor: 'white', padding: 20 }}>
        <Text>Id: {item.id}</Text>
        <Text>Category: {item.name}</Text>
        <Text>Date: {convertDate(item.date)}</Text>
        <Text>Amount: {item.amount}</Text>
        <Text>Description: {item.description}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ flex: 1 }}>
          <FlatList
            data={flatListItems}
            ItemSeparatorComponent={listViewItemSeparator}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => listItemView(item)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ViewAllUser;