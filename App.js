import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  ScrollView
} from 'react-native'
import { Constants, SQLite } from 'expo'
import { List, ListItem, FormInput } from 'react-native-elements'
import update from 'immutability-helper';


const db = SQLite.openDatabase('todo.db')


export default class App extends React.Component {
  // todo item = {value: "", id: int}
  constructor(props) {
    super(props)
    this.state = {
      input: {},
      list: []
    }
    this.update = this.update.bind(this)
    this.addTodo = this.addTodo.bind(this)
    this.deleteTodo = this.deleteTodo.bind(this)
    this.updateInput = this.updateInput.bind(this)
    this.onTodoPress = this.onTodoPress.bind(this)
  }

  update() {
    db.transaction(tx => {
      tx.executeSql(
        `select * from todos;`,
        null,
        (_, { rows: { _array } }) => this.setState({ list: _array })
      )
    })
  }

  componentDidMount() {
    db.transaction(tx => {
      tx.executeSql(
        'create table if not exists todos (id integer primary key not null, value text);',
        null,
        this.update()
      )
    })
  }

  addTodo() {
    if (this.state.input.value) {
      db.transaction(
        tx => {
          tx.executeSql('insert or replace into todos (id, value) values (?, ?)',
            [this.state.input.id, this.state.input.value],
            () => {
              this.setState({ input: {} })
              this.update()
            }
          )
        }
      )
    }
  }

  deleteTodo(id) {
    db.transaction(
      tx => {
        tx.executeSql('delete from todos where id = ?;',
          [id],
          this.update()
        )
      }
    )
  }

  updateInput(value) {
    const newInput = update(this.state.input, {
      value: { $set: value }
    });
    this.setState({ input: newInput })
  }
  onTodoPress(item) {
    this.setState({ input: item })
    this.todoInput.focus()
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.statusBar} />
        <View style={styles.inputView}>
          <FormInput
            inputStyle={{ textAlign: 'center' }}
            placeholder='ماذا تريد ان تفعل اليوم!'
            value={this.state.input.value}
            onChangeText={value => this.updateInput(value)}
            onSubmitEditing={() => this.addTodo()}
            ref={input => {
              this.todoInput = input;
            }}
          />
        </View>
        <ScrollView style={styles.list}>
          <List>
            {
              this.state.list.map(item => (
                <ListItem
                  key={item.id}
                  title={item.value}
                  onPress={() => this.onTodoPress(item)}
                  titleNumberOfLines={100}
                  titleStyle={{ textAlign: 'right' }}
                  leftIcon={{ type: 'feather', name: 'trash' }}
                  leftIconOnPress={() => this.deleteTodo(item.id)}
                  rightIcon={<View />}
                />
              ))
            }
          </List>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  statusBar: {
    height: Constants.statusBarHeight,
  },
  inputView: {
    height: 40,
    padding: 5
  },
  list: {
    flex: 1
  }
})
