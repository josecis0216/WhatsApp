import { FlatList } from "react-native";
import ChatListItem from "../components/ChatListItem";
import chats from "../../assets/data/chats.json";

const chat = {
  id: "1",
  user: {
    image:
      "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/lukas.jpeg",
    name: "Lukas",
  },
  lastMessage: {
    text: "Oke",
    createdAt: "07:30",
  },
};

const ChatsScreen = () => {
    return (
      <FlatList
        data={chats}
        renderItem={({ item }) => <ChatListItem chat={item} />}
        style={{ backgroundColor: 'white' }}
      />
    );
  };

export default ChatsScreen;