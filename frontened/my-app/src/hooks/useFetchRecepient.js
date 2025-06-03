import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/services";

// This custom hook is used to fetch the details of the recipient user in a chat.
// It is useful when we only have the recipient's ID but need their full details (e.g., name, email, etc.).

export const useFetchRecipient = (chat, user) => {
  // State to store the recipient's user data
  const [recipientUser, setRecipientUser] = useState(null);

  // State to store any error that occurs during the fetch process
  const [error, setError] = useState(null);

  // Extract the recipient's ID from the chat's members array
  // The recipient is the user whose ID is not equal to the logged-in user's ID
  const recipientId = chat?.members.find((id) => id !== user?._id);  //have the  id of user which is currently receiving the message

  // useEffect to fetch the recipient's details whenever the recipientId changes
  useEffect(() => {
    const getUser = async () => {
      // If recipientId is not available, exit early
      if (!recipientId) return null;

      // Fetch the recipient's details from the backend using their ID
      const response = await getRequest(`${baseUrl}/users/find/${recipientId}`);

      // If there is an error in the response, update the error state
      if (response.error) {
        return setError(response.error);
      }

      // If the fetch is successful, update the recipientUser state with the fetched data
      setRecipientUser(response);
    };

    // Call the function to fetch the recipient's details
    getUser();
  }, [recipientId]); // Dependency array ensures this runs whenever recipientId changes

  // Return the recipient's user data and any error to the component using this hook
  return { recipientUser, error }; //extact this when this function you will call....
};




