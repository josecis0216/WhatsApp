import { API, graphqlOperation, Auth } from "aws-amplify";

export const getCommonChatRoomWithUser = async (userId) => {
  const authUser = await Auth.currentAuthenticatedUser();
  //get all chatrooms of user 1
  const response = await API.graphql(
    graphqlOperation(listChatRooms, { id: authUser.attributes.sub })
  );
  const chatRooms = response.data?.getUser?.ChatRooms?.items || [];

  const chatRoom = chatRooms.find((chatRoomitem) => {
    return (
      chatRoomitem.chatRoom.users.items.length === 2 &&
      chatRoomitem.chatRoom.users.items.some(
        (userItem) => userItem.user.id === userId
      )
    );
  });
  return chatRoom;
  //get all chatrooms of user 2

  //remove chatrooms with more than 2 users

  //find the common chat rooms
};

export const listChatRooms = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      ChatRooms {
        items {
          chatRoom {
            id
            users {
              items {
                user {
                  id
                }
              }
            }
          }
        }
      }
    }
  }
`;
