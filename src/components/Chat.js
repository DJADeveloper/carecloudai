"use client";

import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/app/lib/supabase";
import { FaRobot, FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/context/UserContext";

// Updated fetchUsers function with more detailed logging
async function fetchUsers(currentUserId) {
  console.log("🔍 Fetching users for:", currentUserId);

  try {
    // First get the current user's profile to determine their role
    const { data: currentUserProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', currentUserId)
      .single();

    if (profileError) {
      console.error("❌ Error fetching current user profile:", profileError);
      return [];
    }

    console.log("👤 Current user profile:", currentUserProfile);

    // If user is a family member, get their family record
    let familyMembers = [];
    if (currentUserProfile.role === 'family') {
      const { data: familyRecord, error: familyError } = await supabase
        .from('family')
        .select('id, name, surname, email')
        .eq('email', currentUserProfile.email)
        .single();

      if (familyError) {
        console.error("❌ Error fetching family record:", familyError);
      } else if (familyRecord) {
        // Get all residents associated with this family member
        const { data: residents, error: residentsError } = await supabase
          .from('residents')
          .select(`
            id,
            fullname,
            roomid,
            carelevel,
            img
          `)
          .eq('familyid', familyRecord.id);

        if (residentsError) {
          console.error("❌ Error fetching residents:", residentsError);
        } else {
          console.log("👥 Found residents:", residents);
          familyMembers = residents;
        }
      }
    }

    // Fetch all users based on role
    let query = supabase
      .from('profiles')
      .select(`
        id,
        email,
        name,
        surname,
        role,
        created_at,
        updated_at
      `)
      .neq('id', currentUserId);

    // Filter users based on role
    if (currentUserProfile.role === 'family') {
      // Family members should only see staff
      query = query.eq('role', 'staff');
    } else if (currentUserProfile.role === 'staff') {
      // Staff can see family members and other staff
      query = query.in('role', ['staff', 'family']);
    } else if (currentUserProfile.role === 'admin') {
      // Admins can see everyone
      query = query.in('role', ['staff', 'family', 'admin']);
    }

    const { data: profiles, error: usersError } = await query;

    if (usersError) {
      console.error("❌ Error fetching users:", usersError);
      return [];
    }

    // Combine and format the results
    const mappedUsers = profiles.map(profile => ({
      id: profile.id,
      name: profile.name || profile.email?.split('@')[0] || 'Unknown',
      surname: profile.surname || '',
      email: profile.email,
      role: profile.role || 'user',
      created_at: profile.created_at
    }));

    // Add residents if user is family member
    if (currentUserProfile.role === 'family' && familyMembers.length > 0) {
      familyMembers.forEach(resident => {
        mappedUsers.push({
          id: resident.id,
          name: resident.fullname,
          role: 'resident',
          avatar: resident.img,
          careLevel: resident.carelevel,
          isResident: true
        });
      });
    }

    console.log("✅ Final users list:", {
      total: mappedUsers.length,
      byRole: mappedUsers.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {})
    });

    return mappedUsers;

  } catch (error) {
    console.error("❌ Error in fetchUsers:", error);
    return [];
  }
}

function ChatWithUsers() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const router = useRouter();
  const { user, loading: userLoading } = useCurrentUser();
  const [filterRole, setFilterRole] = useState("all");

  // Fetch users from Supabase
  useEffect(() => {
    if (user?.id) {
      loadUsers(user.id);
    }
  }, [user]);

  const loadUsers = async (currentUserId) => {
    console.log("🚀 Loading users for:", currentUserId);
    const fetchedUsers = await fetchUsers(currentUserId);
    setUsers(fetchedUsers);
  };

  // Fetch existing messages between user and selectedUser
  const fetchMessages = useCallback(async () => {
    if (!selectedUser || !user) return;
    
    console.log("📥 Fetching messages between:", user.id, "and", selectedUser.id);
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .or(
        `and(sender.eq.${user.id},receiver.eq.${selectedUser.id}),and(sender.eq.${selectedUser.id},receiver.eq.${user.id})`
      )
      .order("created_at", { ascending: true });
      
    if (error) {
      console.error("❌ Error fetching messages:", error.message);
    } else {
      console.log("✅ Messages fetched:", data?.length);
      setMessages(data || []);
    }
  }, [user, selectedUser]);

  useEffect(() => {
    if (selectedUser && user) {
      fetchMessages();
    }
  }, [selectedUser, fetchMessages, user]);

  // Subscribe to realtime messages
  useEffect(() => {
    if (!selectedUser || !user) return;

    console.log("🔌 Setting up realtime subscription");
    const channel = supabase
      .channel("direct-chat")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `receiver=eq.${user.id},sender=eq.${selectedUser.id}`,
        },
        (payload) => {
          console.log("📨 New message received");
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `receiver=eq.${selectedUser.id},sender=eq.${user.id}`,
        },
        (payload) => {
          console.log("📨 New message sent");
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      console.log("♻️ Cleaning up subscription");
      supabase.removeChannel(channel);
    };
  }, [user, selectedUser]);

  // Send a new message
  const handleSend = async () => {
    if (input.trim() === "" || !selectedUser || !user) return;
    
    console.log("📤 Sending message");
    const newMessage = {
      sender: user.id,
      receiver: selectedUser.id,
      message: input,
    };
    
    const { error } = await supabase.from("chat_messages").insert([newMessage]);
    if (error) {
      console.error("❌ Error sending message:", error.message);
    } else {
      console.log("✅ Message sent");
      setInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  if (userLoading) {
    return <div className="p-4 text-gray-600">Loading...</div>;
  }

  if (!user) {
    return <div className="p-4 text-gray-600">Please log in to use the chat.</div>;
  }

  return (
    <div className="flex h-full">
      {/* Sidebar: List of chat partners */}
      <div className="w-1/4 border-r border-gray-300 p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Chat Users</h2>
        
        {/* Role filters */}
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => setFilterRole("all")}
            className={`px-3 py-1 text-sm rounded-full ${
              filterRole === "all"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            All
          </button>
          {["staff", "family", "resident"].map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-3 py-1 text-sm rounded-full ${
                filterRole === role
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>

        {/* Users list */}
        <div className="space-y-2">
          {users
            .filter(user => filterRole === "all" || user.role === filterRole)
            .map((user) => (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`w-full p-3 text-left rounded-lg transition-colors ${
                  selectedUser?.id === user.id
                    ? "bg-blue-100 text-blue-800"
                    : "hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center">
                  {user.avatar && (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                  )}
                  <div>
                    <div className="font-medium">
                      {user.name} {user.surname}
                    </div>
                    {!user.isResident && (
                      <div className="text-xs text-gray-500">
                        {user.email}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 capitalize">
                      {user.role}
                      {user.careLevel && ` • Care Level: ${user.careLevel}`}
                    </div>
                  </div>
                </div>
              </button>
            ))}
        </div>

        {users.length === 0 && (
          <div className="text-center text-gray-500 mt-4">
            No users found
          </div>
        )}
      </div>
      {/* Conversation Panel */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedUser ? (
          <>
            <div className="p-4 border-b border-gray-300">
              <h2 className="text-xl font-semibold">
                Chat with {selectedUser.name} {selectedUser.surname}
              </h2>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-4 flex ${
                    msg.sender === user.id ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="flex items-end space-x-2 max-w-md">
                    {msg.sender !== user.id && (
                      <div className="flex-shrink-0">
                        <FaRobot className="text-blue-500" size={24} />
                      </div>
                    )}
                    <div
                      className={`rounded-lg p-3 shadow ${
                        msg.sender === user.id
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-white text-gray-900 border border-gray-200 rounded-bl-none"
                      }`}
                    >
                      <p>{msg.message}</p>
                    </div>
                    {msg.sender === user.id && (
                      <div className="flex-shrink-0">
                        <FaUser className="text-white bg-blue-500 rounded-full p-1" size={24} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-300">
              <div className="flex items-center">
                <textarea
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 rounded-l-lg p-2 resize-none focus:outline-none"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                />
                <button
                  onClick={handleSend}
                  className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 focus:outline-none"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-600">Select a chat partner to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatWithUsers;
