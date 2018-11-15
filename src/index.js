import React from 'react'
import {  connect } from 'react-redux'
import {
  StyleSheet,
  View,
  Text,
  ScrollView
} from 'react-native'
import { Constants, SQLite } from 'expo'
import { List, ListItem, FormInput } from 'react-native-elements'
const uuidv4 = require('uuid/v4');

import {addTodo, toggleTodo } from './actions'


const db = SQLite.openDatabase('todo.db')

class App extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        todo: {id: null, text: "", completed: false}
      }
    //   this.update = this.update.bind(this)
    //   this.addTodo = this.addTodo.bind(this)
    //   this.deleteTodo = this.deleteTodo.bind(this)
    //   this.updateInput = this.updateInput.bind(this)
    //   this.onTodoPress = this.onTodoPress.bind(this)
    }
  
    // update() {
    //   db.transaction(tx => {
    //     tx.executeSql(
    //       `select * from todos;`,
    //       null,
    //       (_, { rows: { _array } }) => this.setState({ list: _array })
    //     )
    //   })
    // }
  
    // componentDidMount() {
    //   db.transaction(tx => {
    //     tx.executeSql(
    //       'create table if not exists todos (id integer primary key not null, value text);',
    //       null,
    //       this.update()
    //     )
    //   })
    // }
  
    // addTodo() {
    //   if (this.state.input.value) {
    //     db.transaction(
    //       tx => {
    //         tx.executeSql('insert or replace into todos (id, value) values (?, ?)',
    //           [this.state.input.id, this.state.input.value],
    //           () => {
    //             this.setState({ input: {} })
    //             this.update()
    //           }
    //         )
    //       }
    //     )
    //   }
    // }
  
    // deleteTodo(id) {
    //   db.transaction(
    //     tx => {
    //       tx.executeSql('delete from todos where id = ?;',
    //         [id],
    //         this.update()
    //       )
    //     }
    //   )
    // }
  
    // updateInput(value) {
    //   const newInput = update(this.state.input, {
    //     value: { $set: value }
    //   });
    //   this.setState({ input: newInput })
    // }
    // onTodoPress(item) {
    //   this.setState({ input: item })
    //   this.todoInput.focus()
    // }
  
    render() {
        console.log(uuidv4())
        console.log(this.state)
        console.log(this.props)
        const todos = this.props.todos.filter((item)=>{
            return !item.completed
        })
      return (
        <View style={styles.container}>
          <View style={styles.statusBar} />
          <View style={styles.inputView}>
            <FormInput
              inputStyle={{ textAlign: 'center' }}
              placeholder='ماذا تريد ان تفعل اليوم!'
              value={this.state.todo.text}
              onChangeText={value => {
                  let todo = this.state.todo
                  todo.text = value
                  this.setState({todo})
              }}
              onSubmitEditing={()=>{this.props.addTodo(this.state.todo)}}
              ref={input => {
                this.todoInput = input;
              }}
            />
          </View>
          <ScrollView style={styles.list}>
            <List>
              {
                todos.map(item => (
                  <ListItem
                    key={item.id}
                    title={item.text}
                    onPress={() => this.onTodoPress(item)}
                    titleNumberOfLines={100}
                    titleStyle={{ textAlign: 'right' }}
                    leftIcon={{ type: 'feather', name: 'trash' }}
                    // leftIconOnPress={() => this.deleteTodo(item.id)}
                    leftIconOnPress={() => this.props.toggleTodo(item.id)}

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
  
  
  const mapStateToProps = state => ({todos: state.todos});
  
  const mapDispatchToProps = dispatch => ({
    addTodo: ({id, text, completed}) => {
        id = id || uuidv4()
        dispatch(addTodo({id, text, completed}))},
    toggleTodo: id => dispatch(toggleTodo(id))
  })
  
  export default connect(mapStateToProps,mapDispatchToProps)(App)