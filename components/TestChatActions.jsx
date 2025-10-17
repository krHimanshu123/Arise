// Simple test to verify chat components are working
import { runAction } from "@/lib/chat-actions";

export default function TestChatActions() {
  const testActions = async () => {
    try {
      // Test a simple action that doesn't require external APIs
      const timeResult = await runAction("get_time", {});
      console.log("Time action result:", timeResult);
      
      // Test a calculation action
      const calcResult = await runAction("calculate", { expression: "2 + 2" });
      console.log("Calculate action result:", calcResult);
      
      return { success: true, timeResult, calcResult };
    } catch (error) {
      console.error("Test failed:", error);
      return { success: false, error: error.message };
    }
  };

  return (
    <div className="p-4">
      <h2>Chat Actions Test</h2>
      <button 
        onClick={testActions}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Test Actions
      </button>
      
    </div>
  );
}
