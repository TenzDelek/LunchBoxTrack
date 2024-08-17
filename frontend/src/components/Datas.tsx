"use client";

import React, { useEffect, useState } from "react";

import axios from "axios";

interface UserData {
  name: string[];
  email: string[];
}

const Datas = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    useEffect(() => {
        fetchData();
      }, [])
    
      const fetchData = async () => {
        try {
          const result = await axios.get<UserData>("http://127.0.0.1:5000/api/user");
          console.log(result.data);
          setUserData(result.data);
        } catch (err) {
          console.log("Something Wrong", err);
        }
      }
    
  return (
    <div>
         {userData ? (
        userData.name.map((user, index) => (
          <div key={index}>{user}</div>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default Datas