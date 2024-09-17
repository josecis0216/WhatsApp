import { View, TextInput, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { createMessage } from "../../graphql/mutations";

import { useState } from "react";

const InputBox = ({ chatroomID }) => {
  const [text, setText] = useState("");

  const onSend = async () => {
    console.warn("Send a new message: ", text);

    const authUser = await Auth.currentAuthenticatedUser();

    const newMessage = {
      chatroomID,
      text,
      userID: authUser.attributes.sub,
    };

    await API.graphql(graphqlOperation(createMessage, { input: newMessage }));

    setText("");
  };

  return (
    <SafeAreaView>
      <AntDesign name="plus" size={24} color="royalblue" />
      <TextInput
        value={text}
        onChangeText={setText}
        multiline
        style={styles.input}
      />
      <MaterialIcons
        onPress={onSend}
        style={styles.send}
        name="send"
        size={16}
        color="white"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "whitesmoke",
    padding: 5,
    alignItems: "center",
  },
  input: {
    fontSize: 18,

    flex: 1,
    backgroundColor: "white",
    padding: 5,
    paddingHorizontal: 10,
    marginHorizontal: 10,

    borderRadius: 50,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "lightgray",
  },
  send: {
    backgroundColor: "royalblue",
    padding: 7,
    borderRadius: 15,
    overflow: "hidden",
  },
});

export default InputBox;
