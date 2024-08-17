"use client";

import React, { useEffect, useState } from "react";

import axios from "axios";

interface UserData {
  name: string[];
  email: string[];
}

export default function Home() {
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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h3>Next.js Python Flask</h3>
      {userData ? (
        userData.name.map((user, index) => (
          <div key={index}>{user}</div>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </main>
  );
}