import React from 'react'
import {Text,Avatar,HStack} from"@chakra-ui/react"

const Message = ({text,uri,user="other"}) => {
  return (
    <HStack alignSelf={user==="me"?"flex-end":"flex-start"} borderRadius={"base"} bg={user==="me"?"green.100":"gray.100"} paddingX={user==="me"?"3":"2"} paddingY="2">
        {user==="other" && <Avatar src={uri}/>}
      <Text>{text}</Text>
      {user==="me" && <Avatar src={uri}/>}
    </HStack>
  )
}

export default Message