import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  ScrollView
} from 'react-native'
import { Constants, SQLite } from 'expo'
import { List, ListItem, FormInput } from 'react-native-elements'


const db = SQLite.openDatabase('todo.db')


export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      input: '',
      list: []
    }
    this.update = this.update.bind(this)
    this.addTodo = this.addTodo.bind(this)
    this.deleteTodo = this.deleteTodo.bind(this)
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
    if(this.state.input == ""){
      return
    }
    db.transaction(
      tx => {
        tx.executeSql('insert into todos (value) values (?)',
          [this.state.input],
          () => {
            this.setState({ input: '' })
            this.update()
          }
        )
      }
    )
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

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.statusBar} />
        <View style={styles.inputView}>
          <FormInput
            inputStyle={{ textAlign: 'center' }}
            placeholder='ماذا تريد ان تفعل اليوم!'
            value={this.state.input}
            onChangeText={input => this.setState({ input })}
            onSubmitEditing={() => this.addTodo()}
          />
        </View>
        <ScrollView style={styles.list}>
          <List>
            {
              this.state.list.map(item => (
                <ListItem
                  key={item.id}
                  title={item.value}
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
