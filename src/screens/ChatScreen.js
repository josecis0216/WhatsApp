import { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { useRoute, useNavigation } from '@react-navigation/native';
import Message from "../components/Message";
import InputBox from '../components/InputBox';

import bg from "../../assets/images/BG.png";

import { API, graphqlOperation, SortDirection } from "aws-amplify";
import { getChatRoom, listMessagesByChatRoom } from "../graphql/queries";
import { ActivityIndicator } from 'react-native-web';

const ChatScreen = () => {
  const [chatRoom, setChatRoom] = useState(null);
  const [messages, setMessages] = useState([]); 
  const route = useRoute();
  const navigation = useNavigation();

  const chatroomID = route.params.id;

  // fetch chat room
  useEffect(() => {
    API.graphql(
      graphqlOperation(getChatRoom, { id: chatroomID })
    ).then(
      (result) => setChatRoom(result.data?.getChatRoom)
    );
  }, [chatRoomID]);

  //fetch messages
  useEffect(() => {
    API.graphql(
      graphqlOperation(listMessagesByChatRoom, { chatroomID, sortDirection: "DESC"  })
    ).then(
      (result) => setMessages(result.data?.listMessagesByChatRoom?.items)
    );
  }, [chatRoomID])

  useEffect(() => {
    navigation.setOptions({ title: route.params.name });
  }, [route.params.name]);

  if (!chatRoom) {
    return <ActivityIndicator />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 90}
      style={styles.bg}
    >
      <ImageBackground source={bg} style={styles.bg}>
        <FlatList
          data={messages} //chatRoom.Messages.items
          renderItem={({ item }) => <Message message={item} />}
          style={{ padding: 10 }}
          inverted
        />
        <InputBox chatroom={chatRoom} />
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  list: {
    padding: 10,
  },
});

export default ChatScreen;
