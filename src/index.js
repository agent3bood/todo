import React from "react";
import { connect } from "react-redux";
import { StyleSheet, View, ScrollView } from "react-native";
import { Constants, SQLite } from "expo";
import { List, ListItem, FormInput } from "react-native-elements";
const uuidv4 = require("uuid/v4");

import { addTodo, toggleTodo } from "./actions";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todo: { id: null, text: "", completed: false }
    };
    this.resetInput = this.resetInput.bind(this);
    this.onTodoPress = this.onTodoPress.bind(this);
  }

  componentDidMount() {
    try {
      const db = SQLite.openDatabase("todo.db");
      // migrate to new redux
      db.transaction(tx => {
        tx.executeSql(
          `select * from todos;`,
          null,
          (_, { rows: { _array } }) => {
            _array.map(val => {
              this.props.addTodo({ text: val.value });
              db.transaction(tx2 => {
                tx2.executeSql("delete from todos where id = ?;", [val.id]);
              });
            });
          }
        );
      });
    } catch (err) {
      console.log(err);
    }
  }

  onTodoPress({ id, text, completed }) {
    this.setState({ todo: { id, text, completed } });
    this.todoInput.focus();
  }

  resetInput() {
    this.setState({ todo: { id: null, text: "", completed: false } });
  }

  render() {
    const todos = this.props.todos.filter(item => {
      return !item.completed;
    });
    return (
      <View style={styles.container}>
        <View style={styles.statusBar} />
        <View style={styles.inputView}>
          <FormInput
            inputStyle={{ textAlign: "center" }}
            placeholder="ماذا تريد ان تفعل اليوم!"
            value={this.state.todo.text}
            onChangeText={value => {
              let todo = this.state.todo;
              todo.text = value;
              this.setState({ todo });
            }}
            onSubmitEditing={() => {
              this.props.addTodo(this.state.todo);
              this.resetInput();
            }}
            ref={input => {
              this.todoInput = input;
            }}
          />
        </View>
        <ScrollView style={styles.list}>
          <List>
            {todos.map(item => (
              <ListItem
                key={item.id}
                title={item.text}
                disabled={item.id === this.state.todo.id}
                onPress={() => this.onTodoPress(item)}
                titleNumberOfLines={100}
                titleStyle={{ textAlign: "right" }}
                leftIcon={{ type: "feather", name: "trash" }}
                leftIconOnPress={() => this.props.toggleTodo(item.id)}
                rightIcon={<View />}
              />
            ))}
          </List>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  statusBar: {
    height: Constants.statusBarHeight
  },
  inputView: {
    height: 40,
    padding: 5
  },
  list: {
    flex: 1
  }
});

const mapStateToProps = state => ({ todos: state.todos });

const mapDispatchToProps = dispatch => ({
  addTodo: ({ id, text, completed }) => {
    id = id || uuidv4();
    dispatch(addTodo({ id, text, completed }));
  },
  toggleTodo: id => dispatch(toggleTodo(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
