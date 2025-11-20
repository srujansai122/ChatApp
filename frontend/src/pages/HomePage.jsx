import React, { useEffect, useState } from "react";
import NoChatsContainer from "../components/NoChatsContainer";
import SelectedChatContainer from "../components/SelectedChatContainer";
import { useHomepageStore } from "../store/useHomePageStore";
import { Users, Loader2, Search } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const HomePage = () => {
  const { selectedUser, setSelectedUser, users, getUsers, isUsersLoading } =
    useHomepageStore();
  const { onlineUsers } = useAuthStore();

  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredAndSortedUsers = users
    .filter((user) => {
      const isOnline = onlineUsers.includes(user._id);
      const matchesSearch = user.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      if (filter === "online") return isOnline && matchesSearch;
      if (filter === "offline") return !isOnline && matchesSearch;
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      }
    });

  return (
    <div className="flex flex-col sm:flex-row h-screen">
      {/* Sidebar - Left Half */}
      <aside className="basis-full sm:basis-1/2 bg-gray-900 text-white p-4 overflow-y-auto h-full">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Friends
        </h2>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name..."
              className="input input-sm w-full pr-10 text-sm bg-gray-800 text-white placeholder-gray-400"
            />
            <Search className="absolute right-2 top-2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 mb-4">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <span className="text-sm font-semibold text-white">Filter:</span>
            <div className="flex gap-1 flex-wrap">
              {["all", "online", "offline"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-2 py-1 rounded text-xs ${
                    filter === type
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap justify-between items-center gap-2">
            <span className="text-sm font-semibold text-white">Sort by:</span>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-800 text-white text-xs px-2 py-1 rounded"
              >
                <option value="name">Name</option>
                <option value="date">Date Joined</option>
              </select>
              <button
                onClick={() =>
                  setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                }
                className="px-2 py-1 rounded text-xs bg-indigo-600 text-white"
              >
                {sortOrder === "asc" ? "Asc" : "Desc"}
              </button>
            </div>
          </div>
        </div>

        {/* User List */}
        <ul className="space-y-2 w-full pb-4">
          {isUsersLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="animate-spin w-6 h-6 text-white" />
            </div>
          ) : filteredAndSortedUsers.length === 0 ? (
            <p className="text-sm text-gray-400 text-center">No users found</p>
          ) : (
            filteredAndSortedUsers.map((user) => {
              const isSelected = selectedUser?._id === user._id;
              const isOnline = onlineUsers.includes(user._id);

              return (
                <li key={user._id}>
                  <button
                    onClick={() => setSelectedUser(user)}
                    className={`w-full flex items-center justify-between px-2 py-2 rounded ${
                      isSelected ? "bg-gray-800" : "hover:bg-gray-800"
                    }`}
                    aria-label={`Chat with ${user.name}`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar || "/default_pic.png"}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm font-medium">{user.name}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isOnline ? "bg-green-500" : "bg-red-500"
                        }`}
                        title={isOnline ? "Online" : "Offline"}
                      />
                      <span className="text-xs text-white">
                        {isOnline ? "Online" : "Offline"}
                      </span>
                    </div>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </aside>

      {/* Chat Area - Right Half */}
      <main className="basis-full sm:basis-1/2 bg-gray-100 p-4 overflow-y-auto h-full">
        {selectedUser ? <SelectedChatContainer /> : <NoChatsContainer />}
      </main>
    </div>
  );
};

export default HomePage;
