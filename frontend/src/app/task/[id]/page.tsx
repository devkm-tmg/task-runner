"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function TaskPage() {
  const [task, setTask] = useState<any>(null);
  const [subTasks, setSubTasks] = useState<any[]>([]); // サブタスク用の状態を追加
  const [id, setId] = useState<string | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // モーダル開閉用の状態
  const [selectedSubTask, setSelectedSubTask] = useState<any>(null); // クリックされたサブタスク
  const [newSubTaskName, setNewSubTaskName] = useState<string>(""); // 新しいサブタスク名

  const params = useParams();

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/main_tasks/${params.id}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Task not found");
        }
        return response.json();
      })
      .then((data) => {
        setTask(data);
      })
      .catch((error) => {
        console.error("Error fetching task:", error);
      });
  }, [params.id]);

  useEffect(() => {
    if (task) {
      const token = localStorage.getItem("token");
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/main_tasks/${task.id}/sub_tasks`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Subtasks not found");
          }
          return response.json();
        })
        .then((data) => {
          setSubTasks(data); // サブタスクデータをセット
        })
        .catch((error) => {
          console.error("Error fetching sub tasks:", error);
        });
    }
  }, [task]);

  // タスクが見つからない場合の表示
  if (!task) {
    return <div>Loading task...</div>;
  }

  // 円形配置用のスタイル
  const getCircleStyle = (size: number) => ({
    width: `${size}px`, // 円の大きさ
    height: `${size}px`, // 円の大きさ
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  });

  // 最大25個のサブタスク枠を作る
  const maxSubTasks = 25;
  const subTaskArr = [...subTasks, ...new Array(maxSubTasks - subTasks.length).fill(null)];

  // サブタスクを内側（10個）と外側（15個）に分ける
  const innerCircleTasks = subTaskArr.slice(0, 10); // 最初の10個を内側
  const outerCircleTasks = subTaskArr.slice(10); // 11個目以降を外側

  // モーダルを開く関数
  const openModal = (subTask: any) => {
    setSelectedSubTask(subTask); // クリックされたサブタスクをセット
    setNewSubTaskName(subTask ? subTask.name : ""); // サブタスク名をセット
    setIsModalOpen(true);
  };

  // モーダルを閉じる関数
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSubTask(null); // 選択されたサブタスクをリセット
  };

  // サブタスク名を更新する関数
  const handleSubTaskUpdate = () => {
    if (selectedSubTask) {
      const updatedSubTask = { ...selectedSubTask, name: newSubTaskName };
      setSubTasks((prevSubTasks) =>
        prevSubTasks.map((subTask) =>
          subTask.id === updatedSubTask.id ? updatedSubTask : subTask
        )
      );
      closeModal(); // モーダルを閉じる
    }
  };

  return (
    <div className="overflow-auto">
      <div className="relative w-[600px] h-[600px] flex items-center justify-center m-auto">
        {/* メインタスク */}
        <div
          className="absolute z-30 w-[120px] h-[120px] rounded-full bg-red-500 flex items-center justify-center text-white text-xl"
        >
          {task.name}
        </div>

        {/* 内側の円形サブタスク配置 */}
        <div
          className="absolute z-20"
          style={getCircleStyle(300)} // 内側の円は300px
        >
          {innerCircleTasks.map((subTask, index) => {
            const totalTasks = innerCircleTasks.length;
            const angle = (360 / totalTasks) * index; // サブタスクを均等に回転させる

            return (
              <div
                key={index}
                style={{
                  position: "absolute",
                  transform: `rotate(${angle}deg) translateY(-140px) rotate(${-angle}deg)`, // Y方向のオフセットを変更して距離を調整
                  transformOrigin: "center center",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "80px",
                  height: "80px",
                  backgroundColor: subTask ? "#4B8DFF" : "#ddd", // サブタスクがない場合はグレー
                  borderRadius: "50%",
                  color: subTask ? "white" : "#888", // サブタスクがない場合は文字色をグレー
                  textAlign: "center",
                  fontSize: "12px",
                  opacity: subTask ? 1 : 0.5, // サブタスクがない場合は少し透明に
                  cursor: "pointer",
                }}
                onClick={() => openModal(subTask)}
              >
                {subTask ? subTask.name : ""}
              </div>
            );
          })}
        </div>

        {/* 外側の円形サブタスク配置 */}
        <div
          className="absolute z-10"
          style={getCircleStyle(450)} // 外側の円は450px
        >
          {outerCircleTasks.map((subTask, index) => {
            const totalTasks = outerCircleTasks.length;
            const angle = (360 / totalTasks) * index; // サブタスクを均等に回転させる

            return (
              <div
                key={index}
                style={{
                  position: "absolute",
                  transform: `rotate(${angle}deg) translateY(-230px) rotate(${-angle}deg)`, // Y方向のオフセットを変更して距離を調整
                  transformOrigin: "center center",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "80px",
                  height: "80px",
                  backgroundColor: subTask ? "#4B8DFF" : "#ddd", // サブタスクがない場合はグレー
                  borderRadius: "50%",
                  color: subTask ? "white" : "#888", // サブタスクがない場合は文字色をグレー
                  textAlign: "center",
                  fontSize: "12px",
                  opacity: subTask ? 1 : 0.5, // サブタスクがない場合は少し透明に
                  cursor: "pointer",
                }}
                onClick={() => openModal(subTask)}
              >
                {subTask ? subTask.name : ""}
              </div>
            );
          })}
        </div>
      </div>

      {/* モーダル */}
      {isModalOpen && (
        <div className="fixed z-40 inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl mb-4">Edit Subtask</h2>
            <input
              type="text"
              value={newSubTaskName}
              onChange={(e) => setNewSubTaskName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="Enter subtask name"
            />
            <div className="flex justify-between">
              <button
                onClick={closeModal}
                className="bg-gray-400 text-white p-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubTaskUpdate}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Complete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
