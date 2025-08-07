export default function TaskCard({ date, tasks }) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4 mb-4 hover:shadow-lg transition">
        <h2 className="text-sm text-gray-400 mb-2">📅 {date}</h2>
        <ul className="space-y-2">
          {tasks.map((task, index) => (
            <li key={index} className="text-gray-800 font-medium">
              🔹 {task.text}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  