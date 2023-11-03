import {Box,Container,VStack,Button,Input,HStack} from "@chakra-ui/react";
import Message from "./Components/Message";
import {GoogleAuthProvider,signInWithPopup,getAuth,onAuthStateChanged,signOut} from "firebase/auth";
import {app} from "./Components/firebase";
import { useEffect, useState,useRef } from "react";
import {getFirestore,addDoc,collection, serverTimestamp,onSnapshot,query,orderBy,getDocs,deleteDoc,doc} from "firebase/firestore";

const auth=getAuth(app);
const db=getFirestore(app);
const loginHndler=()=>
{
   const provider= new GoogleAuthProvider();
   signInWithPopup(auth,provider);
};
const logoutHandler=()=>
{
  signOut(auth);
}
const deleteAllDocuments = async () => {
  try {
    const collectionRef = collection(db, 'Messages'); // Replace 'Messages' with the actual name of your collection

    // Get all documents in the collection
    const querySnapshot = await getDocs(collectionRef); // Use getDocs to retrieve the documents

    // Iterate over each document and delete it
    querySnapshot.forEach(async (oi) => {
      await deleteDoc(doc(db,"Messages",`${oi.id}`))
    });

  } catch (error) {
    console.error('Error deleting documents:', error);
  }
};
function App() {
  
  const[user,setUser]=useState(false);
  const[message,setMessage]=useState("");
  const[messages,setMessages]=useState([]);
  const divForScroll=useRef(null);
const submitHandler=async(e)=>
{
   e.preventDefault();

   try 
   {
      setMessage("");
      await addDoc(collection(db,"Messages"),{
        text:message,
        uid:user.uid,
        uri:user.photoURL,
        createdAt:serverTimestamp()
      }); 
      
      divForScroll.current.scrollIntoView({behaviour:"smooth"})
   }
  catch (error)
  {
    alert(error);
   }
  
};
  useEffect(()=>
  {
    const q=query(collection(db,"Messages"),orderBy("createdAt","asc"));
    const unsubscribe=onAuthStateChanged(auth,(data)=>{setUser(data)});
    const unsubscribeFormessage=onSnapshot(q,(snap)=>{setMessages(snap.docs.map((item)=>
    {
      const id=item.id;
      return {id ,...item.data()};
    })
    );
});
    return ()=>
    {
    unsubscribe();
    unsubscribeFormessage();
    };
  },[]);

  return (
    <Box bg={"telegram.100"}>
      {
        user?(<Container bg={"white"} h={"100vh"}>
        <VStack h={"full"} paddingY={"4"}>
          <Button colorScheme={"red"} width={"full"} onClick={logoutHandler}>LogOut</Button>
          <Button colorScheme={"red"} width={"full"} onClick={deleteAllDocuments}>Delete Conversation</Button>
          <VStack height={"full"} width={"full"} overflowY={"auto"} css={{"&::-webkit-scrollbar":{display:"none"}}}>
            {
              messages.map((item) => (<Message key={item.id} user={item.uid===user.uid ? "me":"other"} text={item.text} uri={item.uri}/>))
            }
            <div ref={divForScroll}></div>
          </VStack>
          <form onSubmit={submitHandler} style={{width:"100%"}}>
           <HStack>
           <Input value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="Type Here.."/>
           <Button colorScheme="purple" type="submit">Send</Button>
           </HStack>
          </form>
        </VStack>
      </Container>):<VStack h="100vh" justifyContent={"center"}><Button onClick={loginHndler}>Sign In with Google</Button></VStack>
      }
    </Box>
  );
}

export default App;