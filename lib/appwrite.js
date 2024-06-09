import { Alert } from 'react-native';
import { Client, Account, ID, Avatars, Databases, Query } from 'react-native-appwrite';

export const config = {
  endpoint: 'https://cloud.appwrite.io/v1',
  platform: 'com.atom.aora',
  projectId: '664efe700014a7d9fe3f',
  databaseId: '664effe3002ccf9f7c02',
  userCollectionId: '664f001000178eb801af',
  videoCollectionId: '664f008800055f93d944',
  storageId: '664f02c1002ea0381c8d'
}

// const {
//     endpoint,
//     platform,
//     projectId,
//     databaseId,
//     userCollectionId,
//     videoCollectionId,
//     storageId,
// } = config

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId)
    .setPlatform(config.platform) // YOUR application ID
;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
        ID.unique(),
        email,
        password,
        username
    )

    if(!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username)

    await signIn(email, password)

    const newUser = await databases.createDocument(
        config.databaseId,
        config.userCollectionId,
        ID.unique(),
        {
            accountId: newAccount.$id,
            email: email,
            username: username,
            avatar: avatarUrl
        }
    );
    console.log('user created succefully');
    return newUser
  } catch (error) {
    console.log(error);
    throw new Error(error)
  }
}

export const signIn = async (email, password) => {
    try {
        // const prevSession = account.getSession("currrent")
        // if(prevSession) {
        //     account.deleteSession("current")
        //     console.log("deleted previous session")   
        //     return
        // }
        const session = await account.createEmailPasswordSession(email, password)
        
        return session;
    } catch (error) {
        throw new Error(error)
    }
}

const getAccount = async () => {
    try {
      const currentAccount = await account.get();
        
      console.log("this acc here", currentAccount)
      return currentAccount;
    } catch (error) {
        console.log("get acc :", error)
      throw new Error(error);
    }
  }

export const getCurrentUser = async () => {
    try {
        const currentAccount = await getAccount();

        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal("accountId", currentAccount.$id)]

        );
        if(!currentUser) throw Error
        // console.log("acc1", currentAccount)
        // console.log("acc2", currentUser.documents)
        return currentUser.documents[0]
    } catch (error) {
        console.log("get user : ", error);
        Alert.alert("Error", "Error creating session");
        return null;
    }
}

export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId
        )

        return posts.documents;
    } catch (error) {
        throw new Error(error)
    }
}
export const getLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId
            // [Query.orderDesc('$createdAt', Query.limit(7))]
        )

        return posts.documents
    } catch (error) {
        throw new Error(error)
    }
}