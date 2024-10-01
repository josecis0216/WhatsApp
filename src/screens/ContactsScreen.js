import { useState, useEffect } from "react";
import { FlatList, Pressable, Text } from "react-native";
import ContactListItem from "../components/ContactListItem";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { API, graphqlOperation, Auth } from "aws-amplify";

import { listUsers } from "../graphql/queries";
import { createChatRoom, createUserChatRoom } from "../graphql/mutations";

import { getCommonChatRoomWithUser } from "../services/chatRoomService";

const ContactsScreen = () => {
  const [users, setUsers] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    API.graphql(graphqlOperation(listUsers)).then((result) => {
      setUsers(result.data?.listUsers?.items);
    });
  }, []);

  const createChatRoomWithTheUser = async (user) => {
    console.warn("pressed");
    //check if we already have a chatroom with user
    const existingChatRoom = await getCommonChatRoomWithUser(user.id);
    //console.log(existingChatRoom.chatRoom);
    if (existingChatRoom) {
      navigation.navigate("Chat", {
        id: existingChatRoom.chatRoom.id,
        name: user.name,
      });
      return;
    }

    //create new chat rooom
    const newChatRoomData = await API.graphql(
      graphqlOperation(createChatRoom, { input: {} })
    );
    console.log(newChatRoomData);

    if (!newChatRoomData.data?.createChatRoom) {
      console.log("error creating chat room");
    }
    const newChatRoom = newChatRoomData.data?.createChatRoom;
    console.log(newChatRoom);

    //add clicked user to the chatroom
    await API.graphql(
      graphqlOperation(createUserChatRoom, {
        input: { chatRoomId: newChatRoom.id, userId: user.id },
      })
    );

    //add the auth user to the chat room
    const authUser = await Auth.currentAuthenticatedUser();
    await API.graphql(
      graphqlOperation(createUserChatRoom, {
        input: { chatRoomId: newChatRoom.id, userId: authUser.attributes.sub },
      })
    );

    //navigate to the newly created chat room
    navigation.navigate("Chat", { id: newChatRoom.id, name: user.name });
  };

  return (
    <FlatList
      data={users}
      renderItem={({ item }) => <ContactListItem user={item} onPress={() => {createChatRoomWithTheUser(item)}}/>}
      style={{ backgroundColor: "white" }}
      ListHeaderComponent={() => (
        <Pressable
          onPress={() => {
            navigation.navigate("New Group");
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 15,
            paddingHorizontal: 20,
          }}
        >
          <MaterialIcons
            name="group"
            size={24}
            color="royalblue"
            style={{
              marginRight: 20,
              backgroundColor: "gainsboro",
              padding: 7,
              borderRadius: 20,
              overflow: "hidden",
            }}
          />
          <Text style={{ color: "royalblue", fontSize: 16 }}>New Group</Text>
        </Pressable>
      )}
    />
  );
};

export default ContactsScreen;
