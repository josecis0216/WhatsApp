import { FlatList } from "react-native";
import ChatListItem from "../../components/ChatListItem";
// import chats from "../../../assets/data/chats.json";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { listChatRooms } from "./queries";
import { useEffect, useState } from "react";

const ChatsScreen = () => {
  const [chatRoom, setChatRooms] = useState([]);
  const [mainUser, setMainUser] = useState([]);

  useEffect(() => {
    const fetchChatRooms = async () => {
      const authUser = await Auth.currentAuthenticatedUser();

      const response = await API.graphql(
        graphqlOperation(listChatRooms, { id: authUser.attributes.sub })
      );

      setMainUser(authUser);
      setChatRooms(response.data.getUser.ChatRooms.items);
    };

    fetchChatRooms();
  }, []);

  return (
    <FlatList
      data={chatRoom}
      renderItem={({ item }) => <ChatListItem chat={item.chatRoom} mainUser={mainUser} />}
      style={{ backgroundColor: 'white' }}
    />
  );
};

export default ChatsScreen;