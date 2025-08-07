export default function TaskItem({ task }) {
    return (
      <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md shadow-sm hover:bg-gray-100">
        <span className="text-gray-700">{task.text}</span>
      </div>
    );
  }
  