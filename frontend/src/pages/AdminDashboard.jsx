export default function AdminDashboard() {
    // Static example data
    const usersData = [
      {
        _id: "1",
        email: "alice@example.com",
        tasks: [
          { text: "Complete UI for dashboard", date: "2025-08-06" },
          { text: "Review PR #42", date: "2025-08-06" },
        ],
      },
      {
        _id: "2",
        email: "bob@example.com",
        tasks: [
          { text: "Fix login bug", date: "2025-08-07" },
          { text: "Update task API", date: "2025-08-07" },
        ],
      },
    ];
  
    return (
      <div className="p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-extrabold text-blue-800 mb-8 text-center">
          👨‍💼 Admin Dashboard
        </h1>
  
        {usersData.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No tasks found.</p>
        ) : (
          <div className="grid gap-6">
            {usersData.map((user) => (
              <div
                key={user._id}
                className="bg-white shadow-lg rounded-lg p-6 border border-gray-200"
              >
                <h2 className="text-xl font-bold text-blue-600 mb-2">
                  {user.email}
                </h2>
                <ul className="list-disc ml-6 text-gray-700">
                  {user.tasks.map((task, index) => (
                    <li key={index} className="mb-1">
                      <span className="font-medium text-black">{task.text}</span>{" "}
                      <span className="text-sm text-gray-500">({task.date})</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  